<template>
  <div>
    <canvas id="canvas" width="300" height="300"></canvas>
  </div>
</template>

<script>
import cloud from './word'
import { render, update } from './core/fabric'
// import { render } from './core'
import {
  // toRaw,
  markRaw,
} from 'vue-demi'
import { emitter } from './event'
export default {
  data() {
    return {
      fabricInstance: null,
    }
  },
  created() {
    emitter.on('renderStart', this.render)
    emitter.on('exportImg', this.exportImg)
  },
  methods: {
    exportImg() {
      const dataUrl = this.fabricInstance.lowerCanvasEl.toDataURL('png')
      console.log(dataUrl)
      downloadFile(dataUrl, '词云图片')
    },
    render(data) {
      // data = toRaw(data)
      data.map((item) => {
        delete item.x
        delete item.y
      })
      const size = [300, 300]
      var layout = cloud()
        .size(size)
        .words(data)
        .padding(5)
        .rotate(function () {
          return ~~(Math.random() * 2) * 90
        })
        .font('serif')
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
