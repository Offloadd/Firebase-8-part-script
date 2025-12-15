// ============================================================================
// USER-SPECIFIC STORAGE FUNCTIONS
// ============================================================================

function getUserStorageKey(key) {
    const user = window.currentUser;
    if (!user) return key;
    return `offload_${user.uid}_${key}`;
}

function saveToUserStorage(key, value) {
    const userKey = getUserStorageKey(key);
    localStorage.setItem(userKey, typeof value === 'string' ? value : JSON.stringify(value));
}

function loadFromUserStorage(key) {
    const userKey = getUserStorageKey(key);
    return localStorage.getItem(userKey);
}

function saveState() {
    try {
        const stateToSave = {
            customExternal: state.customExternal,
            customSupports: state.customSupports,
            baselineVisible: Object.keys(state.baseline).reduce((acc, key) => {
                acc[key] = state.baseline[key].visible;
                return acc;
            }, {}),
            internalSelfVisible: Object.keys(state.internalSelf).reduce((acc, key) => {
                acc[key] = state.internalSelf[key].visible;
                return acc;
            }, {}),
            externalAreasVisible: Object.keys(state.externalAreas).reduce((acc, key) => {
                acc[key] = state.externalAreas[key].visible;
                return acc;
            }, {}),
            supportsVisible: Object.keys(state.supports).reduce((acc, key) => {
                acc[key] = state.supports[key].visible;
                return acc;
            }, {})
        };
        saveToUserStorage('offloadState', JSON.stringify(stateToSave));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        const saved = loadFromUserStorage('offloadState');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            if (parsed.customExternal) {
                state.customExternal = parsed.customExternal;
            }
            if (parsed.customSupports) {
                state.customSupports = parsed.customSupports;
            }
            
            if (parsed.baselineVisible) {
                Object.keys(parsed.baselineVisible).forEach(key => {
                    if (state.baseline[key]) {
                        state.baseline[key].visible = parsed.baselineVisible[key];
                    }
                });
            }
            if (parsed.internalSelfVisible) {
                Object.keys(parsed.internalSelfVisible).forEach(key => {
                    if (state.internalSelf[key]) {
                        state.internalSelf[key].visible = parsed.internalSelfVisible[key];
                    }
                });
            }
            if (parsed.externalAreasVisible) {
                Object.keys(parsed.externalAreasVisible).forEach(key => {
                    if (state.externalAreas[key]) {
                        state.externalAreas[key].visible = parsed.externalAreasVisible[key];
                    }
                });
            }
            if (parsed.supportsVisible) {
                Object.keys(parsed.supportsVisible).forEach(key => {
                    if (state.supports[key]) {
                        state.supports[key].visible = parsed.supportsVisible[key];
                    }
                });
            }
        }
    } catch (e) {
        console.error('Error loading state:', e);
    }
}
