<template>
  <el-container>
    <el-header> <HeadTool></HeadTool></el-header>
    <el-container>
      <el-aside width="580px">
        <FormTable></FormTable>
      </el-aside>
      <el-container>
        <el-main> <Preview></Preview></el-main>
      </el-container>
    </el-container>
    <el-footer>
      <iframe
        height="500"
        width="1200"
        src="https://wj.qq.com/s2/9767902/a091/"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </el-footer>
  </el-container>
</template>

<script setup>
import FormTable from './FormTable.vue'
import Preview from './Preview.vue'
import HeadTool from './HeadTool.vue'
</script>

<style lang="scss" scoped></style>
