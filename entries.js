// ============================================================================
// ENTRY DISPLAY AND MANAGEMENT FUNCTIONS
// ============================================================================

function displayEntries() {
    const container = document.getElementById('entriesContainer');
    if (!container) return;

    if (state.entries.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No saved entries yet</p>';
        return;
    }

    const html = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">Saved Entries (${state.entries.length})</h3>
            <button onclick="copyLast20Entries()" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                📋 Copy Last 20 Entries (CSV)
            </button>
        </div>
        ${state.entries.map((entry, index) => renderEntry(entry, index)).join('')}
    `;

    container.innerHTML = html;
}

function renderEntry(entry, index) {
    const date = new Date(entry.timestamp);
    const formattedDate = date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });

    const height = 300;
    const maxLoad = 50;
    const minGateHeight = 30;
    const regulatedReduction = entry.regulatedLoad * 2;

    let topGateHeight = minGateHeight + Math.max(0, Math.min((entry.threatLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);
    let bottomGateHeight = minGateHeight + Math.max(0, Math.min((entry.opportunityLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);

    const combinedHeight = topGateHeight + bottomGateHeight;
    const maxCombined = height * 0.9;

    if (combinedHeight > maxCombined) {
        const scaleFactor = maxCombined / combinedHeight;
        topGateHeight = Math.max(minGateHeight, topGateHeight * scaleFactor);
        bottomGateHeight = Math.max(minGateHeight, bottomGateHeight * scaleFactor);
    }

    const availableSpace = height - topGateHeight - bottomGateHeight;

    const stressPercent = Math.round((topGateHeight / height) * 100);
    const regulatedPercent = Math.round((availableSpace / height) * 100);
    const opportunityPercent = Math.round((bottomGateHeight / height) * 100);

    const changedAreas = [];
    
    const baselineLabels = { regulation: 'Regulation', flexibility: 'Flexibility' };
    if (entry.baseline) {
        Object.keys(entry.baseline).forEach(key => {
            changedAreas.push(`${baselineLabels[key]}: ${getDisplayValue(entry.baseline[key])}`);
        });
    }

    const internalLabels = { mental: 'Mental Activity', somaticBody: 'Somatic/Body', emotional: 'Emotional', spiritual: 'Spiritual' };
    if (entry.internalSelf) {
        Object.keys(entry.internalSelf).forEach(key => {
            changedAreas.push(`${internalLabels[key]}: ${getDisplayValue(entry.internalSelf[key])}`);
        });
    }

    const externalLabels = { homeImprovement: 'Home/Improvement', workMoney: 'Work/Money', moneyHandling: 'Money Handling', relationships: 'Relationships' };
    if (entry.externalAreas) {
        Object.keys(entry.externalAreas).forEach(key => {
            changedAreas.push(`${externalLabels[key]}: ${getDisplayValue(entry.externalAreas[key])}`);
        });
    }

    const supportsLabels = { housingComforts: 'Housing/Comforts', sleepQuality: 'Sleep Quality', socialConnection: 'Social Connection', financialCushion: 'Financial Cushion' };
    if (entry.supports) {
        Object.keys(entry.supports).forEach(key => {
            changedAreas.push(`${supportsLabels[key]}: ${getDisplayValue(entry.supports[key])}`);
        });
    }

    if (entry.customExternal && entry.customExternal.length > 0) {
        entry.customExternal.forEach(slider => {
            changedAreas.push(`${slider.label}: ${getDisplayValue(slider.value)}`);
        });
    }
    if (entry.customSupports && entry.customSupports.length > 0) {
        entry.customSupports.forEach(slider => {
            changedAreas.push(`${slider.label}: ${getDisplayValue(slider.value)}`);
        });
    }

    const notes = [];
    if (entry.ambient && entry.ambient.length > 0) {
        entry.ambient.forEach(amb => {
            const typeLabel = amb.type.charAt(0).toUpperCase() + amb.type.slice(1);
            notes.push(`${typeLabel} (${amb.value}): ${amb.note}`);
        });
    }

    return `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                    <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${formattedDate}</div>
                    <div style="font-size: 14px; color: #6b7280;">
                        Stress: ${stressPercent}% | Regulated: ${regulatedPercent}% | Opportunity: ${opportunityPercent}%
                    </div>
                    <div style="font-size: 13px; color: #9ca3af; margin-top: 2px;">
                        Threat Load: ${entry.threatLoad} | Regulated: ${entry.regulatedLoad} | Opportunity: ${entry.opportunityLoad}
                    </div>
                </div>
                <button onclick="deleteEntry(${index})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    Delete
                </button>
            </div>
            
            ${changedAreas.length > 0 ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                    <div style="font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Changed Areas:</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 4px; font-size: 13px; color: #4b5563;">
                        ${changedAreas.map(area => `<div>• ${area}</div>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${notes.length > 0 ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                    <div style="font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Specific Experiences:</div>
                    <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
                        ${notes.map(note => `<div style="margin-bottom: 4px;">• ${note}</div>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

async function deleteEntry(index) {
    if (!confirm('Delete this entry? This cannot be undone.')) {
        return;
    }

    const entry = state.entries[index];
    
    if (entry.id) {
        await deleteFromFirestore(entry.id);
    }

    state.entries.splice(index, 1);
    saveToUserStorage('entries', JSON.stringify(state.entries));
    displayEntries();
}

function copyLast20Entries() {
    const entriesToCopy = state.entries.slice(0, 20);
    
    if (entriesToCopy.length === 0) {
        alert('No entries to copy');
        return;
    }

    let csv = 'Timestamp,Stress %,Regulated %,Opportunity %,Threat Load,Regulated Load,Opportunity Load,Changed Areas,Specific Experiences\n';

    entriesToCopy.forEach(entry => {
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        const height = 300;
        const maxLoad = 50;
        const minGateHeight = 30;
        const regulatedReduction = entry.regulatedLoad * 2;

        let topGateHeight = minGateHeight + Math.max(0, Math.min((entry.threatLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);
        let bottomGateHeight = minGateHeight + Math.max(0, Math.min((entry.opportunityLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);

        const combinedHeight = topGateHeight + bottomGateHeight;
        const maxCombined = height * 0.9;

        if (combinedHeight > maxCombined) {
            const scaleFactor = maxCombined / combinedHeight;
            topGateHeight = Math.max(minGateHeight, topGateHeight * scaleFactor);
            bottomGateHeight = Math.max(minGateHeight, bottomGateHeight * scaleFactor);
        }

        const availableSpace = height - topGateHeight - bottomGateHeight;

        const stressPercent = Math.round((topGateHeight / height) * 100);
        const regulatedPercent = Math.round((availableSpace / height) * 100);
        const opportunityPercent = Math.round((bottomGateHeight / height) * 100);

        const changedAreas = [];
        const baselineLabels = { regulation: 'Regulation', flexibility: 'Flexibility' };
        if (entry.baseline) {
            Object.keys(entry.baseline).forEach(key => {
                changedAreas.push(`${baselineLabels[key]}: ${getDisplayValue(entry.baseline[key])}`);
            });
        }

        const internalLabels = { mental: 'Mental Activity', somaticBody: 'Somatic/Body', emotional: 'Emotional', spiritual: 'Spiritual' };
        if (entry.internalSelf) {
            Object.keys(entry.internalSelf).forEach(key => {
                changedAreas.push(`${internalLabels[key]}: ${getDisplayValue(entry.internalSelf[key])}`);
            });
        }

        const externalLabels = { homeImprovement: 'Home/Improvement', workMoney: 'Work/Money', moneyHandling: 'Money Handling', relationships: 'Relationships' };
        if (entry.externalAreas) {
            Object.keys(entry.externalAreas).forEach(key => {
                changedAreas.push(`${externalLabels[key]}: ${getDisplayValue(entry.externalAreas[key])}`);
            });
        }

        const supportsLabels = { housingComforts: 'Housing/Comforts', sleepQuality: 'Sleep Quality', socialConnection: 'Social Connection', financialCushion: 'Financial Cushion' };
        if (entry.supports) {
            Object.keys(entry.supports).forEach(key => {
                changedAreas.push(`${supportsLabels[key]}: ${getDisplayValue(entry.supports[key])}`);
            });
        }

        if (entry.customExternal && entry.customExternal.length > 0) {
            entry.customExternal.forEach(slider => {
                changedAreas.push(`${slider.label}: ${getDisplayValue(slider.value)}`);
            });
        }
        if (entry.customSupports && entry.customSupports.length > 0) {
            entry.customSupports.forEach(slider => {
                changedAreas.push(`${slider.label}: ${getDisplayValue(slider.value)}`);
            });
        }

        const notes = [];
        if (entry.ambient && entry.ambient.length > 0) {
            entry.ambient.forEach(amb => {
                const typeLabel = amb.type.charAt(0).toUpperCase() + amb.type.slice(1);
                notes.push(`${typeLabel} (${amb.value}): ${amb.note}`);
            });
        }

        const escapeCsv = (str) => {
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };

        csv += `${escapeCsv(formattedDate)},${stressPercent},${regulatedPercent},${opportunityPercent},${entry.threatLoad},${entry.regulatedLoad},${entry.opportunityLoad},${escapeCsv(changedAreas.join('; '))},${escapeCsv(notes.join('; '))}\n`;
    });

    navigator.clipboard.writeText(csv).then(() => {
        alert(`✅ Last ${entriesToCopy.length} entries copied to clipboard in CSV format!`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}
