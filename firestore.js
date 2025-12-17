// ============================================================================
// FIRESTORE DATABASE FUNCTIONS
// ============================================================================

async function saveToFirestore(entry) {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized, skipping cloud save');
        return;
    }
    
    try {
        await db.collection('users').doc(user.uid).collection('entries').add(entry);
        console.log('Entry saved to Firestore');
    } catch (error) {
        console.error('Error saving to Firestore:', error);
    }
}

async function loadFromFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized');
        return;
    }
    
    try {
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('entries')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();
        
        const entries = [];
        snapshot.forEach(doc => {
            entries.push({ id: doc.id, ...doc.data() });
        });
        
        state.entries = entries;
        console.log('Loaded', entries.length, 'entries from Firestore');
        
        saveToUserStorage('entries', JSON.stringify(entries));
        displayEntries();
    } catch (error) {
        console.error('Error loading from Firestore:', error);
        loadEntriesFromLocalStorage();
    }
}

async function deleteFromFirestore(entryId) {
    const user = window.currentUser;
    if (!user || !window.db || !entryId) {
        return;
    }
    
    try {
        await db.collection('users').doc(user.uid).collection('entries').doc(entryId).delete();
        console.log('Entry deleted from Firestore');
    } catch (error) {
        console.error('Error deleting from Firestore:', error);
    }
}

async function clearFirestoreEntries() {
    const user = window.currentUser;
    if (!user || !window.db) {
        return;
    }
    
    try {
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('entries')
            .get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log('All entries cleared from Firestore');
    } catch (error) {
        console.error('Error clearing Firestore:', error);
    }
}

function loadEntriesFromLocalStorage() {
    const saved = loadFromUserStorage('entries');
    if (saved) {
        try {
            state.entries = JSON.parse(saved);
            console.log('Loaded', state.entries.length, 'entries from localStorage (backup)');
            displayEntries();
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            state.entries = [];
        }
    }
}

// ============================================================================
// CUSTOM SLIDERS FIRESTORE FUNCTIONS
// ============================================================================

async function saveCustomSlidersToFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized, skipping custom sliders save');
        return;
    }
    
    try {
        const customSliders = {
            customExternal: state.customExternal,
            customSupports: state.customSupports,
            lastUpdated: new Date().toISOString()
        };
        
        await db.collection('users').doc(user.uid).set({
            customSliders: customSliders
        }, { merge: true });
        
        console.log('Custom sliders saved to Firestore');
    } catch (error) {
        console.error('Error saving custom sliders to Firestore:', error);
    }
}

async function loadCustomSlidersFromFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized');
        return;
    }
    
    try {
        const doc = await db.collection('users').doc(user.uid).get();
        
        if (doc.exists && doc.data().customSliders) {
            const customSliders = doc.data().customSliders;
            
            if (customSliders.customExternal) {
                state.customExternal = customSliders.customExternal;
            }
            if (customSliders.customSupports) {
                state.customSupports = customSliders.customSupports;
            }
            
            console.log('Loaded custom sliders from Firestore');
            
            // Save to localStorage as backup
            saveState();
        } else {
            console.log('No custom sliders found in Firestore, loading from localStorage');
            loadState();
        }
    } catch (error) {
        console.error('Error loading custom sliders from Firestore:', error);
        // Fallback to localStorage
        loadState();
    }
}
