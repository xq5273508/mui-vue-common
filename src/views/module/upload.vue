<template>
    <div>
        <div v-if="file">
            <img style="max-width: 100vw;max-height: 100vh" :src="url+file"/>
        </div>

        <div>
            <button v-show="!file" @click="upload" class="button-upload mui-icon mui-icon-upload">选择文件上传</button>
            <button v-show="file" @click="download" class="button-upload mui-icon mui-icon-download">点击下载文件</button>
        </div>
    </div>
</template>

<script>
  import {ImageService} from "../../service/Image";
  import {FileService} from "../../service/File";
  import {ToastService} from "../../service/Toast";
  import {ApiService} from "../../service/Api";

  export default {
    name: "file",
    data() {
      return {
        file: null,
        url: ApiService.Api50 + "/api/v1/File/DownLoadPic?filePath="
      };
    },
    methods: {
      upload() {
        ImageService.pick().then(_image => {
          FileService.upload(_image).then(data => {
            this.file = data[0].FilePath;
            ToastService.message("上传成功");
          });
        });
      },
      download() {
        const url = ApiService.Api50 + "/api/v1/File/DownLoadPic?filePath=" + this.file;
        FileService.down(url).then(_path => {
          ToastService.message("文件下载成功");
        });
      }
    }
  }
</script>

<style scoped>
    .button-upload {
        position: absolute;
        width: 80vw;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #057bf9;
        color: #ffffff;
        font-size: 16px;
        text-align: center;
    }

    .button-upload:before {
        font-size: 20px;
    }

</style>