
interface ElementI {
    element: Element,
    depth: number
}

function getElements(element : Element, maxDepth = Infinity, elements : Array<ElementI> = [], depth = 0) {
    if(element instanceof SVGSVGElement) return elements;
    if(depth > maxDepth) return elements;
    
    for(const child of Array.from(element.children)) {
        getElements(child, maxDepth, elements, depth + 1);
        if(!elements.some(({ element }) => element === child)) {
            elements.push({ element: child, depth });
        }
    }
    return elements;
}

export default getElements;