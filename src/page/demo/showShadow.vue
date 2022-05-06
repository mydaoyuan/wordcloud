<template>
  <div>
    <el-button @click="showBorad" type="primary">生成图例</el-button>
    <el-button @click="showworld" type="primary">生成单词</el-button>
    <el-button @click="addWorld">增加一个单词</el-button>
    <div ref="canvascontent" style="position: relative"></div>
    <input type="text" v-model="pos" />
  </div>
</template>

<script>
import Icon from '../create/icon.png'
export default {
  data() {
    return {
      size: [544, 458],
      pos: 0,
    }
  },
  mounted() {
    this.showBorad()
  },
  methods: {
    async render() {
      var shapBoard = await this.getShapBorad()
      this.shapBoard = shapBoard
    },
    async showBorad() {
      await this.render()
      this.ctx = paint(this.shapBoard.sprite, this.size)
    },
    showworld() {
      paint(this._getTextSprite('测试', [64, 40]), [64, 40])
    },
    getShapBorad() {
      return new Promise((resolve) => {
        //基础代码
        const size = this.size
        var mycanvas = document.createElement('canvas')
        mycanvas.width = size[0]
        mycanvas.height = size[1]
        mycanvas.style = `
          // width: ${size[0]}px;
          // height: ${size[1]}px;
          cursor: default;`
        var c = mycanvas.getContext('2d')
        // this.$refs.canvascontent.appendChild(mycanvas)
        var img = new Image()
        //基础代码 完毕
        img.onload = function () {
          // 将图片画到canvas上面上去 并且获取图片的数据
          // https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData
          // Uint8ClampedArray 描述了一个一维数组，包含以 RGBA 顺序的数据，数据使用  0 至 255（包含）的整数表示。
          c.drawImage(img, 0, 0, size[0], size[1])
          var imgdata = c.getImageData(0, 0, size[0], size[1])
          var pixels = imgdata.data
          console.log(imgdata)
          // 开始进行像素处理
          var sprite = []
          let w = size[0],
            // 一个数字可以保存32个像素信息，所以w32就是需要几个数字进行存储
            w32 = w >> 5,
            h = size[1]
          // 预先设置为 0 ，即为空白页面
          for (var i = 0; i < h * w32; i++) sprite[i] = 0
          // 开始遍历图片的每个像素，h 高度  w 宽度
          // 本处需要知道，如何确认(i,j) 点的像素应该保存在 哪个 数字？
          // 本处需要知道，如何利用位操作来更新记录信息？
          for (var j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
              // 存储信息的位置
              const rowPosition = w32 * j // j行位置对应的数组位置
              const colPos = i >> 5 // 当前像素点对应的存储数字位置
              var spritePos = rowPosition + colPos

              // rgba 颜色通道
              // const value0 = pixels[(j * size[0] + i) * 4]
              // const value1 = pixels[(j * size[0] + i) * 4 + 1]
              // const value2 = pixels[(j * size[0] + i) * 4 + 2]
              // const value3 = pixels[(j * size[0] + i) * 4 + 3]
              // const value = value0 + value1 + value2 + value3
              var m = pixels[(j * w + i) * 4] ? 1 << (31 - (i % 32)) : 0
              // 如果
              // 1 << (31 - (i % 32)) 的含义 如下：
              // 比如 i 是 2,第二个像素点有值，
              // 就是  1 << 31 - 2  即为   1 << 29
              // (1 << (31 - 2 )).toString(2).padStart(32, '0')
              // '00000000000000000000000000000001'
              // 变化为
              // '00100000000000000000000000000000'
              // ** 把对应位置的数据与 新数字进行 | 操作，即可更新数据：
              sprite[spritePos] |= m
              // 比如： 原数据为 '00000000001000000000010000001000'代表有 2 个像素被占用
              // 更新后变成 '00100000001000000000010000001000' 代表有 3 个像素被占用
            }
          }
          console.log(sprite)
          resolve({ sprite })
        }
        img.src = Icon
      })
    },
    _getTextSprite(text, size) {
      var mycanvas = document.createElement('canvas')
      mycanvas.width = size[0]
      mycanvas.height = size[1]
      mycanvas.style = `
          cursor: default;`
      var c = mycanvas.getContext('2d')
      // this.$refs.canvascontent.appendChild(mycanvas)
      //基础代码 完毕
      c.fillStyle = 'red'
      c.font = '24px serif'
      c.fillText(text, 0, 25)
      var imgdata = c.getImageData(0, 0, size[0], size[1])
      var pixels = imgdata.data
      console.log(imgdata)
      // 开始进行像素处理
      var sprite = []
      let w = size[0],
        // 一个数字可以保存32个像素信息，所以w32就是需要几个数字进行存储
        w32 = w >> 5,
        h = size[1]
      // 预先设置为 0 ，即为空白页面
      for (var i = 0; i < h * w32; i++) sprite[i] = 0
      // 开始遍历图片的每个像素，h 高度  w 宽度
      // 本处需要知道，如何确认(i,j) 点的像素应该保存在 哪个 数字？
      // 本处需要知道，如何利用位操作来更新记录信息？
      for (var j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          // 存储信息的位置
          const rowPosition = w32 * j // j行位置对应的数组位置
          const colPos = i >> 5 // 当前像素点对应的存储数字位置
          var spritePos = rowPosition + colPos

          // rgba 颜色通道
          // const value0 = pixels[(j * size[0] + i) * 4]
          // const value1 = pixels[(j * size[0] + i) * 4 + 1]
          // const value2 = pixels[(j * size[0] + i) * 4 + 2]
          // const value3 = pixels[(j * size[0] + i) * 4 + 3]
          // const value = value0 + value1 + value2 + value3
          var m = pixels[(j * w + i) * 4] == 255 ? 1 << (31 - (i % 32)) : 0
          // 如果
          // 1 << (31 - (i % 32)) 的含义 如下：
          // 比如 i 是 2,第二个像素点有值，
          // 就是  1 << 31 - 2  即为   1 << 29
          // (1 << (31 - 2 )).toString(2).padStart(32, '0')
          // '00000000000000000000000000000001'
          // 变化为
          // '00100000000000000000000000000000'
          // ** 把对应位置的数据与 新数字进行 | 操作，即可更新数据：
          sprite[spritePos] |= m
          // 比如： 原数据为 '00000000001000000000010000001000'代表有 2 个像素被占用
          // 更新后变成 '00100000001000000000010000001000' 代表有 3 个像素被占用
        }
      }
      console.log(sprite)
      return { sprite, imgdata }
    },
    addWorld() {
      // const pos = [0, 200]
      const pos = [this.size[0] * Math.random(), this.size[1] * Math.random()]
      const text = '测试'
      const ctx = this.ctx
      const textData = this._getTextSprite('测试', [64, 40])
      const textSprite = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3072, 25165824, 478285344, 29360128,
        520064568, 33030144, 251645468, 33030144, 247954972, 31195136,
        134184460, 31326208, 1946119695, -131072, 1004498441, -131072,
        1054830108, 29360128, 517959422, 62914560, 517959421, -4194304,
        251620893, -4194304, 218066460, 415236096, 218066460, 415236096,
        486501916, -1730150400, 2113891869, -1730150400, 972574239, -1730019328,
        410914335, 536215552, 409931294, 2138439680, 417824287, -63045632,
        1069775933, -532807680, 528489500, -2145517568, 234887192, 917504, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]
      ctx.font = '24px serif'
      const tag = {
        sprite: textSprite,
        x: Math.floor(pos[0]),
        // y: 0,
        y: +this.pos ? +this.pos : Math.floor(pos[1]),
        // x: Math.floor(pos[0]),
        // y: Math.floor(pos[1]) - 40,
        width: 64,
        height: 40,
        imgData: textData.imgdata,
      }
      const isCrash = place(this.shapBoard.sprite, tag, [64, 40])
      ctx.fillStyle = isCrash ? 'red' : 'blue'
      console.log(isCrash, '是不是重叠了')
      // ctx.putImageData(
      //   textData.imgdata,
      //   0,
      //   +this.pos ? +this.pos : Math.floor(pos[1])
      // )
      // 填充文字 需要加上字体大小的高度， canvas 绘制文字是基于 font line的
      ctx.fillText(
        text,
        Math.floor(pos[0]),
        (+this.pos ? +this.pos : Math.floor(pos[1])) + 24
      )
      // ctx.fillText(text, pos[0], pos[1] - 40)
    },
  },
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
  return ctx
}
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

