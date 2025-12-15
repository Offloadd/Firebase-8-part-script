// ============================================================================
// LOAD CALCULATION FUNCTIONS
// ============================================================================

function getThreatLoad() {
    let threatTotal = 0;

    Object.values(state.baseline).forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value < -1) {
            threatTotal += Math.abs(slider.value) - 1;
        }
    });

    Object.values(state.internalSelf).forEach(area => {
        if (!area.interacted) return;
        if (area.value < -1) {
            threatTotal += Math.abs(area.value) - 1;
        }
    });

    Object.values(state.externalAreas).forEach(area => {
        if (!area.interacted) return;
        if (area.value < -1) {
            threatTotal += Math.abs(area.value) - 1;
        }
    });

    Object.values(state.supports).forEach(support => {
        if (!support.interacted) return;
        if (support.value < -1) {
            threatTotal += Math.abs(support.value) - 1;
        }
    });

    state.customExternal.forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value < -1) {
            threatTotal += Math.abs(slider.value) - 1;
        }
    });

    state.customSupports.forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value < -1) {
            threatTotal += Math.abs(slider.value) - 1;
        }
    });

    state.ambient.forEach(amb => {
        if (amb.value !== 0 && amb.type === 'threat') {
            threatTotal += amb.value;
        }
    });

    return threatTotal;
}

function getOpportunityLoad() {
    let opportunityTotal = 0;

    Object.values(state.internalSelf).forEach(area => {
        if (!area.interacted) return;
        if (area.value > 1) {
            opportunityTotal += (area.value - 1);
        }
    });

    Object.values(state.externalAreas).forEach(area => {
        if (!area.interacted) return;
        if (area.value > 1) {
            opportunityTotal += (area.value - 1);
        }
    });

    state.customExternal.forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value > 1) {
            opportunityTotal += (slider.value - 1);
        }
    });

    state.ambient.forEach(amb => {
        if (amb.value !== 0 && amb.type === 'opportunity') {
            opportunityTotal += amb.value;
        }
    });

    return opportunityTotal;
}

function getRegulatedLoad() {
    let regulatedTotal = 0;

    Object.values(state.baseline).forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value === -1 || slider.value === 1) {
            regulatedTotal += 1;
        } else if (slider.value > 1) {
            regulatedTotal += (slider.value - 1);
        }
    });

    Object.values(state.internalSelf).forEach(area => {
        if (!area.interacted) return;
        if (area.value === -1 || area.value === 1) {
            regulatedTotal += 1;
        }
    });

    Object.values(state.externalAreas).forEach(area => {
        if (!area.interacted) return;
        if (area.value === -1 || area.value === 1) {
            regulatedTotal += 1;
        }
    });

    Object.values(state.supports).forEach(support => {
        if (!support.interacted) return;
        if (support.value === -1 || support.value === 1) {
            regulatedTotal += 1;
        } else if (support.value > 1) {
            regulatedTotal += (support.value - 1);
        }
    });

    state.customExternal.forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value === -1 || slider.value === 1) {
            regulatedTotal += 1;
        }
    });

    state.customSupports.forEach(slider => {
        if (!slider.interacted) return;
        if (slider.value === -1 || slider.value === 1) {
            regulatedTotal += 1;
        } else if (slider.value > 1) {
            regulatedTotal += (slider.value - 1);
        }
    });

    state.ambient.forEach(amb => {
        if (amb.value !== 0 && amb.type === 'regulated') {
            regulatedTotal += amb.value;
        }
    });

    return regulatedTotal;
}

function validateSave() {
    const errors = [];
    state.ambient.forEach((amb, i) => {
        if (amb.value !== 0) {
            if (!amb.type) errors.push('Internal Activity ' + (i+1) + ': Type is required when slider is not at 0');
            if (!amb.note.trim()) errors.push('Internal Activity ' + (i+1) + ': Note is required when slider is not at 0');
        }
    });
    return errors;
}

async function saveEntry() {
    const errors = validateSave();
    if (errors.length > 0) {
        state.saveError = errors.join('<br>');
        render();
        return;
    }

    state.saveError = '';

    const threatLoad = getThreatLoad();
    const opportunityLoad = getOpportunityLoad();
    const regulatedLoad = getRegulatedLoad();

    const filterNonZero = (obj) => {
        const filtered = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] !== 0) {
                filtered[key] = obj[key];
            }
        });
        return Object.keys(filtered).length > 0 ? filtered : undefined;
    };

    const entry = {
        timestamp: new Date().toISOString(),
        baseline: filterNonZero(Object.keys(state.baseline).reduce((acc, key) => {
            acc[key] = state.baseline[key].value;
            return acc;
        }, {})),
        internalSelf: filterNonZero(Object.keys(state.internalSelf).reduce((acc, key) => {
            acc[key] = state.internalSelf[key].value;
            return acc;
        }, {})),
        externalAreas: filterNonZero(Object.keys(state.externalAreas).reduce((acc, key) => {
            acc[key] = state.externalAreas[key].value;
            return acc;
        }, {})),
        supports: filterNonZero(Object.keys(state.supports).reduce((acc, key) => {
            acc[key] = state.supports[key].value;
            return acc;
        }, {})),
        customExternal: state.customExternal
            .filter(slider => slider.value !== 0)
            .map(slider => ({
                label: slider.label,
                value: slider.value
            })),
        customSupports: state.customSupports
            .filter(slider => slider.value !== 0)
            .map(slider => ({
                label: slider.label,
                value: slider.value
            })),
        ambient: state.ambient
            .filter(a => a.value !== 0)
            .map(a => ({
                value: a.value,
                type: a.type,
                note: a.note
            })),
        threatLoad,
        opportunityLoad,
        regulatedLoad
    };

    Object.keys(entry).forEach(key => {
        if (entry[key] === undefined || (Array.isArray(entry[key]) && entry[key].length === 0)) {
            delete entry[key];
        }
    });

    await saveToFirestore(entry);
    
    state.entries.unshift(entry);
    saveToUserStorage('entries', JSON.stringify(state.entries));

    render();
    displayEntries();
}

function copyEntries() {
    const text = state.entries.map(e => {
        const date = new Date(e.timestamp).toLocaleString();
        return '=== ' + date + ' ===\nThreat: ' + e.threatLoad + ' | Regulated: ' + e.regulatedLoad + ' | Opportunity: ' + e.opportunityLoad;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Entries copied!');
}

async function clearEntries() {
    if (confirm('Clear all entries? This cannot be undone.')) {
        await clearFirestoreEntries();
        
        state.entries = [];
        saveToUserStorage('entries', JSON.stringify(state.entries));
        render();
        displayEntries();
    }
}
