<template>
  <div>
    <el-button
      :loading="loadding"
      :icon="Orange"
      @click="emitterRender"
      type="primary"
      >生成词云</el-button
    >
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
const listLoadingDone = () => {
  loadding.value = false
}
onMounted(() => {
  emitter.on('renderDone', listLoadingDone)
})
</script>

<style lang="scss" scoped></style>
