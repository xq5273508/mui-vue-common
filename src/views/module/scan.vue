<template>
    <div>
        <div class="scan-result">
            <div class="result-title">
                扫码结果
            </div>
            <form class="mui-input-group">
                <div class="mui-input-row">
                    <label>码类型</label>
                    <input type="text" v-model="code.type" readonly="readonly" placeholder="">
                </div>
                <div class="mui-input-row">
                    <label>码值</label>
                    <input type="text" v-model="code.value" readonly="readonly" placeholder="">
                </div>
            </form>
        </div>
        <div>
            <button @click="scan" type="button" class="mui-btn mui-btn-primary button-scan">
                扫码
            </button>
        </div>
    </div>
</template>

<script>
  import {ScanService} from "../../service/Scan";

  export default {
    name: "app-scan",
    data() {
      return {code: {}};
    },
    methods: {
      scan() {
        ScanService.scan().then(_code => {
          this.$set(this, "code", _code);
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

    .button-scan {
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
