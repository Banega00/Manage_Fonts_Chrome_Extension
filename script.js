let selectedFont;
let mode = 'no-edit' //no-edit, edit

document.querySelector('.extension-popup-body #bg-color-picker').addEventListener('input', (event) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "bg_change", backgroundColor: event.target.value }, function (response) {
        });
    });
})

const rgbToHex = (rgbString) => {
    if (!rgbString.startsWith('rgb')) return;
    //rgbString is rgb(10,20,30) for example
    let numbers = rgbString.split('(')[1].split(')')[0].split(',')
    numbers = numbers.map(n => +n)
    const [r, g, b] = numbers;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const editSvg = '<svg fill="#ffffff" style="margin-left:5px" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">    <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"/></svg>'
const inspectFont = () => {
    chrome.storage.sync.get(['fontForInspection'], function (result) {
        selectedFont = result.fontForInspection;
        const { fontFamily, fontSize, fontWeight, color, letterSpacing, lineHeight } = selectedFont;
        if (!selectedFont) {
            inspectFontContainer.innerHTML = 'No font selected'
            return;
        }
        const inspectFontContainer = document.querySelector('.font-inspect-container')

        inspectFontContainer.innerHTML =
            `
        <div class="font-inspect-container">
            <div class="no-edit-div">
                <div class="div-font-family">Font family: <b>${fontFamily}</b>  </div>
                <div class="div-font-size">Font size: <b>${fontSize} </b> </div>
                <div class="div-letter-spacing">Letter spacing: <b>${letterSpacing} </b> </div>
                <div class="div-line-height">Line height: <b>${lineHeight} </b> </div>
                <div class="div-font-weight">Font weight: <b>${fontWeight}</b> </div>
                <div class="div-font-color">Font color: <span class="color-box" style="background-color:${color}">${'&nbsp;'.repeat(10)}</span></div>
            </div>

            <div style="display:none;" class="edit-div">
                <div class="input-font-family">Font family: <input value="${fontFamily}"></div>
                <div class="input-font-size">Font size: <input type="number"  step=0.1 min=1 value="${fontSize.slice(0, -2)}"> </div>
                <div class="input-letter-spacing">Letter spacing <input type="number" step=0.1  value="${letterSpacing.slice(0, -2)}"> </div>
                <div class="input-line-height">Line height <input type="number" step=0.1  value="${lineHeight.slice(0, -2)}"> </div>
                <div class="input-font-weight">Font weight:<input type="number" step=100 min=100 value="${fontWeight}"> </div>
                <div class="input-font-color">Font color:<input type="color" value="${rgbToHex(color)}"></div>
            </div>

            <div class='edit-btn'>Edit ${editSvg} </div>
        </div>`

        setTimeout(() => {
            const editBtn = document.querySelector('.font-inspect-container .edit-btn')
            editBtn.addEventListener('click', (event) => {
                if (mode == 'no-edit') mode = 'edit'
                else if (mode == 'edit') mode = 'no-edit'

                console.log(mode)
                if (mode == 'edit') {
                    document.querySelector('.no-edit-div').style.display = 'none'
                    document.querySelector('.edit-div').style.display = 'block'
                } else if (mode == 'no-edit') {
                    document.querySelector('.no-edit-div').style.display = 'block'
                    document.querySelector('.edit-div').style.display = 'none'
                }
            })

            document.querySelector('.font-inspect-container .input-font-family').addEventListener('input', (event) => {
                const newFontFamily = event.target.value;
                document.querySelector('.font-inspect-container .div-font-family b').innerText = newFontFamily;
                chrome.storage.sync.get(['fontForInspection'], function (result) {
                    selectedFont = result.fontForInspection;

                    chrome.storage.sync.set({
                        fontForInspection: { ...selectedFont, fontFamily: newFontFamily }
                    })
                })
            })

            document.querySelector('.font-inspect-container .input-font-size').addEventListener('input', (event) => {
                const newFontSize = event.target.value;
                document.querySelector('.font-inspect-container .div-font-size b').innerText = newFontSize + 'px';
                chrome.storage.sync.get(['fontForInspection'], function (result) {
                    selectedFont = result.fontForInspection;

                    chrome.storage.sync.set({
                        fontForInspection: { ...selectedFont, fontSize: newFontSize + 'px' }
                    })
                })
            })

            document.querySelector('.font-inspect-container .input-line-height').addEventListener('input', (event) => {
                let newLineHeight = event.target.value;
                if(!isNaN(+newLineHeight)){
                    newLineHeight+='px'
                }
                document.querySelector('.font-inspect-container .div-line-height b').innerText = newLineHeight;
                chrome.storage.sync.get(['fontForInspection'], function (result) {
                    selectedFont = result.fontForInspection;

                    chrome.storage.sync.set({
                        fontForInspection: { ...selectedFont, lineHeight: newLineHeight }
                    })
                })
            })

            document.querySelector('.font-inspect-container .input-letter-spacing').addEventListener('input', (event) => {
                let newLetterSpacing = event.target.value;
                if(!isNaN(+newLetterSpacing)){
                    newLetterSpacing+='px'
                }
                document.querySelector('.font-inspect-container .div-letter-spacing b').innerText = newLetterSpacing;
                chrome.storage.sync.get(['fontForInspection'], function (result) {
                    selectedFont = result.fontForInspection;

                    chrome.storage.sync.set({
                        fontForInspection: { ...selectedFont, letterSpacing: newLetterSpacing }
                    })
                })
            })

            document.querySelector('.font-inspect-container .input-font-weight').addEventListener('input', (event) => {
                const newFontWeight = event.target.value;
                document.querySelector('.font-inspect-container .div-font-weight b').innerText = newFontWeight;
                chrome.storage.sync.get(['fontForInspection'], function (result) {
                    selectedFont = result.fontForInspection;

                    chrome.storage.sync.set({
                        fontForInspection: { ...selectedFont, fontWeight: newFontWeight }
                    })
                })
            })

            document.querySelector('.font-inspect-container .input-font-color').addEventListener('input', (event) => {
                const newFontColor = event.target.value;
                document.querySelector('.font-inspect-container .div-font-color span').style.backgroundColor = newFontColor;
                chrome.storage.sync.get(['fontForInspection'], function (result) {
                    selectedFont = result.fontForInspection;

                    chrome.storage.sync.set({
                        fontForInspection: { ...selectedFont, color: newFontColor }
                    })
                })
            })
        }, 0)
    });
}

const randomString = (len = 10) => {
    return Math.random().toString(36).substring(2, len + 2);
}

const saveFont = () => {
    chrome.storage.sync.get(['fontForInspection'], function (result) {
        selectedFont = result.fontForInspection;
        const { fontFamily, fontSize, fontWeight, color, font, letterSpacing, lineHeight } = selectedFont;

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
            letterSpacing, 
            lineHeight,
            font,
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
                setTimeout(() => {
                    removeAllSavedFontsFromDOM()
                    setTimeout(injectSavedFonts, 0)
                }, 0)
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
    savedFontDiv.classList.add('saved-font')

    savedFontDiv.setAttribute('font-id', fontId)

    const titleBarDiv = document.createElement('div')
    titleBarDiv.classList.add('title-bar')


    titleBarDiv.addEventListener('click', () => {
        savedFontDiv.querySelector('.properties').classList.toggle('hidden')
    })

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

    const editBtn = document.createElement('div')
    editBtn.classList.add('command')
    editBtn.addEventListener('click', editBtnClicked)
    editBtn.innerHTML = '<img src="assets/icons/edit.png" alt="">'

    const removeBtn = document.createElement('div')
    removeBtn.classList.add('command')
    removeBtn.addEventListener('click', removeBtnClicked)
    removeBtn.innerHTML = '<img src="assets/icons/remove.png" alt="">'

    titleBarDiv.appendChild(selectedTextBtn)
    titleBarDiv.appendChild(allTextBtn)
    titleBarDiv.appendChild(editBtn)
    titleBarDiv.appendChild(removeBtn)

    savedFontDiv.appendChild(titleBarDiv)

    const propertiesDiv = document.createElement('div')
    propertiesDiv.classList.add('properties')
    propertiesDiv.classList.add('hidden')
    propertiesDiv.innerHTML = `
    <div class="no-edit-div">
        <div class="div-font-family">Font family: <b>${fontData.fontFamily}</b>  </div>
        <div class="div-font-size">Font size: <b>${fontData.fontSize} </b> </div>
        <div class="div-letter-spacing">Letter spacing: <b>${fontData.letterSpacing} </b> </div>
        <div class="div-line-height">Line height: <b>${fontData.lineHeight} </b> </div>
        <div class="div-font-weight">Font weight: <b>${fontData.fontWeight}</b> </div>
        <div class="div-font-color">Font color: <span class="color-box" style="background-color:${fontData.color}">${'&nbsp;'.repeat(10)}</span></div>
    </div>

    <div class="edit-div hidden">
        <div class="input-font-family">Font family: <input value="${fontData.fontFamily}"></div>
        <div class="input-font-size">Font size: <input type="number" step=0.1 min=1 value="${fontData.fontSize.slice(0, -2)}"> </div>
        <div class="input-letter-spacing">Letter spacing <input type="number" step=0.1 value="${fontData.letterSpacing?.slice(0, -2)}"> </div>
        <div class="input-line-height">Line height <input type="number" step=0.1 value="${fontData.lineHeight?.slice(0, -2)}"> </div>
        <div class="input-font-weight">Font weight:<input type="number" step=100 min=100 value="${fontData.fontWeight}"> </div>
        <div class="input-font-color">Font color:<input type="color" value="${rgbToHex(fontData.color)}"></div>
    </div>
    `

    savedFontDiv.appendChild(propertiesDiv)

    savedFontDiv.classList.add('saved-font')
    const savedFontsContainer = document.querySelector('.saved-fonts-container')
    savedFontsContainer.appendChild(savedFontDiv)

    setTimeout(() => {
        savedFontDiv.querySelector('.input-font-family').addEventListener('input', (event) => {
            const newFontFamily = event.target.value;
            savedFontDiv.querySelector('.div-font-family b').innerText = newFontFamily;
            chrome.storage.sync.get(['fontForInspection'], function (result) {
                selectedFont = result.fontForInspection;

                chrome.storage.sync.set({
                    fontForInspection: { ...selectedFont, fontFamily: newFontFamily }
                })
            })
        })

        savedFontDiv.querySelector('.input-font-size').addEventListener('input', (event) => {
            const newFontSize = event.target.value;
            savedFontDiv.querySelector('.div-font-size b').innerText = newFontSize + 'px';
            chrome.storage.sync.get(['savedFonts'], function (result) {
                let savedFonts = result.savedFonts;
                savedFonts[fontId] = { ...savedFonts[fontId], fontSize: newFontSize + 'px'};
                chrome.storage.sync.set({
                    savedFonts
                })
            })
        })

        savedFontDiv.querySelector('.input-line-height').addEventListener('input', (event) => {
            let newLineHeight = event.target.value;
            if(!isNaN(+newLineHeight)){
                newLineHeight+='px'
            }
            savedFontDiv.querySelector('.div-line-height b').innerText = newLineHeight;
            
            chrome.storage.sync.get(['savedFonts'], function (result) {
                let savedFonts = result.savedFonts;
                savedFonts[fontId] = { ...savedFonts[fontId], lineHeight: newLineHeight };
                chrome.storage.sync.set({
                    savedFonts
                })
            })
        })

        savedFontDiv.querySelector('.input-letter-spacing').addEventListener('input', (event) => {
            let newLetterSpacing = event.target.value;
            if(!isNaN(+newLetterSpacing)){
                newLetterSpacing+='px'
            }
            savedFontDiv.querySelector('.div-letter-spacing b').innerText = newLetterSpacing;
            
            chrome.storage.sync.get(['savedFonts'], function (result) {
                let savedFonts = result.savedFonts;
                savedFonts[fontId] = { ...savedFonts[fontId], letterSpacing: newLetterSpacing };
                chrome.storage.sync.set({
                    savedFonts
                })
            })
        })

        savedFontDiv.querySelector('.input-font-weight').addEventListener('input', (event) => {
            const newFontWeight = event.target.value;
            savedFontDiv.querySelector('.div-font-weight b').innerText = newFontWeight;
            chrome.storage.sync.get(['savedFonts'], function (result) {
                let savedFonts = result.savedFonts;
                savedFonts[fontId] = { ...savedFonts[fontId], fontWeight: newFontWeight};
                chrome.storage.sync.set({
                    savedFonts
                })
            })
        })

        savedFontDiv.querySelector('.input-font-color').addEventListener('input', (event) => {
            const newFontColor = event.target.value;
            savedFontDiv.querySelector('.div-font-color span').style.backgroundColor = newFontColor;
            chrome.storage.sync.get(['savedFonts'], function (result) {
                let savedFonts = result.savedFonts;
                savedFonts[fontId] = { ...savedFonts[fontId], color: newFontColor};
                chrome.storage.sync.set({
                    savedFonts
                })
            })
        })
    }, 0)
}

function removeAllChildNodes(parent) {
    console.log(parent)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

injectSavedFonts()

function selectedTextBtnClicked(event) {
    event.stopPropagation()
    const savedFont = event.target.closest('.saved-font');
    savedFont.querySelector('.properties').classList.remove('hidden')
    const fontId = savedFont.getAttribute('font-id')

    chrome.storage.sync.get(['savedFonts'], function (result) {
        let savedFonts = result.savedFonts;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "change_selected", fontData: savedFonts[fontId] });
        });
    })


}

