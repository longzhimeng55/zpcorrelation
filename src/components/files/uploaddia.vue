<template>
  <div class="mydialog">
    <el-dialog
      title="上传"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="reporthandleCloseBindWarnStandard"
      :width="reportwidth"
    >
      <div class="dialogoutline" id="pdfDom">
        <div> 
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reporthandleCancel('reportdialogForm')"
          >取消</el-button
        >
        <el-button type="primary" @click="reportsubmitForm('reportdialogForm')"
          >确定上传</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/libs/date.js";
import Lineecharts from "@/components/echarts/lineecharts.vue";
export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  props: {
    dialogVisible: {
      type: Boolean
    },
    reporttitle: {
      type: String
    },
    reportwidth: {
      type: String
    },
    reportdialogForm: {
      type: Object
    }
  },
  data() {
    return {
      //项目燃尽图
      tempburnout: [],
      eventsproject: {
        width: "100%",
        height: "250px"
      },
    };
  },
  created() {
    this.echarts();
    console.log(this.reportdialogForm);
  },
  computed() {
    // this.echarts();
  },
  components: {
    Lineecharts
  },
  watch: {
    reportdialogForm(newValue, oldValue) {
      if (newValue) {
        this.reportdialogForm = newValue;
        this.echarts();
        console.log(111);
      }
    }
  },
  methods: {
    echarts() {
    },
    //提交
    reportsubmitForm(formName) {
      this.$emit("reportsubmitForm", this.reportdialogForm);
    },
    //关闭弹窗
    reporthandleCancel(formName) {
      this.$emit("reportgetCancel");
    },
    //重置表单元素
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //关闭弹窗，不可以删这个方法。不用这个方法点击遮罩层关闭会报错
    reporthandleCloseBindWarnStandard() {
      this.$emit("reportcloseBindWarnStandard");
    }
  }
};
</script>
<style scoped>
.mydialog /deep/ .el-dialog__header {
  padding: 12px 20px 10px 10px;
  height: 24px;
}
.mydialog /deep/ .el-dialog__title {
  color: #878ea1;
  font-size: 15px;
  line-height: 24px;
}
.mydialog /deep/ .el-dialog__headerbtn {
  top: 14px;
}
.mydialog /deep/ .el-dialog .el-dialog__body {
  padding: 15px 20px;
}
.mydialog /deep/ .dialog-footer {
  text-align: center;
}
.mydialog /deep/ .el-dialog .el-dialog__footer .dialog-footer .el-button {
  font-size: 14px;
  color: #878ea1;
  padding: 10px 20px;
}
.mydialog /deep/ .el-button:focus,
.mydialog /deep/ .el-button:hover {
  color: #409eff;
  border-color: inherit;
  background-color: inherit;
  border: 1px solid #e5e9f6;
}
.mydialog
  /deep/
  .el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button:first-child
  + .el-button {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
}
.mydialog
  /deep/
  .el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button--primary {
  background: #7b7de5;
  border: 1px solid #e5e9f6;
}
.mydialog /deep/ .el-dialog .el-dialog__footer {
  border: 1px solid #e5e9f6;
  padding: 16px 20px 16px;
}
.mydialog /deep/ .el-input__inner {
  height: 30px;
}
/*项目报告*/
.dialoginline {
}
.dialogoutline > div {
  margin-bottom: 15px;
  padding-top: 5px;
}
.dialogoutline > div /deep/ .el-table--fit {
  border: 1px solid #e5e9f6;
}
.dialogoutline > div /deep/ th.is-leaf {
  background: #f6f6f6;
}
.dialogoutline > div /deep/ th.is-leaf .cell {
  color: #3b404f;
  font-weight: initial !important;
}
.dialogoutline > div /deep/ .el-table td,
.dialogoutline > div /deep/ .el-table th {
  padding: 10px 0px;
}
.dialogoutline > div /deep/ .el-table .cell span {
  color: #878ea1;
  vertical-align: middle;
}
.dialogoutline > div /deep/ .el-table .cell span.level {
  display: inline-block;
  width: 4px;
  height: 14px;
  margin-right: 5px;
  vertical-align: middle;
}
.dialogoutline > div /deep/ .el-table .cell span.level.level0 {
  background: #64dbb7;
}
.dialogoutline > div /deep/ .el-table .cell span.level.level1 {
  background: #7b7de5;
}
.dialogoutline > div /deep/ .el-table .cell span.level.level2 {
  background: #ffae38;
}
.dialogoutline > div /deep/ .el-table .cell span.level3 {
  background: #fb5f5a;
}
.dialogoutline > div /deep/ .el-table thead {
  color: #3b404f;
  font-weight: initial !important;
}
.dialogoutline p.title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 20px;
  color: #3b404f;
  margin-bottom: 10px;
}
/*打印页面时的样式*/
@media print {
  @page {
    /*size: landscape; 对打印的尺寸进行设置*/
    size: Ledger; /*对打印的尺寸进行设置*/
    /*margin: 0; 去掉上面的水印*/
  }
  .dialogoutline p.title {
    margin-left: 10px;
  }
  /* ...在打印时需要保留的样式... */
}
</style>
