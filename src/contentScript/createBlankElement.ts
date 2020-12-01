

function createBlankElement(element : Element) {
    const { width, height } = element.getBoundingClientRect();
    const div = document.createElement("div");

    const computedStyle = window.getComputedStyle(element);
    div.style.cssText = computedStyle.cssText;

    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.margin = "";

    return div;
}

export default createBlankElement;