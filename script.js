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

const randomString = (len = 10) => {
    return Math.random().toString(36).substring(2, len + 2);
}

const saveFont = () => {
    chrome.storage.sync.get(['fontForInspection'], function (result) {
        selectedFont = result.fontForInspection;
        const { fontFamily, fontSize, fontWeight, color } = selectedFont;

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

        chrome.storage.sync.get(['savedFonts'], function (result) {
            let savedFonts = result.savedFonts;
            const id = randomString(10);
            if (typeof savedFonts != 'object') {
                savedFonts = {
                    id: newFontData
                }
            } else {
                savedFonts[id] = newFontData;
            }
            chrome.storage.sync.set({
                savedFonts
            }, () => {
                setTimeout(()=>{
                    removeAllSavedFontsFromDOM()
                    setTimeout(injectSavedFonts,0)
                },0)
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


// function addEventListenersToSavedFonts() {
//     const savedFonts = document.querySelectorAll(".extension-popup-body .saved-font")
//     savedFonts.forEach((savedFontDiv) => {
//         savedFontDiv.addEventListener('click', () => {
//             savedFontDiv.querySelector('.properties').classList.toggle('hidden')
//         })
//     })
// }


function injectSavedFonts() {
    chrome.storage.sync.get(['savedFonts'], function (result) {
        let savedFonts = result.savedFonts;

        for (const fontId in savedFonts) {
            injectSavedFont(savedFonts[fontId], fontId)
        }
    })
}
function removeAllSavedFontsFromDOM() {
    const savedFontsContainer = document.querySelector('.saved-fonts-container')
    removeAllChildNodes(savedFontsContainer)
}
function injectSavedFont(fontData, fontId) {
    const savedFontDiv = document.createElement('div')

    savedFontDiv.addEventListener('click', () => {
        console.log('clicked')
        savedFontDiv.querySelector('.properties').classList.toggle('hidden')
    })

    savedFontDiv.setAttribute('font-id', fontId)

    const titleBarDiv = document.createElement('div')
    titleBarDiv.classList.add('title-bar')

    const fontNameHeader = document.createElement('h3')
    fontNameHeader.innerText = fontData.fontName

    titleBarDiv.appendChild(fontNameHeader)

    const selectedTextBtn = document.createElement('div')
    selectedTextBtn.classList.add('command')
    selectedTextBtn.addEventListener('click', selectedTextBtnClicked)
    selectedTextBtn.innerHTML = '<img src="assets/icons/selected-text.png" alt="">'

    const allTextBtn = document.createElement('div')
    allTextBtn.classList.add('command')
    allTextBtn.addEventListener('click', allTextBtnClicked)
    allTextBtn.innerHTML = '<img src="assets/icons/all-text.png" alt="">'

    const infoBtn = document.createElement('div')
    infoBtn.classList.add('command')
    infoBtn.addEventListener('click', infoBtnClicked)
    infoBtn.innerHTML = '<img src="assets/icons/info.png" alt="">'

    const removeBtn = document.createElement('div')
    removeBtn.classList.add('command')
    removeBtn.addEventListener('click', removeBtnClicked)
    removeBtn.innerHTML = '<img src="assets/icons/remove.png" alt="">'

    titleBarDiv.appendChild(selectedTextBtn)
    titleBarDiv.appendChild(allTextBtn)
    titleBarDiv.appendChild(infoBtn)
    titleBarDiv.appendChild(removeBtn)

    savedFontDiv.appendChild(titleBarDiv)

    const propertiesDiv = document.createElement('div')
    propertiesDiv.classList.add('properties')
    propertiesDiv.classList.add('hidden')
    propertiesDiv.innerHTML = `
            <div>Font size: ${fontData.fontSize}</div>
            <div>Font weight: ${fontData.fontWeight}</div>
            <div>Font family: ${fontData.fontFamily}</div>`

    savedFontDiv.appendChild(propertiesDiv)

    savedFontDiv.classList.add('saved-font')
    const savedFontsContainer = document.querySelector('.saved-fonts-container')
    savedFontsContainer.appendChild(savedFontDiv)
}

function removeAllChildNodes(parent) {
    console.log(parent)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

injectSavedFonts()

function selectedTextBtnClicked() {
    console.log('selected text clicked')
}

function allTextBtnClicked() {
    console.log('all text clicked')
}

function infoBtnClicked() {
    console.log('info clicked')
}

function removeBtnClicked(event) {
    const savedFont = event.target.closest('.saved-font');
    const fontId = savedFont.getAttribute('font-id')

    chrome.storage.sync.get(['savedFonts'], function (result) {
        let savedFonts = result.savedFonts;
        delete savedFonts[fontId];
        chrome.storage.sync.set({
            savedFonts
        }, () => {
            setTimeout(()=>{
                removeAllSavedFontsFromDOM()
                setTimeout(injectSavedFonts,0)
            },0)
        })
    })
}