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
 * Checks if location is valid
 * @param {string} loc - location as latitute and longtitude string, e.g. "33.9867,-44.27198"
 * @returns true if location is in valid format, false otherwise
 */
const parseLocationString = (loc) => {
    const [lat, long, ...rest] = loc.split(',')
    return !isNaN(lat) && !isNaN(long) && rest.length === 0
}

/**
 * Checks format of struct
 * @param {typeof struct} data
 * @returns true if data has all properties with correct types, flase otherwise
 */
export const parseStruct = (data) => {
    return [
        data?.id       && typeof data.id       === typeof struct.id,
        data?.name     && typeof data.name     === typeof struct.name,
        data?.location && typeof data.location === typeof struct.location && parseLocationString(data.location),
        data?.objects  && Array.isArray(data.objects) && data.objects.map(object => [
            object?.category && typeof object.category === typeof struct.objects[0].category,
            object?.group    && typeof object.group    === typeof struct.objects[0].group,
            object?.x        && typeof object.x        === typeof struct.objects[0].x,
            object?.y        && typeof object.y        === typeof struct.objects[0].y,
            object?.width    && typeof object.width    === typeof struct.objects[0].width,
            object?.height   && typeof object.height   === typeof struct.objects[0].height,
        ].every(check => check === true)).every(check => check === true)
    ].every(check => check === true)
}
