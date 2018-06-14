<template>
    <div>
        <div v-if="coordinate" class="scan-result">
            <div class="result-title">
                坐标信息
            </div>
            <form class="mui-input-group">
                <div class="mui-input-row">
                    <label>坐标类型</label>
                    <input type="text" v-model="coordinate.coordsType" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <label>经度</label>
                    <input type="text" v-model="coordinate.coords.longitude" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <label>纬度</label>
                    <input type="text" v-model="coordinate.coords.latitude" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <label>精度</label>
                    <input type="text" v-model="coordinate.coords.accuracy" readonly="readonly">
                </div>
            </form>
            <div class="result-title">
                地址信息
            </div>
            <form class="mui-input-group">
                <div class="mui-input-row">
                    <label>国家</label>
                    <input type="text" v-model="coordinate.address.country" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <label>省份</label>
                    <input type="text" v-model="coordinate.address.province" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <label>城市</label>
                    <input type="text" v-model="coordinate.address.city" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <label>区</label>
                    <input type="text" v-model="coordinate.address.district" readonly="readonly">
                </div>
                <div class="mui-input-row">
                    <input type="text" v-model="coordinate.addresses" readonly="readonly">
                </div>
            </form>
        </div>
        <div>
            <div @click="location" class="button-location iconfont icon-position"></div>
        </div>
    </div>
</template>

<script>
  import {LocationService} from "../../service/Location";

  export default {
    name: "app-test",
    data() {
      return {
        coordinate: null
      };
    },
    mounted() {
    },
    methods: {
      location() {
        this.coordinate = null;
        LocationService.get().then(_coord => {
          this.coordinate = _coord;
        })
      }
    }
  }
</script>

<style scoped>
    .result-title {
        margin: 10px 12px 5px;
        font-size: 15px;
        font-weight: 400;
        color: #8f8f94;
    }

    label {
        font-size: 14px;
        font-weight: 400;
        color: #8f8f94;
    }

    input {
        font-size: 14px;
        font-weight: 400;
        color: #8f8f94;
    }
    .button-location {
        width: 80px;
        height: 80px;
        line-height: 80px;
        border-radius: 50px;
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #057bf9;
        color: #ffffff;
        font-size: 30px;
        text-align: center;
    }

</style>