import { createCanvas } from './base'

// 返回 canvas 示例
export function render(size, data) {
  const center = [size[0] / 2, size[1] / 2]
  const resultCanvasInfo = createCanvas(size[0], size[1])
  data
    .map((word) => {
      word.x = word.x + center[0]
      word.y = word.y + center[1]
      return word
    })
    .forEach((word) => drawText(resultCanvasInfo, word))
  return resultCanvasInfo.canvas
}

function drawText({ context, ratio }, word) {
  const { x, rotate, y, size, text } = word
  context.font = `${ratio * size}px serif`
  context.textAlign = 'center'
  context.translate(ratio * x, ratio * y)
  if (rotate) {
    context.rotate((rotate * Math.PI) / 180)
  }
  context.fillText(text, 0, 0)
  context.rotate((-rotate * Math.PI) / 180)
  context.translate(-ratio * x, -ratio * y)
  context.save()
  context.restore()
}
