<template>
  <div ref="canvascontent" style="position: relative">
    <canvas id="canvas" :width="size[0]" :height="size[1]"></canvas>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-debugger */
import cloud from './word'
import { render, update } from './core/fabric'
// import { render } from './core'
import { toRaw, markRaw } from 'vue-demi'
import { emitter } from './event'
import Icon from './icon.png'
// import Icon from './icon4.png'
const hideCanvas = process.env.NODE_ENV === 'production'
export default {
  data() {
    return {
      fabricInstance: null,
      size: [524, 458],
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
      !hideCanvas && paint(shapBoard.sprite, [1024, 1024])
      var layout = cloud(shapBoard.sprite)
        .size(size)
        .words(data)
        .padding(3)
        .rotate(function (d) {
          return d.rotate || 0
          // return d.rotate || ~~(Math.random() * 2) * 90
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
        const size = [1024, 1024]
        const imgSize = [524, 458]
        var mycanvas = document.createElement('canvas')
        mycanvas.width = size[0]
        mycanvas.height = size[1]
        mycanvas.style = `
          // width: ${size[0]}px;
          // height: ${size[1]}px;
          cursor: default;`
        // mycanvas.style = `position: absolute;
        //   width: ${size[0]}px;
        //   height: ${size[1]}px;
        //   left: 0px;
        //   top: 0px;
        //   touch-action: none;
        //   user-select: none;
        //   opacity: 0.2;
        //   pointer-events: none;
        //   cursor: default;`
        var c = mycanvas.getContext('2d')
        // this.$refs.canvascontent.appendChild(mycanvas)
        document.body.appendChild(mycanvas)
        // 内存中先加载，然后当内存加载完毕时，再把内存中的数据填充到我们的 dom元素中，这样能够快速的去
        // 反应
        var img = new Image()
        img.onload = function () {
          // 将图片画到canvas上面上去！
          c.drawImage(img, 0, 0, imgSize[0], imgSize[1])
          var imgdata = c.getImageData(0, 0, size[0], size[1])
          putImageDataInWin(imgdata)
          var pixels = imgdata.data
          console.log(imgdata)
          var sprite = []
          let w = size[0],
            // 一个数字可以保存32个像素信息，所以需要计算宽度几个32保存
            w32 = w >> 5,
            h = size[1]

          var d = {}
          for (var i = 0; i <= h * w32; i++) sprite[i] = 0
          // var seen = 0
          for (var j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
              // 存储信息的位置
              const bigPosition = w32 * j // j行位置对应的数组位置
              const litePos = i >> 5 // 当前像素点对应的存储数字位置
              var k = bigPosition + litePos

              // rgba 颜色通道
              // const value0 = pixels[(j * size[0] + i) * 4]
              // const value1 = pixels[(j * size[0] + i) * 4 + 1]
              // const value2 = pixels[(j * size[0] + i) * 4 + 2]
              // const value3 = pixels[(j * size[0] + i) * 4 + 3]

              // const value = value0 + value1 + value2 + value3
              var m = pixels[(j * size[0] + i) * 4] ? 1 << (31 - (i % 32)) : 0
              // var m = value ? 0 : 1 << (31 - (i % 32))
              // 比如 i 是 2,第二个像素点有值，
              // 就是  1 << 31 - 2  即为   1 << 29
              // (1 << (31 - 2 )).toString(2).padStart(32, '0')
              // '00000000000000000000000000000001'
              // 变化为
              // '00100000000000000000000000000000'
              sprite[k] |= m
              // seen |= m
            }
            // if (!seen) {
            //   h--
            //   j--
            //   y++
            // }
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
  console.log(imageData, '===')
  let array = imageData.data
  for (let i = 0; i < curSize[1]; i++) {
    for (let j = 0; j < curSize[0] >> 5; j++) {
      // 获取对应位置
      const lineWith = curSize[0] >> 5 // 高度下一行需要加上的数值
      const pos = i * lineWith + j
      let value = board[pos]
      let valueStr = getTwoString(value)
      for (let k = 0; k < 32; k++) {
        // 遮罩，获取对应位置bit值
        // const msk = 1 << (32 - k)
        const msk = +valueStr[k]
        // // const msk = value.toString(2).padStart(32, '0')[k] != 0
        if (msk) {
          // 占用像素, 填充黑色
          for (let l = 0; l < 3; l++) {
            array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + l] = 0
          }
          array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + 3] = 255
        } else {
          // 没占用像素, 填充白色
          for (let l = 0; l < 4; l++) {
            array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + l] = 255
          }
        }
        // if (value & msk) {
        //   // 占用像素, 填充白色
        //   for (let l = 0; l < 4; l++) {
        //     array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + l] = 255
        //   }
        // } else {
        //   // 未占用像素, 填充黑色
        //   for (let l = 0; l < 3; l++) {
        //     array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + l] = 0
        //   }
        //   array[i * curSize[0] * 4 + j * 32 * 4 + k * 4 + 3] = 255
        // }
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
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, curSize[0], curSize[1])
  ctx.putImageData(imageData, 0, 0)
  canvas.style.marginRight = '10px'
  document.body.appendChild(canvas)
}

// const createNewCanvas =

function getTwoString(n) {
  // write code here
  //-123的二进制表示为-1111011，123的为1111011，因此首先要得到负数二进制的补码表示
  //其后面部分的补码0000101 = 122的正码1111011按位取反，
  //这个正码加上前面的0即是再全部按位取反即得-123的补码表示
  var str
  if (n < 0) {
    n = -n
    n = n - 1
    str = (Array(32).join('0') + n.toString(2)).slice(-32)
    str = exchange(str)
  } else {
    str = (Array(32).join('0') + n.toString(2)).slice(-32)
  }

  return str
}

//如果是负数，0变1，1变0
function exchange(str) {
  var arr = str.split('')
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == 0) {
      arr[i] = 1
    } else {
      arr[i] = 0
    }
  }
  str = arr.join('')
  return str
}

function putImageDataInWin(temp1) {
  var canvas = document.createElement('canvas')
  canvas.width = canvas.height = 800
  var ctx = canvas.getContext('2d')
  ctx.putImageData(temp1, 0, 0, 0, 0, 524, 458)
  document.body.append(canvas)
}
</script>
