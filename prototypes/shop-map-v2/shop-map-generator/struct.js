export const struct = {
    id: Number(),
    name: String(),
    location: String(),
    objects: [{
        category: String(),
        group: String(),
        x: Number(),
        y: Number(),
        width: Number(),
        height: Number(),
    }]
}

/**
 * Checks format of struct
 * @param {typeof struct} data
 * @returns true if data has all properties with correct types, flase otherwise
 */
export const parseStruct = (data) => {
    const results = {
        id:       parse(data?.id,       struct.id,       { canBeZero: true }                      ),
        name:     parse(data?.name,     struct.name                                               ),
        location: parse(data?.location, struct.location, { checks: [{ fn: parseLocationString }] }),

        objects: data?.objects && Array.isArray(data.objects) && data.objects.map(object => ({
            category: parse(object?.category, struct.objects[0].category                                         ),
            group:    parse(object?.group,    struct.objects[0].group                                            ),
            x:        parse(object?.x,        struct.objects[0].x,       { canBeZero: true, canBeNegative: true }),
            y:        parse(object?.y,        struct.objects[0].y,       { canBeZero: true, canBeNegative: true }),
            width:    parse(object?.width,    struct.objects[0].width,   { canBeZero: true }                     ),
            height:   parse(object?.height,   struct.objects[0].height,  { canBeZero: true }                     ),
        }))
    }

    const flattenedResults = Object.values(results).map(value => Array.isArray(value) ? value.map(object => Object.values(object)) : value).flat(2)

    if (flattenedResults.every(check => check === true)) 
        return true

    console.error(results)
    return false
}

/**
 * Checks if location is valid
 * @param {string} loc - location as latitute and longtitude string, e.g. "33.9867,-44.27198"
 * @returns true if location is in valid format, false otherwise
 */
function parseLocationString(loc) {
    const [lat, long, ...rest] = loc.split(',')
    return !isNaN(lat) && !isNaN(long) && rest.length === 0
}

/**
 * Parses a vlaue against multiple checks
 * @param {any} value - param to check its type
 * @param {any} against - param which type should be equal to value
 * @param {{ canBeNull?: boolean, canBeUndefined?: boolean, canBeZero?: boolean, canBeNegative?: boolean, checks: Array<{ fn: (value, ...args) => boolean, args?: Array<any> }> }} arg - type hint 
 * @param canBeNull - default=false
 * @param canBeUndefined - default=false
 * @param canBeZero - only for `typeof value == number`, default=false
 * @param canBeNegative - only for `typeof value == number`, default=false
 * @param checks - array od additional checks being functions and additional arguments to these functions
 * @returns 
 */
function parse(value, against, { canBeNull = false, canBeUndefined = false, canBeZero = false, canBeNegative = false, checks = [] } = {}) {
    if (!canBeNull && value === null)
        return false

    if (!canBeUndefined && value === undefined)
        return false

    if (!canBeZero && typeof value == 'number' && value === 0)
        return false

    if (!canBeNegative && typeof value == 'number' && value < 0)
        return false

    if (typeof value != typeof against)
        return false

    return checks.length === 0
        ? true
        : checks.map(({ fn, args = [] }) => fn(value, ...args)).every(check => check === true)
}
