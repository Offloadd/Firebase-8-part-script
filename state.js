// state.js - State Object and Management Functions

const state = {
    section1Expanded: false,
    section2Expanded: false,
    section3Expanded: false,
    section4Expanded: false,
    visualOpacity: 0,  // Full brightness (0 = no white overlay)
    customExternal: [],
    customSupports: [],
    
    baseline: {
        regulation: { value: 0, interacted: false, locked: false, visible: true },
        flexibility: { value: 0, interacted: false, locked: false, visible: true }
    },
    
    internalSelf: {
        mental: { value: 0, locked: false, interacted: false, visible: false },
        somaticBody: { value: 0, locked: false, interacted: false, visible: false },
        emotional: { value: 0, locked: false, interacted: false, visible: false },
        spiritual: { value: 0, locked: false, interacted: false, visible: false }
    },
    
    externalAreas: {
        homeImprovement: { value: 0, locked: false, interacted: false, visible: false },
        workMoney: { value: 0, locked: false, interacted: false, visible: false },
        moneyHandling: { value: 0, locked: false, interacted: false, visible: false },
        relationships: { value: 0, locked: false, interacted: false, visible: false }
    },
    
    supports: {
        housingComforts: { value: 0, locked: false, interacted: false, visible: false },
        sleepQuality: { value: 0, locked: false, interacted: false, visible: false },
        socialConnection: { value: 0, locked: false, interacted: false, visible: false },
        financialCushion: { value: 0, locked: false, interacted: false, visible: false }
    },
    
    ambient: [
        { id: Date.now(), value: 0, type: 'opportunity', note: '', locked: false }
    ],
    
    entries: [],
    saveError: ''
};

function toggleSection(section) {
    if (section === 1) state.section1Expanded = !state.section1Expanded;
    if (section === 2) state.section2Expanded = !state.section2Expanded;
    if (section === 3) state.section3Expanded = !state.section3Expanded;
    if (section === 4) state.section4Expanded = !state.section4Expanded;
    render();
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

function getDisplayValue(internalValue) {
    if (internalValue === 0) return '0';
    if (internalValue > 0) return '+' + internalValue;
    if (internalValue < 0) return internalValue.toString();
    return '0';
}

function getSliderColor(value) {
    if (value > 0) {
        const intensity = value / 5;
        const red = Math.round(100 - (100 * intensity));
        const green = Math.round(220 + (35 * intensity));
        const blue = Math.round(100 - (100 * intensity));
        return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    } else if (value < 0) {
        const absValue = Math.abs(value);
        if (absValue <= 1.5) {
            const intensity = absValue / 1.5;
            const red = Math.round(68 + (200 * intensity));
            const green = Math.round(136 + (100 * intensity));
            const blue = Math.round(255 - (155 * intensity));
            return 'rgb(' + Math.min(red, 255) + ', ' + Math.min(green, 255) + ', ' + blue + ')';
        } else {
            const intensity = (absValue - 1.5) / 3.5;
            const red = 255;
            const green = Math.round(236 - (136 * intensity));
            const blue = Math.round(100 - (100 * intensity));
            return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        }
    } else {
        return 'rgb(68, 136, 255)';
    }
}

function getAreaBackgroundColor(value) {
    if (value >= 3) {
        return 'rgba(68, 136, 255, 0.25)';
    } else if (value >= 1) {
        return 'rgba(68, 136, 255, 0.15)';
    } else if (value === 0) {
        return '#f9fafb';
    } else if (value >= -2) {
        return 'rgba(255, 235, 59, 0.4)';
    } else if (value >= -4) {
        return 'rgba(255, 152, 0, 0.35)';
    } else {
        return 'rgba(244, 67, 54, 0.3)';
    }
}

function getBaselineSliderGradient() {
    return 'linear-gradient(to right, #4488ff 0%, #bbdefb 30%, #d3d3d3 50%, #ffeb3b 65%, #ff9800 82.5%, #f44336 100%)';
}

function getStandardSliderGradient() {
    return 'linear-gradient(to right, #64ff64 0%, #4488ff 50%, #ffaa44 75%, #ff4444 100%)';
}

function getAmbientSliderGradient(type) {
    if (type === 'threat') {
        return 'linear-gradient(to right, #ffeb3b 0%, #ff9800 50%, #f44336 100%)';
    } else if (type === 'regulated') {
        return 'linear-gradient(to right, #bbdefb 0%, #1976d2 100%)';
    } else if (type === 'opportunity') {
        return 'linear-gradient(to right, #c8e6c9 0%, #4caf50 50%, #cddc39 100%)';
    }
    return 'linear-gradient(to right, #d1d5db 0%, #d1d5db 100%)';
}

console.log('State initialized - waiting for authentication');
