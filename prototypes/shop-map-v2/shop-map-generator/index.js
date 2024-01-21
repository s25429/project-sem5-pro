import { parseStruct } from './struct.js'


const test = parseStruct({
    id: 5,
    name: 'hello',
    location: '3.9,-4.5',
    objects: [{
        category: '1',
        group: '2',
        x: 1,
        y: 2,
        width: 3,
        height: 4,
    }, {
        category: '1',
        group: '2',
        x: 1,
        y: 2,
        width: 3,
        height: 4,
    }] 
})
console.log(test)