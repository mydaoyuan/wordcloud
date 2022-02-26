import { fabric } from 'fabric'

export function render(canvas, size, wordList) {
  const center = [size[0] / 2, size[1] / 2]
  wordList.map((word) => {
    word.x = word.x + center[0]
    word.y = word.y + center[1]
    return word
  })

  var fabricInstance = new fabric.Canvas(canvas)
  wordList.forEach((word) => {
    const { text, size, rotate, x, y } = word
    var fabricText = new fabric.Text(text, {
      textAlign: 'center',
      fontSize: size,
      fontFamily: 'serif',
      lockScalingFlip: true,
      lockSkewingX: true,
      lockSkewingY: true,
      lockScalingY: true,
      lockScalingX: true,
    })
    const cr = Math.cos((rotate * Math.PI) / 180)
    const sr = Math.sin((rotate * Math.PI) / 180)
    var transformMatrix = [
      cr.toFixed(6),
      sr.toFixed(6),
      -1 * sr.toFixed(6),
      cr.toFixed(6),
      x,
      y,
    ]
    var mT = fabric.util.multiplyTransformMatrices(
      transformMatrix,
      [1, 0, 0, 1, 0, 0]
    )
    var options = fabric.util.qrDecompose(mT)
    var newCenter = { x: options.translateX, y: options.translateY }
    fabricText.set(options)
    fabricText.setPositionByOrigin(newCenter, 'center', 'center')
    fabricInstance.add(fabricText)
  })
  return canvas
}

// eslint-disable-next-line no-unused-vars
// function name(params) {
//   // eslint-disable-next-line no-undef
//   var obj = canvas.item(0)
//   // get the current transform matrix, from object properties.
//   var currentT = obj.calcTransformMatrix()
//   // get the transformMatrix array
//   var transformMatrix = obj.transformMatrix
//   // multiply the matrices together to get the combined transform
//   var mT = fabric.util.multiplyTransformMatrices(currentT, transformMatrix)
//   // Unfold the matrix in a combination of scaleX, scaleY, skewX, skewY...
//   var options = fabric.util.qrDecompose(mT)
//   var newCenter = { x: options.translateX, y: options.translateY }
//   // reset transformMatrix to identity and resets flips since negative scale
//   // resulting from decompose, will automatically set them.
//   obj.transformMatrix = [1, 0, 0, 1, 0, 0]
//   obj.flipX = false
//   obj.flipY = false
//   obj.set(options)
//   // position the object in the center given from translateX and translateY
//   obj.setPositionByOrigin(newCenter, 'center', 'center')
// }
