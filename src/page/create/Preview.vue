<template>
  <div ref="canvascontent" style="position: relative">
    <canvas id="canvas" :width="size[0]" :height="size[1]"></canvas>
  </div>
</template>

<script>
import cloud from './word'
import { render, update } from './core/fabric'
// import { render } from './core'
import { toRaw, markRaw } from 'vue-demi'
import { emitter } from './event'
import Icon from './icon.png'
// import Icon from './iconcloud.png'
const hideCanvas = process.env.NODE_ENV === 'production'
export default {
  data() {
    return {
      fabricInstance: null,
      size: [400, 400],
    }
  },
  created() {
    emitter.on('renderStart', this.render)
    emitter.on('exportImg', this.exportImg)
    emitter.on('updateObject', this.updateObject)
  },
  methods: {
    updateObject({ item, type }) {
      const objects = this.fabricInstance.getObjects()
      const { idKey, color } = item
      const cur = objects.find((fobject) => fobject.idKey == idKey)
      if (!cur) return console.error(`没有找到 ${idKey} 元素`)
      if (type == 'color') {
        cur.set('fill', color)
        this.fabricInstance.requestRenderAll()
        console.log('done color')
      } else {
        console.error(`${type} 没有定义处理策略`)
      }
    },
    exportImg() {
      const dataUrl = this.fabricInstance.lowerCanvasEl.toDataURL('png')
      console.log(dataUrl)
      downloadFile(dataUrl, '词云图片')
    },
    async render(data) {
      var shapBoard = await this.getShapBorad()
      data = JSON.parse(JSON.stringify(toRaw(data)))
      data.map((item) => {
        delete item.x
        delete item.y
        item.fontFamily = item.fontFamily || 'serif'
      })
      const size = this.size
      !hideCanvas && paint(shapBoard.sprite, [400, 400])
      var layout = cloud(shapBoard.sprite)
        .size(size)
        .words(data)
        .padding(3)
        .rotate(function (d) {
          return d.rotate || ~~(Math.random() * 2) * 90
        })
        .font('serif')
        .font(function (d) {
          return d.fontFamily
        })
        .fontSize(function (d) {
          return d.size
        })
        .on('end', (data) => {
          if (!this.fabricInstance) {
            this.fabricInstance = markRaw(render('canvas', size, data))
          } else {
            update(this.fabricInstance, size, data)
          }
          console.log(this.fabricInstance, 'this.fabricInstance')
          // cnavasRender('canvas', size, data)
          emitter.emit('renderDone')
        })

      layout.start()
    },
    getShapBorad() {
      return new Promise((resolve) => {
        const size = [400, 400]
        var mycanvas = document.createElement('canvas')
        mycanvas.width = size[0]
        mycanvas.height = size[1]
        mycanvas.style = `position: absolute;
          width: 400px;
          height: 400px;
          left: 0px;
          top: 0px;
          touch-action: none;
          user-select: none;
          opacity: 0.2;
          pointer-events: none;
          cursor: default;`
        var c = mycanvas.getContext('2d')
        // this.$refs.canvascontent.appendChild(mycanvas)
        // 内存中先加载，然后当内存加载完毕时，再把内存中的数据填充到我们的 dom元素中，这样能够快速的去
        // 反应
        var img = new Image()
        img.onload = function () {
          // 将图片画到canvas上面上去！
          console.log(img, 'img')
          c.drawImage(img, 0, 0, size[0], size[1])
          var pixels = c.getImageData(0, 0, size[0], size[1]).data
          var sprite = []
          let w = size[0],
            w32 = w >> 5,
            h = size[1]

          var d = {}
          d.x1 = 0
          d.y1 = 0
          d.x0 = 0
          d.y0 = 0
          for (var i = 0; i < h * w32; i++) sprite[i] = 0
          var x = 0
          var y = 0
          var seen = 0
          console.log(pixels, 'pixels')
          for (var j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
              var k = w32 * j + (i >> 5),
                // m 就是某个像素点的信息， 400 是size
                m = pixels[((y + j) * 400 + (x + i)) * 4]
                  ? 0
                  : 1 << (31 - (i % 32))
              sprite[k] |= m
              seen |= m
            }
            if (!seen) {
              d.y0++
              h--
              j--
              y++
            }
          }
          // d.y1 = d.y0 + seenRow
          // d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32)
          d.sprite = sprite
          console.log(d)
          resolve(d)
        }

        img.src = Icon
      })
    },
  },
}

function downloadFile(content, fileName) {
  //下载base64图片
  var base64ToBlob = function (code) {
    let parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length
    let uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {
      type: contentType,
    })
  }
  let aLink = document.createElement('a')
  let blob = base64ToBlob(content) //new Blob([content]);
  let evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}
const paint = (board, paintSize) => {
  const curSize = paintSize
  const imageData = new ImageData(curSize[0], curSize[1])
  let array = imageData.data
  for (let i = 0; i < curSize[1]; i++) {
    for (let j = 0; j < curSize[0] >> 5; j++) {
      let value = board[i * (curSize[0] >> 5) + j]
      for (let k = 0; k < 32; k++) {
        // 遮罩，获取对应位置bit值
        const msk = 0b1 << (32 - k)
        if (value & msk) {
          // 占用像素, 填充白色
          for (let l = 0; l < 4; l++) {
            array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + l] = 255
          }
        } else {
          // 未占用像素, 填充黑色
          for (let l = 0; l < 3; l++) {
            array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + l] = 0
          }
          array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + 3] = 255
        }
        // 数组元素分割线, 填充红色, 间隔32px
        if (k === 0) {
          array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + 0] = 255
          array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + 1] = 0
          array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + 2] = 0
        }
      }
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = curSize[0]
  canvas.height = curSize[1]
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  canvas.style.marginRight = '10px'
  document.body.appendChild(canvas)
}
</script>
