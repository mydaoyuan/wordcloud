<template>
  <div>
    <canvas id="canvas" width="300" height="300"></canvas>
  </div>
</template>

<script>
import cloud from './word'
import { fabricRender } from './core'
export default {
  mounted() {
    const size = [300, 300]
    var layout = cloud()
      .size(size)
      .words([
        { text: '螺蛳粉', size: 40, color: 'red' },
        { text: '重庆小面', size: 35, color: 'blue' },
        { text: '肉夹馍', size: 35, color: 'blue' },
        { text: '炸酱面', size: 32, color: 'blue' },
        { text: '沙县小吃', size: 25, color: 'blue' },
        { text: '烤冷面', size: 23, color: 'blue' },
        { text: '臭豆腐', size: 23, color: 'blue' },
        { text: '钵钵鸡', size: 20, color: 'red' },
        { text: '酸辣粉', size: 19, color: 'blue' },
        { text: '冒菜', size: 15, color: 'blue' },
        { text: '驴打滚', size: 12, color: 'blue' },
        { text: '板栗', size: 11, color: 'red' },
        { text: '醪糟', size: 10, color: 'blue' },
      ])
      .padding(5)
      .rotate(function () {
        return ~~(Math.random() * 2) * 90
      })
      .font('Impact')
      .fontSize(function (d) {
        return d.size
      })
      .on('end', (data) => {
        fabricRender('canvas', size, data)
      })

    layout.start()
  },
  methods: {},
}
</script>