function place(board, tag, size) {
  // 判断放置
  // if (!cloudCollide(tag, board, size[0])) {
  //   // 更新board
  //   var sprite = tag.sprite,
  //     w = tag.width >> 5,
  //     sw = size[0] >> 5,
  //     lx = tag.x - (w << 4),
  //     // lx &  127
  //     sx = lx & 0x7f,
  //     // 偏移量
  //     msx = 32 - sx,
  //     h = tag.height,
  //     x = tag.height * sw + (lx >> 5),
  //     last
  //   for (var j = 0; j < h; j++) {
  //     last = 0
  //     for (var i = 0; i <= w; i++) {
  //       board[x + i] |=
  //         (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)
  //     }
  //     x += sw
  //   }
  //   delete tag.sprite
  //   return true
  // }
  // return false
  return cloudCollide(tag, board, size[0])
}

// Use mask-based collision detection.
// 碰撞检测
function cloudCollide(tag, board, sw) {
  // 算出几个number一行
  // 算出对应的X 和位移， 再进行比较  看看是否有重叠
  // [544, 458]
  sw = 544 >> 5
  var sprite = tag.sprite,
    w = tag.width >> 5,
    // lx  leftX   距离左边的位置
    lx = tag.x,
    newsx = tag.x - 32 * (tag.x >> 5),
    sx = newsx, // 需要偏移的量
    // sx = lx & 0x7f,
    msx = 32 - sx,
    h = tag.height,
    x = tag.y * sw + (lx >> 5),
    last
  console.log(tag, x, 'is tag and x')
  for (var j = 0; j < h; j++) {
    last = 0
    console.log(x, `sx=${sx} msx=${msx} `)
    for (var i = 0; i <= w; i++) {
      const boardItem = board[x + i]
      if (
        ((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) &
        boardItem
      ) {
        console.log(j, i, last)
        return true
      }
      if (msx == 32) last = 0
    }
    x += sw
  }
  return false
}
</script>
