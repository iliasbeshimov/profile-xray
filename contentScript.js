function extractDates(element) {
    // Extract the date string from the element using the updated selector
    const dateElement = element.querySelector('.pv-entity__date-range span:not(.visually-hidden)');
    if (!dateElement) {
        return { error: 'Date element not found' };
    }

    const dateString = dateElement.innerText;
    const [start, end] = dateString.split('–').map(str => str.trim());

    if (!start || !end) {
        return { error: `Failed to split date string: ${dateString}` };
    }

    // Convert the date strings to Date objects for easier comparison
    const startDate = new Date(start === 'Present' ? Date.now() : start + " 1");
    const endDate = new Date(end === 'Present' ? Date.now() : end + " 1");

    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
        return { error: `Invalid date conversion. Start: ${start}, End: ${end}` };
    }

    return { startDate, endDate };
}

function calculateGapOrOverlap(previous, current) {
    const gapInMonths = (current.startDate.getFullYear() - previous.endDate.getFullYear()) * 12 + current.startDate.getMonth() - previous.endDate.getMonth();
    if (gapInMonths > 0) {
        return `Gap of ${gapInMonths} month${gapInMonths > 1 ? 's' : ''}`;
    } else if (gapInMonths < 0) {
        return `Overlap of ${-gapInMonths} month${-gapInMonths > 1 ? 's' : ''}`;
    } else {
        return 'No gap or overlap';
    }
}

function insertPlaceholderBoxes() {
    const workExperiences = document.querySelectorAll('.pvs-entity.pvs-entity--padded.pvs-list__item--no-padding-in-columns');
    const educationSection = document.getElementById('education');

    for (let index = 0; index < workExperiences.length; index++) {
        const workExp = workExperiences[index];

        // Check if the current work experience is before the education section
        if (workExp.compareDocumentPosition(educationSection) & Node.DOCUMENT_POSITION_FOLLOWING) {
            const box = document.createElement('div');
            box.style.border = '1px solid blue';
            box.style.margin = '10px 0';
            box.style.padding = '5px';

            if (index < workExperiences.length - 1) {
                const previousExperienceDates = extractDates(workExperiences[index + 1]);
                const currentExperienceDates = extractDates(workExp);
                if (previousExperienceDates.error || currentExperienceDates.error) {
                    box.innerText = previousExperienceDates.error || currentExperienceDates.error;
                } else {
                    box.innerText = calculateGapOrOverlap(previousExperienceDates, currentExperienceDates);
                }
            } else {
                box.innerText = 'Not applicable. Hahah';
            }

            workExp.parentNode.insertBefore(box, workExp.nextSibling);
        }
    }
}

setTimeout(insertPlaceholderBoxes, 3000);
