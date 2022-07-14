<template>
  <div ref="canvascontent" style="position: relative">
    <canvas id="canvas" :width="size[0]" :height="size[1]"></canvas>
  </div>
</template>

<script>
// import cloud from './word.source'
import cloud from './word'
import { render, update } from './core/fabric'
// import { render } from './core'
import { toRaw, markRaw } from 'vue-demi'
import { emitter } from './event'
import Icon from './icon.png'
import { paint } from '../../assets/utils'
// import Icon from './iconcloud.png'
const hideCanvas = process.env.NODE_ENV === 'production'
export default {
  data() {
    return {
      fabricInstance: null,
      size: [544, 456],
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
      console.log(data, 'datadatadata')
      data.map((item) => {
        delete item.x
        delete item.y
        item.fontFamily = item.fontFamily || 'serif'
      })
      const size = this.size
      !hideCanvas && paint(shapBoard.sprite, [544, 456])
      var layout = cloud(shapBoard.sprite)
        .size(size)
        .words(data)
        .padding(0)
        .rotate(function (d) {
          // return d.rotate || 0
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
            this.fabricInstance = markRaw(render('canvas', size, data, Icon))
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
        const size = [544, 456]
        var mycanvas = document.createElement('canvas')
        mycanvas.width = size[0]
        mycanvas.height = size[1]
        mycanvas.style = `position: absolute;
          width: ${size[0]}px;
          height: ${size[1]}px;
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
          for (var j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
              var k = w32 * j + (i >> 5),
                // m 就是某个像素点的信息， 400 是size
                m = pixels[((y + j) * size[0] + (x + i)) * 4]
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
</script>
