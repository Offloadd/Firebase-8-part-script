// render-helpers.js - Slider Building Helper Functions

function buildSlider(category, key, label, posLabel, negLabel, gradient) {
    const area = state[category][key];
    const displayValue = getDisplayValue(area.value);
    const bgColor = getAreaBackgroundColor(area.value);

    if (area.editing === undefined) area.editing = false;

    if (!area.visible) {
        return '<div class="slider-container" style="padding: 4px 8px; background: #f3f4f6; margin-bottom: 4px; display: inline-block; width: calc(50% - 2px); vertical-align: top;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; gap: 4px;">' +
                '<span style="font-size: 11px; color: #374151; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">' + label + '</span>' +
                '<button class="btn" onclick="toggleAreaVisible(\'' + category + '\', \'' + key + '\')" ' +
                        'style="padding: 3px 6px; font-size: 10px; background: #6b7280; color: white; flex-shrink: 0;">' +
                    'Show' +
                '</button>' +
            '</div>' +
        '</div>';
    }

    if (!area.label) area.label = label;
    if (!area.posLabel) area.posLabel = posLabel;
    if (!area.negLabel) area.negLabel = negLabel;

    if (area.editing) {
        return '<div class="slider-container" style="background: ' + bgColor + '; width: 100%;">' +
            '<div style="display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; flex-wrap: wrap;">' +
                '<div style="flex: 1; min-width: 200px;">' +
                    '<input type="text" value="' + area.label + '" id="label_' + category + '_' + key + '" ' +
                           'placeholder="Slider name..." ' +
                           'style="width: 100%; padding: 6px; border: 2px solid #3b82f6; border-radius: 4px; font-size: 13px; font-weight: 600; margin-bottom: 4px;">' +
                    '<div style="display: flex; gap: 4px; margin-bottom: 4px;">' +
                        '<input type="text" value="' + area.posLabel + '" id="pos_' + category + '_' + key + '" ' +
                               'placeholder="+5 label..." ' +
                               'style="flex: 1; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 11px;">' +
                        '<input type="text" value="' + area.negLabel + '" id="neg_' + category + '_' + key + '" ' +
                               'placeholder="-5 label..." ' +
                               'style="flex: 1; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 11px;">' +
                    '</div>' +
                '</div>' +
                '<div style="display: flex; gap: 4px;">' +
                    '<button class="btn" onclick="deleteSlider(\'' + category + '\', \'' + key + '\')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #dc2626; color: white;">' +
                        'Delete' +
                    '</button>' +
                    '<button class="btn" onclick="saveSliderEdit(\'' + category + '\', \'' + key + '\')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #16a34a; color: white;">' +
                        'Save' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slider-labels">' +
                '<span>' + area.posLabel + '</span>' +
                '<span>0 Neutral</span>' +
                '<span>' + area.negLabel + '</span>' +
            '</div>' +
            '<input type="range" min="-5" max="5" value="' + (-area.value) + '" ' +
                   'onchange="updateSlider(\'' + category + '\', \'' + key + '\', -this.value)" ' +
                   (area.locked ? 'disabled' : '') + ' ' +
                   'style="background: ' + gradient + '; ' + (area.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
        '</div>';
    } else {
        return '<div class="slider-container" style="background: ' + bgColor + '; width: 100%;">' +
            '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 3px;">' +
                '<div style="flex: 1;">' +
                    '<div class="slider-header" style="margin-bottom: 0;">' +
                        '<span class="slider-label">' + area.label + '</span>' +
                        '<span class="slider-value" style="color: #111827;">' + displayValue + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="display: flex; gap: 4px;">' +
                    '<button class="btn" onclick="toggleAreaVisible(\'' + category + '\', \'' + key + '\')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #6b7280; color: white;">' +
                        'Hide' +
                    '</button>' +
                    '<button class="btn" onclick="toggleSliderEdit(\'' + category + '\', \'' + key + '\')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #3b82f6; color: white;">' +
                        'Edit' +
                    '</button>' +
                    '<button class="btn" onclick="toggleLock(\'' + category + '\', \'' + key + '\')" ' +
                            'style="padding: 4px 8px; font-size: 11px; ' + (area.locked ? 'background: #f59e0b; color: white;' : 'background: #16a34a; color: white;') + '">' +
                        (area.locked ? 'Unlock' : 'Lock') +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slider-labels">' +
                '<span>' + area.posLabel + '</span>' +
                '<span>0 Neutral</span>' +
                '<span>' + area.negLabel + '</span>' +
            '</div>' +
            '<input type="range" min="-5" max="5" value="' + (-area.value) + '" ' +
                   'onchange="updateSlider(\'' + category + '\', \'' + key + '\', -this.value)" ' +
                   (area.locked ? 'disabled' : '') + ' ' +
                   'style="background: ' + gradient + '; ' + (area.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
        '</div>';
    }
}

function buildCustomSlider(section, slider) {
    const displayValue = getDisplayValue(slider.value);
    const bgColor = getAreaBackgroundColor(slider.value);
    const gradient = getStandardSliderGradient();

    if (slider.visible === undefined) slider.visible = true;

    if (!slider.visible) {
        return '<div class="slider-container" style="padding: 4px 8px; background: #f3f4f6; margin-bottom: 4px; display: inline-block; width: calc(50% - 2px); vertical-align: top;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; gap: 4px;">' +
                '<span style="font-size: 11px; color: #374151; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">' + slider.label + '</span>' +
                '<button class="btn" onclick="toggleCustomVisible(\'' + section + '\', ' + slider.id + ')" ' +
                        'style="padding: 3px 6px; font-size: 10px; background: #6b7280; color: white; flex-shrink: 0;">' +
                    'Show' +
                '</button>' +
            '</div>' +
        '</div>';
    }

    if (slider.editing) {
        return '<div class="slider-container" style="background: ' + bgColor + '; width: 100%;">' +
            '<div style="display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; flex-wrap: wrap;">' +
                '<div style="flex: 1; min-width: 200px;">' +
                    '<input type="text" value="' + slider.label + '" id="label_' + slider.id + '" ' +
                           'placeholder="Slider name..." ' +
                           'style="width: 100%; padding: 6px; border: 2px solid #3b82f6; border-radius: 4px; font-size: 13px; font-weight: 600; margin-bottom: 4px;">' +
                    '<div style="display: flex; gap: 4px; margin-bottom: 4px;">' +
                        '<input type="text" value="' + slider.posLabel + '" id="pos_' + slider.id + '" ' +
                               'placeholder="+5 label..." ' +
                               'style="flex: 1; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 11px;">' +
                        '<input type="text" value="' + slider.negLabel + '" id="neg_' + slider.id + '" ' +
                               'placeholder="-5 label..." ' +
                               'style="flex: 1; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 11px;">' +
                    '</div>' +
                '</div>' +
                '<div style="display: flex; gap: 4px;">' +
                    '<button class="btn" onclick="deleteCustomSlider(\'' + section + '\', ' + slider.id + ')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #dc2626; color: white;">' +
                        'Delete' +
                    '</button>' +
                    '<button class="btn" onclick="saveCustomSlider(\'' + section + '\', ' + slider.id + ', ' +
                            'document.getElementById(\'label_' + slider.id + '\').value, ' +
                            'document.getElementById(\'pos_' + slider.id + '\').value, ' +
                            'document.getElementById(\'neg_' + slider.id + '\').value)" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #16a34a; color: white;">' +
                        'Save' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slider-labels">' +
                '<span>' + slider.posLabel + '</span>' +
                '<span>0 Neutral</span>' +
                '<span>' + slider.negLabel + '</span>' +
            '</div>' +
            '<input type="range" min="-5" max="5" value="' + (-slider.value) + '" ' +
                   'onchange="updateCustomSlider(\'' + section + '\', ' + slider.id + ', -this.value)" ' +
                   (slider.locked ? 'disabled' : '') + ' ' +
                   'style="background: ' + gradient + '; ' + (slider.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
        '</div>';
    } else {
        return '<div class="slider-container" style="background: ' + bgColor + '; width: 100%;">' +
            '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 3px;">' +
                '<div style="flex: 1;">' +
                    '<div class="slider-header" style="margin-bottom: 0;">' +
                        '<span class="slider-label">' + slider.label + '</span>' +
                        '<span class="slider-value" style="color: #111827;">' + displayValue + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="display: flex; gap: 4px;">' +
                    '<button class="btn" onclick="toggleCustomVisible(\'' + section + '\', ' + slider.id + ')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #6b7280; color: white;">' +
                        'Hide' +
                    '</button>' +
                    '<button class="btn" onclick="toggleCustomEdit(\'' + section + '\', ' + slider.id + ')" ' +
                            'style="padding: 4px 8px; font-size: 11px; background: #3b82f6; color: white;">' +
                        'Edit' +
                    '</button>' +
                    '<button class="btn" onclick="saveCustomSlider(\'' + section + '\', ' + slider.id + ', \'\', \'\', \'\')" ' +
                            'style="padding: 4px 8px; font-size: 11px; ' + (slider.locked ? 'background: #f59e0b; color: white;' : 'background: #16a34a; color: white;') + '">' +
                        (slider.locked ? 'Unlock' : 'Lock') +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slider-labels">' +
                '<span>' + slider.posLabel + '</span>' +
                '<span>0 Neutral</span>' +
                '<span>' + slider.negLabel + '</span>' +
            '</div>' +
            '<input type="range" min="-5" max="5" value="' + (-slider.value) + '" ' +
                   'onchange="updateCustomSlider(\'' + section + '\', ' + slider.id + ', -this.value)" ' +
                   (slider.locked ? 'disabled' : '') + ' ' +
                   'style="background: ' + gradient + '; ' + (slider.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
        '</div>';
    }
}
