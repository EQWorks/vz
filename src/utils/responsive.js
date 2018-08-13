// responsive utils for axis ticks
const numTicksForHeight = (height) => {
  if (height <= 300) {
    return 3
  }
  if (height > 300 && height <= 600) {
    return 5
  }
  return 10
}

const numTicksForWidth = (width) => {
  if (width <= 300) {
    return 2
  }
  if (width > 300 && width <= 400) {
    return 5
  }
  return 10
}

export {
  numTicksForHeight,
  numTicksForWidth,
}
