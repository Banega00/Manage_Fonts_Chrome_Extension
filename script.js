let selectedFont;
const inspectFont = () => {
    chrome.storage.sync.get(['fontForInspection'], function (result) {
        selectedFont = result.fontForInspection;
        const { fontFamily, fontSize, fontWeight, color } = selectedFont;
        if (!selectedFont) {
            inspectFontContainer.innerHTML = 'No font selected'
            return;
        }
        const inspectFontContainer = document.querySelector('.font-inspect-container')
        inspectFontContainer.innerHTML =
            `<div class="font-inspect-container">
        <div>Font family: ${fontFamily}</div>
        <div>Font size: ${fontSize} </div>
        <div>Font weight: ${fontWeight}</div>
        <div>Font color: ${color}</div>
    </div>`
    });
}

const saveFont = () => {
    chrome.storage.sync.get(['fontForInspection'], function (result) {
        selectedFont = result.fontForInspection;
        const { fontFamily, fontSize, fontWeight, color } = selectedFont;

        const savedFontsContainer = document.querySelector('.saved-fonts-container')
        const fontName = document.querySelector('#font-name-txt').value
        if (!fontName) {
            alert('Enter font name!')
            return;
        }

        const newFontData = {
            fontName,
            fontFamily,
            fontWeight,
            fontSize,
            color
        }
        const newFont =
            `
            <div class="saved-font">
            <h3>${fontName}</h3>
            <div>Font family: ${fontFamily}</div>
            <div>Font size: ${fontSize}</div>
            <div>Font weight ${fontWeight}</div>
            <div>Font color ${color}</div>
        </div>
        `
        savedFontsContainer.insertAdjacentHTML("beforebegin", newFont)

        chrome.storage.sync.get(['savedFonts'], function (result) {
            let savedFonts = result.savedFonts;
            if (!savedFonts) {
                savedFonts = [newFontData]
            } else {
                savedFonts = savedFonts.push(newFontData);
            }

            chrome.storage.sync.set({
                savedFonts
            }, () => {
                console.log('SADA:', savedFonts)
            })
        })
    });
}

const inspectBtn = document.querySelector(".extension-popup-body .inspect-btn")
if (inspectBtn) {
    inspectBtn.addEventListener("click", inspectFont);
}

const saveFontBtn = document.querySelector(".extension-popup-body .save-font-btn")
if (saveFontBtn) {
    saveFontBtn.addEventListener("click", saveFont);
}
