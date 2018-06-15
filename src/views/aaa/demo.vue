<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon iconfont icon-zuo mui-pull-left"></a>
            <h1 class="mui-title">音频</h1>
        </header>
        <div class="mui-content">
            aaa/demo页面

            <app-demo></app-demo>
        </div>
    </div>
</template>

<script>
  import demo from "../../component/Demo";

  export default {
    name: "demo",
    components: {
      "app-demo": demo
    }
  }
</script>

<style scoped>

</style>