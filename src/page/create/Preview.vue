<template>
  <div>
    <canvas id="canvas" :width="size[0]" :height="size[1]"></canvas>
  </div>
</template>

<script>
import cloud from './word'
import { render, update } from './core/fabric'
// import { render } from './core'
import { toRaw, markRaw } from 'vue-demi'
import { emitter } from './event'
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
    render(data) {
      data = JSON.parse(JSON.stringify(toRaw(data)))
      data.map((item) => {
        delete item.x
        delete item.y
        item.fontFamily = item.fontFamily || 'serif'
      })
      const size = this.size
      var layout = cloud()
        .size(size)
        .words(data)
        .padding(5)
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
