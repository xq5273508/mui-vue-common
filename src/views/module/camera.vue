<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon iconfont icon-zuo mui-pull-left"></a>
            <h1 class="mui-title">图片</h1>
        </header>
        <div class="mui-content">
            <div v-if="image.name" class="image-preview">
                <div>点击预览大图</div>
                <img @click="preview" :src="image.mini">
            </div>
            <div>
                <button @click="camera" type="button" class="mui-btn mui-btn-primary button-camera">
                    图片
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  import {ImageService} from "../../service/Image";
  import {AuthService} from "../../service/Auth";

  export default {
    name: "app-camera",
    data() {
      return {image: {}};
    },
    mounted() {
      const user = AuthService.user();
      alert(JSON.stringify(user));
    },
    methods: {
      camera() {
        ImageService.choose().then(_image => {
          this.image = _image;
        })
      },
      preview() {
        ImageService.preview([this.image.path]);
      }
    }
  }
</script>

<style scoped>

    /*.image-preview {*/
    /*position: absolute;*/
    /*width: 200px;*/
    /*top: 50px;*/
    /*left: 50%;*/
    /*transform: translateX(-50%);*/
    /*}*/

    .image-preview > div {
        margin: 10px 12px 5px;
        font-size: 15px;
        font-weight: 400;
        color: #8f8f94;
    }

    .image-preview > img {
        width: 100%;
    }

    .button-camera {
        width: 100px;
        height: 100px;
        border-radius: 50px;
        font-size: 20px;
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
