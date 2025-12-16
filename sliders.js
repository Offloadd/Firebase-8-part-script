// ============================================================================
// SLIDER UPDATE AND TOGGLE FUNCTIONS
// ============================================================================

function toggleLock(category, key) {
    state[category][key].locked = !state[category][key].locked;
    render();
}

function toggleSliderEdit(category, key) {
    state[category][key].editing = !state[category][key].editing;
    render();
}

function saveSliderEdit(category, key) {
    const area = state[category][key];
    const labelInput = document.getElementById('label_' + category + '_' + key);
    const posInput = document.getElementById('pos_' + category + '_' + key);
    const negInput = document.getElementById('neg_' + category + '_' + key);

    if (labelInput && posInput && negInput) {
        area.label = labelInput.value;
        area.posLabel = posInput.value;
        area.negLabel = negInput.value;
    }

    area.editing = false;
    render();
}

function deleteSlider(category, key) {
    if (confirm('Delete this slider? This cannot be undone.')) {
        state[category][key].visible = false;
        state[category][key].value = 0;
        state[category][key].locked = false;
        state[category][key].interacted = false;
        render();
    }
}

function updateSlider(category, key, value) {
    if (!state[category][key].locked) {
        state[category][key].value = parseInt(value);
        state[category][key].interacted = true;
        render();
    }
}

function toggleAmbientLock(id) {
    const amb = state.ambient.find(a => a.id === id);
    if (amb) {
        amb.locked = !amb.locked;
        render();
    }
}

function addAmbientSlider() {
    if (state.ambient.length >= 6) return;
    state.ambient.push({
        id: Date.now(),
        value: 0,
        type: 'opportunity',
        note: '',
        locked: false
    });
    render();
}

function deleteAmbientSlider(id) {
    if (state.ambient.length <= 1) {
        alert('Must keep at least one internal experience slider');
        return;
    }
    state.ambient = state.ambient.filter(a => a.id !== id);
    render();
}

function updateAmbient(id, field, value) {
    const amb = state.ambient.find(a => a.id === id);
    if (!amb || amb.locked) return;

    if (field === 'value') {
        amb.value = parseInt(value);
    } else {
        amb[field] = value;
    }
    render();
}

function addCustomSlider(section) {
    const customArray = section === 'external' ? state.customExternal : state.customSupports;
    customArray.push({
        id: Date.now(),
        label: 'New Slider',
        posLabel: '+5 Positive',
        negLabel: '-5 Negative',
        value: 0,
        locked: false,
        editing: false,
        interacted: false,
        visible: true
    });
    saveState();
    render();
}

function toggleCustomEdit(section, id) {
    const customArray = section === 'external' ? state.customExternal : state.customSupports;
    const slider = customArray.find(s => s.id === id);
    if (slider) {
        slider.editing = !slider.editing;
        saveState();
        render();
    }
}

function saveCustomSlider(section, id, label, posLabel, negLabel) {
    const customArray = section === 'external' ? state.customExternal : state.customSupports;
    const slider = customArray.find(s => s.id === id);
    if (slider) {
        if (slider.editing) {
            slider.label = label;
            slider.posLabel = posLabel;
            slider.negLabel = negLabel;
            slider.editing = false;
        } else {
            slider.locked = !slider.locked;
        }
        saveState();
        render();
    }
}

function deleteCustomSlider(section, id) {
    if (section === 'external') {
        state.customExternal = state.customExternal.filter(s => s.id !== id);
    } else {
        state.customSupports = state.customSupports.filter(s => s.id !== id);
    }
    saveState();
    render();
}

function toggleCustomVisible(section, id) {
    const customArray = section === 'external' ? state.customExternal : state.customSupports;
    const slider = customArray.find(s => s.id === id);
    if (slider) {
        slider.visible = !slider.visible;
        saveState();
        render();
    }
}

function updateCustomSlider(section, id, value) {
    const customArray = section === 'external' ? state.customExternal : state.customSupports;
    const slider = customArray.find(s => s.id === id);
    if (slider && !slider.locked) {
        slider.value = parseInt(value);
        slider.interacted = true;
        saveState();
        render();
    }
}
