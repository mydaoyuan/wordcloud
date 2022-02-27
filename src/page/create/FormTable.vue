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
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column align="center" label="操作" width="55">
          <template #default="{ $index }">
            <el-button
              type="danger"
              icon="Delete"
              @click="delteItem($index)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="140">
          <template #header>
            <el-input
              v-model="dynamicValidateForm.search"
              size="small"
              placeholder="搜索"
            />
          </template>
          <template #default="{ row }">
            <el-input v-model="row.text" size="small" placeholder="搜索" />
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
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { markRaw } from 'vue-demi'
import { emitter } from './event'
const DeleteIcon = markRaw(Delete)
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
      Delete: DeleteIcon,
      list: [
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
      ],
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
    this.addEventListren()
  },
  mounted() {
    this.emitterRender()
  },
  methods: {
    addEventListren() {
      emitter.on('render', this.emitterRender)
    },
    emitterRender() {
      emitter.emit('renderStart', this.list)
    },
    addItem() {
      if (this.dynamicValidateForm.new) {
        this.dynamicValidateForm.list.push({
          size: 15,
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
    delteItem(index) {
      this.dynamicValidateForm.list.splice(index, 1)
    },
    async getList() {
      this.listLoading = true
      this.dynamicValidateForm.list = this.list
      this.listLoading = false
    },
  },
}
</script>

<style scoped></style>
