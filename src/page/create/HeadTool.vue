<template>
  <div>
    <el-button
      :loading="loadding"
      :icon="Orange"
      @click="emitterRender"
      type="primary"
      >生成词云</el-button
    >
    <el-button @click="exportImg" type="success">导出图片</el-button>
    <el-button @click="fillOther" type="success">填充重复项目</el-button>
  </div>
</template>

<script setup>
import { Orange } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue-demi'
import { emitter } from './event'
const loadding = ref(false)
const emitterRender = () => {
  loadding.value = true
  emitter.emit('render')
}
const exportImg = () => {
  emitter.emit('exportImg')
}
const listLoadingDone = () => {
  loadding.value = false
}

const fillOther = () => {
  window.myContinue()
}
onMounted(() => {
  emitter.on('renderDone', listLoadingDone)
})
</script>

<style lang="scss" scoped></style>
