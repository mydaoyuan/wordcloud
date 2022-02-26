<template>
  <div class="app-container">
    <el-form
      ref="formRef"
      :model="dynamicValidateForm"
      label-width="120px"
      class="demo-dynamic"
      size="small"
      inline
    >
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" width="140">
          <template #header>
            <el-input
              v-model="dynamicValidateForm.search"
              size="small"
              placeholder="搜索"
            />
          </template>
          <template #default="{ row }">
            <span>{{ row.text }}</span>
          </template>
        </el-table-column>

        <el-table-column width="125px" align="center" label="权重">
          <template #default="{ row }">
            <el-input-number
              style="width: 85px"
              v-model="row.size"
              :min="1"
              :max="1000"
              controls-position="right"
              size="small"
            />
          </template>
        </el-table-column>

        <el-table-column width="105px" align="center" label="旋转">
          <template #default="{ row }">
            <el-input
              style="width: 80px"
              v-model="row.rotate"
              placeholder="默认"
              size="small"
            />
          </template>
        </el-table-column>

        <el-table-column width="90px" label="颜色">
          <template #default="{ row }">
            <span v-if="!row.color">随机</span>
            <el-color-picker v-model="row.color" :predefine="predefineColors" />
          </template>
        </el-table-column>

        <el-table-column width="120px" label="字体">
          <template #default="{ row }">
            <el-select v-model="row.fontFamily" placeholder="选择字体">
              <el-option label="随机" value=""></el-option>
              <el-option label="Zone one" value="shanghai"></el-option>
              <el-option label="Zone two" value="beijing"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 12px">
        <el-form-item>
          <el-input
            v-model="dynamicValidateForm.new"
            placeholder="新增单词"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addItem">添加</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '../../assets/utils'
import { ElMessage } from 'element-plus'

export default {
  name: 'FormTable',
  data() {
    const predefineColors = [
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
      'rgba(255, 69, 0)',
      'rgb(255, 120, 0)',
      'hsv(51, 100, 98)',
      'hsva(120, 40, 94)',
      'hsl(181, 100%, 37%)',
      'hsla(209, 100%, 56%)',
      '#c71585',
    ]
    return {
      list: null,
      predefineColors,
      dynamicValidateForm: {
        search: '',
        new: '',
        list: [],
      },
      listLoading: true,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    parseTime,
    addItem() {
      if (this.dynamicValidateForm.new) {
        this.dynamicValidateForm.list.push({
          key: Date.now(),
          fontFamily: '',
          size: '',
          text: this.dynamicValidateForm.new,
        })
        this.dynamicValidateForm.new = ''
      } else {
        ElMessage({
          message: '请输入新增词语！',
          type: 'warning',
        })
      }
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
    async getList() {
      this.listLoading = true
      this.list = [
        { text: '螺蛳粉', size: 40, color: '' },
        { text: '重庆小面', size: 35, color: '' },
        { text: '肉夹馍', size: 35, color: '' },
        { text: '炸酱面', size: 32, color: '' },
      ]
      this.dynamicValidateForm.list = this.list
      this.listLoading = false
    },
  },
}
</script>

<style scoped></style>
