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
  },
  methods: {
    getBaseData() {},
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
</script>
