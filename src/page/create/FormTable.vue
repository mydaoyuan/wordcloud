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
        @current-change="changeCurrent"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column align="center" label="操作" width="55">
          <template #default="{ $index }">
            <el-button
              type="danger"
              :icon="Delete"
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
          <template #default="{ row, $index }">
            <span v-if="$index != currentItemIndex">{{ row.text }}</span>
            <el-input
              v-else
              v-model="row.text"
              size="small"
              placeholder="搜索"
            />
          </template>
        </el-table-column>

        <el-table-column width="125px" align="center" label="权重">
          <template #default="{ row, $index }">
            <span v-if="$index != currentItemIndex">{{ row.size }}</span>
            <el-input-number
              v-else
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
          <template #default="{ row, $index }">
            <span v-if="$index != currentItemIndex">{{
              row.rotate === undefined ? '默认随机生成' : row.rotate
            }}</span>
            <el-input
              v-else
              style="width: 80px"
              v-model="row.rotate"
              placeholder="默认随机生成"
              size="small"
            />
          </template>
        </el-table-column>

        <el-table-column width="90px" label="颜色">
          <template #default="{ row, $index }">
            <div v-if="$index != currentItemIndex && !row.color">随机</div>
            <el-color-picker
              v-if="$index == currentItemIndex"
              @change="(val) => updateObject(val, 'color', row)"
              v-model="row.color"
              :predefine="predefineColors"
            />
          </template>
        </el-table-column>

        <el-table-column width="120px" label="字体">
          <template #default="{ row, $index }">
            <span
              v-if="$index != currentItemIndex"
              @click="showFontPanel(row.text)"
              >{{ row.fontFamily }}</span
            >
            <span
              v-else
              style="
                display: block;
                width: 100%;
                height: 100%;
                text-align: center;
              "
              @click="showFontPanel(row.text)"
              >请选择字体</span
            >
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
    <el-dialog v-model="showPanel" :title="`请选择 ${chosenWord} 的字体`">
      <div v-for="group in fontGroup" :key="group.label">
        {{ group.label }}
        <ul style="list-style-type: none">
          <li v-for="item in group.options" :key="item.name">
            <div
              style="
                width: 100%;
                height: 40px;
                border-bottom: 1px solid #f5f5f5;
                line-height: 40px;
              "
            >
              {{ item.name }}
            </div>
            <img
              :src="`${publicPath}files/${group.label}/${item.name}/${item.preview}`"
            />
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { markRaw } from 'vue-demi'
import { emitter } from './event'
import { getUuiD } from '../../assets/utils'
import chinese from '/public/files/chinese/index.json'
import english from '/public/files/english/index.json'
import others from '/public/files/others/index.json'

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
      publicPath: process.env.BASE_URL,
      fontList: [],
      chosenWord: '',
      currentItemIndex: NaN,
      Delete: DeleteIcon,
      list: [
        {
          text: '螺蛳粉',
          size: 40,
          color: '',
          idKey: getUuiD(),
          isrepeat: false,
        },
        {
          text: '重庆小面',
          size: 35,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '肉夹馍',
          size: 35,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '炸酱面',
          size: 32,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '沙县小吃',
          size: 25,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '烤冷面',
          size: 23,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '臭豆腐',
          size: 23,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '钵钵鸡',
          size: 20,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        {
          text: '酸辣粉',
          size: 19,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
        { text: '冒菜', size: 15, color: '', idKey: getUuiD(), isrepeat: true },
        {
          text: '驴打滚',
          size: 12,
          color: '',
          idKey: getUuiD(),
          isrepeat: true,
        },
      ],
      predefineColors,
      dynamicValidateForm: {
        search: '',
        new: '',
        list: [],
      },
      listLoading: false,
      showPanel: false,
    }
  },
  created() {
    // this.getList()
    this.dynamicValidateForm.list = this.list
    this.addEventListren()
    this.getFontList()
  },
  mounted() {
    this.emitterRender()
  },
  methods: {
    changeCurrent(current) {
      const index = this.dynamicValidateForm.list.findIndex(
        (item) => current == item
      )
      this.currentItemIndex = index
    },
    getList() {
      return new Array(20).fill(1).map((v, i) => ({
        text: `驴打滚${i}`,
        size: 12,
        color: '',
        idKey: getUuiD(),
      }))
    },
    updateObject(val, type, item) {
      emitter.emit('updateObject', {
        item,
        type,
      })
    },
    addEventListren() {
      emitter.on('render', this.emitterRender)
    },
    emitterRender() {
      emitter.emit('renderStart', this.list)
    },
    addItem() {
      if (this.dynamicValidateForm.new) {
        this.dynamicValidateForm.list.push({
          idkey: getUuiD(),
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
    getFontList() {
      const chs_font = JSON.parse(JSON.stringify(chinese))
      const eng_font = JSON.parse(JSON.stringify(english))
      const otr_font = JSON.parse(JSON.stringify(others))
      this.fontGroup = [
        { label: 'chinese', options: [...chs_font] },
        { label: 'english', options: [...eng_font] },
        { label: 'others', options: [...otr_font] },
      ]
      console.log('fontLists', this.fontGroup)
    },
    showFontPanel(word) {
      console.log('1111')
      this.showPanel = true
      this.chosenWord = word
    },
    // async getList() {
    //   this.listLoading = true
    //   this.listLoading = false
    // },
  },
}
</script>

<style scoped></style>
