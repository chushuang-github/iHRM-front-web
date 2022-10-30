<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :class="{ disabled: fileComputed }"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percent" style="width: 180px;" />
    <el-dialog title="图片预览" :visible.sync="dialogVisible" top="10vh" width="520px">
      <img width="100%" :src="dialogImageUrl" alt="" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDd5HDsHQJuEI5SZeR2PXP2XqtgFYbOwEF',
  SecretKey: 'mIXVCdnhLktnRpytYx72g4C5i5C4g28z',
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      currentFileUid: null,
      showProgress: false,
      percent: 0
    };
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 删除
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传之前
    handleBeforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      return true
    },
    // 上传 (使用腾讯云cos文件上传)
    handleUpload(params) {
      let file = params.file
      if(file) {
        this.showProgress = true
        cos.putObject({
          Bucket: 'ihrm-1308851220', // 填入您自己的存储桶，必须字段
          Region: 'ap-nanjing',  // 存储桶所在地域，例如ap-beijing，必须字段
          Key: file.name,  // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
          Body: file, // 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象
          StorageClass: 'STANDARD', // 设置对象的存储类型(默认标准模式)
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          if(!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, status: 'success', upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showProgress = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__header {
  padding: 8px 10px;
}
::v-deep .el-dialog__body {
  padding: 20px 20px 10px;
}
::v-deep .disabled .el-upload--picture-card {
  display: none;
}
</style>