function allTextBtnClicked(event) {
    event.stopPropagation()
    const savedFont = event.target.closest('.saved-font');
    savedFont.querySelector('.properties').classList.remove('hidden')
    const fontId = savedFont.getAttribute('font-id')

    chrome.storage.sync.get(['savedFonts'], function (result) {
        let savedFonts = result.savedFonts;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "all_text", fontData: savedFonts[fontId] }, function (response) {
            });
        });
    })
}

function editBtnClicked(event) {
    event.stopPropagation()
    const savedFontDiv = event.target.closest('.saved-font');
    savedFontDiv.querySelector('.properties').classList.remove('hidden')
    const noEditDiv = savedFontDiv.querySelector('.no-edit-div')
    noEditDiv.classList.toggle('hidden')

    const EditDiv = savedFontDiv.querySelector('.edit-div')
    EditDiv.classList.toggle('hidden')
}

function removeBtnClicked(event) {
    event.stopPropagation()
    const savedFont = event.target.closest('.saved-font');
    savedFont.querySelector('.properties').classList.remove('hidden')
    const fontId = savedFont.getAttribute('font-id')

    chrome.storage.sync.get(['savedFonts'], function (result) {
        let savedFonts = result.savedFonts;
        delete savedFonts[fontId];
        chrome.storage.sync.set({
            savedFonts
        }, () => {
            setTimeout(() => {
                removeAllSavedFontsFromDOM()
                setTimeout(injectSavedFonts, 0)
            }, 0)
        })
    })
}