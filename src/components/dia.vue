<template>
  <el-dialog
    :modal="true"
    :modal-append-to-body="true"
    :title="tittle"
    :visible.sync="isShow"
    :width="width"
    :height="height"
    :close-on-click-modal="false"
    :show-close="true"
    :close-on-press-escape="true"
    center>
    <slot></slot>
<!--<div class="divauto">
  <el-button type="success" size="mini" @click="showDio" round>Table</el-button>
  <el-button type="success" size="mini" @click="showDio" round>Table</el-button>
</div>-->
  </el-dialog>
</template>
<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      switchStyle: {
        type: Boolean,
        default: true
      },
      tittle: {
        type: String,
        default: '标题'
      },
      width: {
        type: String,
        default: "35%"
      },
      height: {
        type: String,
        default: "1000px"
      },
    },
    data(){
      return {
      }
    },
    methods: {
    },
    components: {
    }
 
  }
</script>
<style scoped>
  .divauto{
    margin:  10px auto 0 auto;
  }
</style>