const arrayToMap = arr => new Map(arr.map(i => [i[0], i.slice(1)]))

export default arrayToMap
