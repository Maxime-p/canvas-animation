export const randomRange = (min: number, max: number) => {
  const min_ = Math.min(min, max)
  const max_ = Math.max(min, max)
  return (max_ - min_) * Math.random() + min_
}

export const deg2rad = (deg: number) => (deg * Math.PI) / 180

export const distance2d = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export const clamp = (value: number, min: number, max: number) => {
  const min_ = max < min ? max : min
  const max_ = min > max ? min : max
  value = value > max_ ? max_ : value
  value = value < min_ ? min_ : value
  return value
}
