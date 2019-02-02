const countTotal = (arr, idx) => arr.reduce((acc, cur, curIdx) => {
  if (idx >= curIdx) {
    return acc + Math.abs(cur[1][1])
  }
  return acc
}, 0).toFixed(2)

export default countTotal
