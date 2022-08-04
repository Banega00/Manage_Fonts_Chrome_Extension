
function firstParent(node) {
    while (!node.parentElement) node = node.parentNode
    return node.parentElement
}

const printSelection = event => {
    const selection = window.getSelection();
    const styles = window.getComputedStyle(firstParent(selection.anchorNode))
    if (!styles) {
        return;
    }

    chrome.storage.sync.set({
        fontForInspection: {
            font: styles.font,
            fontFamily: styles.fontFamily,
            fontWeight: styles.fontWeight,
            fontSize: styles.fontSize,
            color: styles.color
        }
    })
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


document.addEventListener("selectionchange", debounce(printSelection, 900))
