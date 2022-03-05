import { fabric } from 'fabric'

export function render(canvas, size, wordList, imgIcon) {
  var fabricInstance = new fabric.Canvas(canvas)
  if (imgIcon) {
    fabric.Image.fromURL(imgIcon, function (img) {
      console.log(parseInt(524) / img.width, img)
      var oImg = img.set({
        left: 0,
        top: 0,
        selectable: false,
        opacity: 0.1,
        scaleX: 524 / img.width, //按照默认的尺寸宽度为200的尺寸处理图片添加，所以此处计算原图宽和200的比例，进行缩放
        scaleY: 456 / img.height, //纵向缩放比以横向比例为主
      })
      fabricInstance.add(oImg)
    })
  }
  update(fabricInstance, size, wordList)
  return fabricInstance
}

export function update(fabricInstance, size, wordList) {
  const center = [size[0] / 2, size[1] / 2]
  fabricInstance.clear()
  console.log(wordList, 'wordList')
  wordList.map((word) => {
    word.x = word.x + center[0]
    word.y = word.y + center[1]
    return word
  })
  wordList.forEach((word) => {
    const { text, size, rotate, x, y, fontFamily, idKey, color } = word
    var fabricText = new fabric.Text(text, {
      textAlign: 'center',
      fontSize: size,
      idKey,
      fontFamily: fontFamily || 'serif',
      fill: color || getRandomColor(),
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
}

var getRandomColor = function () {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
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
