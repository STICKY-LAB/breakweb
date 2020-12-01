import createBlankElement from "./createBlankElement";


function fixElement(element : Element, noBlank : boolean = false) {
    const { width, height } = element.getBoundingClientRect();

    const style = (<any>element).style;
    const computedStyle = window.getComputedStyle(element);

    style.cssText = computedStyle.cssText;

    Object.assign(
        style,
        {
            boxSizing: "border-box",
            overflow: "hidden",
            display: computedStyle.display === "inline" ? "inline-block" : computedStyle,
            width: (
                width
            ) + "px",
            height: (
                height
            ) + "px"
        }
    );

    if(element instanceof SVGSVGElement) return;
    if(noBlank) return;
    for(const child of Array.from(element.children)) {
        const blank = createBlankElement(child);
        element.replaceChild(blank, child);
    }
}


export default fixElement;