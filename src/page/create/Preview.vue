<template>
  <div>
    <canvas id="canvas" width="300" height="300"></canvas>
  </div>
</template>

<script>
import cloud from './word'
// import { fabricRender } from './core'
import { cnavasRender } from './core'
import { toRaw } from 'vue-demi'
import { emitter } from './event'
export default {
  created() {
    emitter.on('renderStart', this.render)
  },
  methods: {
    render(data) {
      data = toRaw(data)
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
          cnavasRender('canvas', size, data)
          emitter.emit('renderDone')
        })

      layout.start()
    },
  },
}
</script>
