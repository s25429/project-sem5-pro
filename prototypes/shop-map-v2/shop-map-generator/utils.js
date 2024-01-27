/**
 * Modifies passed element by setting it attributes using 'setAttribute' method
 * @param {Element} el - element to be modified
 * @param {{ [key: string]: string }} attrs - object with attributes to set with setAttribute(key, value)
 */
export function addAttrs(el, attrs) {
    if (attrs !== undefined)
        Object
            .entries(attrs)
            .forEach(([key, value]) => el.setAttribute(key, value))
}

/**
 * Group arrays of objects by a certain property, does not modify objects in any way
 * @param {Array<{}>} array - array of objects
 * @param {string} key - property by which grouping should be processed
 * @returns object with [key] as grouping property which value is an array of objects grouped by that property
 */
export function groupBy(array, key) {
    return array.reduce((acc, obj) => {
        (acc[obj[key]] = acc[obj[key]] || []).push(obj)
        return acc
    }, {})
}

/**
 * Returns max width and height to contain all map objects without clipping
 * @param {createMap.specs.objects} objects - array of objects
 * @returns tuple containing max width and max height
 */
export function getContainedSize(objects) {
    const getMax = (left, right, sum) => 
        ![left, right].includes(undefined) && left + right > sum
            ? left + right
            : sum

    let maxW = 0
    let maxH = 0

    objects.forEach(obj => {
        maxW = getMax(obj?.x, obj?.width, maxW)
        maxH = getMax(obj?.y, obj?.height, maxH)
    })

    return [maxW, maxH]
}
