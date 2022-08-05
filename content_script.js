
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
    let timeout;
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.type == 'change_selected') {
            console.log(request.fontData)

            const selection = window.getSelection();
            for (let index = 0; index < selection.rangeCount; index++) {
                const range = selection.getRangeAt(index);
                const nodesInRange = getNodesInRange(range);
                for (const element of nodesInRange) {
                    console.log(element)
                    if(element.style){
                        element.style.font = request.fontData.font
                    }
                    
                }
            }

        }
    }
);

function getNextNode(node)
{
    if (node.firstChild)
        return node.firstChild;
    while (node)
    {
        if (node.nextSibling)
            return node.nextSibling;
        node = node.parentNode;
    }
}

function getNodesInRange(range)
{
    let start = range.startContainer;
    let end = range.endContainer;
    let commonAncestor = range.commonAncestorContainer;
    let nodes = [];
    let node;

    // walk parent nodes from start to common ancestor
    for (node = start.parentNode; node; node = node.parentNode)
    {
        nodes.push(node);
        if (node == commonAncestor)
            break;
    }
    nodes.reverse();

    // walk children and siblings from start until end is found
    for (node = start; node; node = getNextNode(node))
    {
        nodes.push(node);
        if (node == end)
            break;
    }

    return nodes;
}