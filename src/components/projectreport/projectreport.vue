<template>
  <div class="mydialog">
    <el-dialog
      :title="reporttitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="reporthandleCloseBindWarnStandard"
      :width="reportwidth"
    >
      <div class="dialogoutline" id="pdfDom" ref="print">
        <div>
          <p class="title">任务</p>
          <el-table
            :data="reportdialogForm.task"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="name" label="任务名称" width="157">
              <template slot-scope="scope">
                <span v-if="scope.row.level == 1" class="level level1"></span>
                <span v-if="scope.row.level == 2" class="level level2"></span>
                <span v-if="scope.row.level == 3" class="level level3"></span>
                <span v-if="scope.row.level == 0" class="level level0"></span>
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{
                  scope.row.createTime| formatDate
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="完成时间" width="150">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{
                  scope.row.endTime| formatDate
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isMilestone" label="里程碑" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.isMilestone == 1">{{ "是" }}</span>
                <span v-if="scope.row.isMilestone == 0">{{ "否" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="优先级" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="executorName" label="责任人" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.executorName == null">{{
                  "暂无责任人"
                }}</span>
                <span else>{{ scope.row.executorName }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <p class="title">燃尽图</p>
          <div class="echarts-content">
            <lineecharts
              v-if="tempburnout != ''"
              v-bind:parentToChild="eventsproject"
              v-bind:piechartData="tempburnout"
            ></lineecharts>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="results"
          @click="reporthandleCancel('reportdialogForm')"
          >打印</el-button
        >
        <el-button type="primary" @click="reportsubmitForm('reportdialogForm')"
          >导出为PDF</el-button
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
      tableData: [
        {
          date: "测试样件为了",
          name: "2019-11-18 11:12:23",
          c: "2019-11-18 11:12:23",
          pro: "46%",
          a: "高",
          b: "责任人"
        }
      ]
    };
  },
  created() {
    // this.echarts();
    this.htmlTitle = this.reporttitle;
    console.log(this.reportdialogForm);
  },
  computed() {
    this.echarts();
  },
  components: {
    Lineecharts
  },
  watch: {
    reportdialogForm(newValue, oldValue) {
      if (newValue) {
        this.reportdialogForm = newValue;
        this.echarts();
      }
    }
  },
  methods: {
    echarts() {
      let tempburnout = this.reportdialogForm.chart;
      this.tempburnout = tempburnout;
      // if (tempburnout.length!= -1) {
      //   this.tempburnout = tempburnout;
      // } else {
      //   this.tempburnout = ["0"];
      //   // this.temppersonlegend = ["0"];
      // }
    },
    //打印页面上的内容
    //点击打印按钮
    // print() {
    //   let print = document.getElementById("pdfDom"); //获取目标区域的HTML结构
    //   // document.body.innerHTML = print.innerHTML; //替换网页的html内容
    //   document.body = print; //替换网页的html内容
    //   window.print(); //  调用打印功能
    //   window.location.reload(); //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
    // },
    //提交
    reportsubmitForm(formName) {
      // console.log(this.reporttitle);
      this.getPdf(this.reporttitle);
      this.$emit("reportsubmitForm", this.reportdialogForm);
    },
    //关闭弹窗
    reporthandleCancel(formName) {
      // this.print();
      this.$print(this.$refs.print);
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
    font-size: 16px;
  }
  body,
  html {
    font-size: 18px;
  }
  .dialogoutline p.title {
    margin-left: 10px;
  }
  .dialogoutline > div  .el-table--fit {
    border: 1px solid #e5e9f6;
  }
  .dialogoutline > div  th.is-leaf {
    background: #f6f6f6;
  }
  #pdfDom  .el-table__row {
    width: 100%;
  }
  .dialogoutline > div .el-table .cell span.level.level1 {
    background: #7b7de5;
  }
  /* ...在打印时需要保留的样式... */
}
</style>
