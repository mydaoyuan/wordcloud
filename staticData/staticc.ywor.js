// 静态资源前缀地址
const previewUrl = 'https://staticc.ywordle.com/static/'

//1、 把preview 和 file 都下载下来，按照中文、英文、其它文件夹区分开来。
// 2、下载文件的时候把文件名再随机一下，同时再提取出一份对应的JSON。当做静态数据渲染。
// 比如
//  {
//   key: '1.4.56.3451',
//   name: '仓耳非白W05',
//   json_data: '',
//   preview: '2020-10-29/5d40a0f6991147a3d8264a7d02ab2bb0_preview.png',
//   file: '2020-10-29/5d40a0f6991147a3d8264a7d02ab2bb0.ttf',
//   size: 1663544,
//   width: 0,
//   height: 0,
// }

// 修改后
//  {
//   key: '1.4.56.3451',
//   name: '仓耳非白W05',
//   json_data: '',
//   preview: 'xxxx.png',
//   file: 'xxxx.ttf',
//   size: 1663544,
//   width: 0,
//   height: 0,
// }
