export function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  var ratio = window.devicePixelRatio || 1
  canvas.width = ratio * width
  canvas.height = ratio * height
  canvas.style.width = `${width}px` // 控制显示大小
  canvas.style.height = `${height}px` // 控制显示大小
  var context = canvas.getContext('2d')
  // const { context, ratio } = getContext(canvas);
  return {
    context,
    ratio,
    canvas,
  }
}
