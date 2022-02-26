<template>
  <el-container>
    <el-header> <HeadTool></HeadTool></el-header>
    <el-container>
      <el-aside width="580px">
        <FormTable></FormTable>
      </el-aside>
      <el-container>
        <el-main> <Preview></Preview></el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import FormTable from './FormTable.vue'
import Preview from './Preview.vue'
import HeadTool from './HeadTool.vue'
</script>

<style lang="scss" scoped></style>
