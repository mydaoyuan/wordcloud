export function createCanvas(canvas, width, height) {
  let canvasInstance
  if (typeof canvas === 'string') {
    canvasInstance = document.getElementById(canvas)
  } else {
    canvasInstance = document.createElement('canvas')
  }
  var ratio = window.devicePixelRatio || 1
  canvasInstance.width = ratio * width
  canvasInstance.height = ratio * height
  canvasInstance.style.width = `${width}px` // 控制显示大小
  canvasInstance.style.height = `${height}px` // 控制显示大小
  var context = canvasInstance.getContext('2d')
  // const { context, ratio } = getContext(canvas);
  return {
    context,
    ratio,
    canvas: canvasInstance,
  }
}
