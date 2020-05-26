<template>
  <div class="mydialog">
    <el-dialog
      :title="reporttitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="reporthandleCloseBindWarnStandard"
      :width="reportwidth"
    >
      <div class="numberimg">
        <img :src="this.$store.state.user.userImage" alt v-if="this.$store.state.user.userImage!=''"/>
        <img src="../../assets/images/photo.png" alt v-else/>
      </div>
      <div class="dialogoutline" id="pdfDom">
        <div>
          <p class="title">
            <span>任务</span>
            <span
              ><el-progress :percentage="countprojectprogress"></el-progress
            ></span>
            <span>进度:{{ this.countprojectprogress }}%</span>
          </p>
        </div>
        <div>
          <p class="title">任务状态</p>
          <div class="taskstatus">
            <span
              :title="item.title"
              :style="item.styleObj"
              v-for="item in taskstatus"
              :key="item.index"
              >{{ item.account }}</span
            >
          </div>
        </div>
        <div>
          <p class="title">进行中任务</p>
          <p v-for="item1 in reportdialogForm.runTask" :key="item1.index">
            {{ item1.name }}
          </p>
        </div>
        <div>
          <p class="title">已完成任务</p>
          <p v-for="item in reportdialogForm.finTask" :key="item.index">
            {{ item.name }}
          </p>
        </div>
        <div>
          <p class="title">延期任务</p>
          <p v-for="item in reportdialogForm.laterTask" :key="item.index">
            {{ item.name }}
          </p>
        </div>
        <div>
          <p class="title">里程碑</p>
          <p class="title">已达到里程碑</p>
          <p v-for="item in reportdialogForm.finMs" :key="item.index">
            {{ item.name }}
          </p>
          <p class="title">即将达到里程碑</p>
          <p v-for="item in reportdialogForm.upcomMs" :key="item.index">
            {{ item.name }}
          </p>
          <p class="title">已过期里程碑</p>
          <p v-for="item in reportdialogForm.laterMs" :key="item.index">
            {{ item.name }}
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reporthandleCancel('reportdialogForm')"
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
export default {
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
      //任务进度
      countprojectprogress: "",
      //任务状态
      taskstatus: [],
      tableData: []
    };
  },
  created() {
    this.countProjectProgress();
    console.log(this.reportdialogForm);
  },
  watch: {
    reportdialogForm(newValue, oldValue) {
      if (newValue) {
        this.reportdialogForm = newValue;
        this.countProjectProgress();
        console.log(111);
      }
    }
  },
  computed() {
    // this.countProjectProgress();
  },
  components: {
    // Lineecharts
  },
  methods: {
    //计算任务的进度
    countProjectProgress() {
      this.taskstatus = [];
      let temp = [];
      temp["later"] = this.reportdialogForm.later;
      temp["today"] = this.reportdialogForm.today;
      temp["run"] = this.reportdialogForm.run;
      temp["upcom"] = this.reportdialogForm.upcom;
      // if (temp.length != 0) {
      for (var key in temp) {
        let tempobj = {};
        if (key == "upcom") {
          let tempobjnew = {};
          tempobjnew.background = "#58A1FF";
          tempobj.title = "即将开始";
          tempobj.account = temp[key]+' 未开始';
          tempobj.styleObj = tempobjnew;
        } else if (key == "today") {
          let tempobjnew = {};
          tempobjnew.background = "#FFAE38";
          tempobj.title = "今天";
          tempobj.account = temp[key]+' 今天';
          tempobj.styleObj = tempobjnew;
        } else if (key == "run") {
          let tempobjnew = {};
          tempobjnew.background = "#64DBB7";
          tempobj.title = "开始";
          tempobj.account = temp[key]+' 已开始';
          tempobj.styleObj = tempobjnew;
        } else if (key == "later") {
          let tempobjnew = {};
          tempobjnew.background = "#FB5F5A";
          tempobj.title = "延期";
          tempobj.account = temp[key]+' 已延期';
          tempobj.styleObj = tempobjnew;
        }
        this.taskstatus.push(tempobj);
        console.log(this.taskstatus);
        // }
      }
      let temcountprojectprogress =
        (this.reportdialogForm.finish / this.reportdialogForm.total).toFixed(
          2
        ) * 100;
        console.log(temcountprojectprogress);
      if (isNaN(temcountprojectprogress)) {
        this.countprojectprogress = "100";
      }else if(temcountprojectprogress=="Infinity") {
        this.countprojectprogress = "100";
      }else {
        this.countprojectprogress = temcountprojectprogress;
      }
    },
    //打印页面上的内容
    //点击打印按钮
    print() {
      let print = document.getElementById("pdfDom"); //获取目标区域的HTML结构
      document.body.innerHTML = print.innerHTML; //替换网页的html内容
      window.print(); //  调用打印功能
      window.location.reload(); //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
    },
    //提交
    reportsubmitForm(formName) {
      this.getPdf();
      this.$emit("reportsubmitForm", this.reportdialogForm);
      this.taskstatus = [];
    },
    //关闭弹窗
    reporthandleCancel(formName) {
      this.print();
      this.$emit("reportgetCancel");
      this.taskstatus = [];
    },
    //重置表单元素
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //关闭弹窗，不可以删这个方法。不用这个方法点击遮罩层关闭会报错
    reporthandleCloseBindWarnStandard() {
      this.taskstatus = [];
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
  margin-left: 55px;
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
  margin-bottom: 5px;
  padding-top: 5px;
}
/*弹框中的表格*/
.dialogoutline > div /deep/ .el-table--fit {
  border: 1px solid #e5e9f6;
}
.dialogoutline > div /deep/ th.is-leaf {
  background: #ccc;
}
.dialogoutline > div p span {
  display: inline-block;
}
.dialogoutline > div p span:first-child {
  font-family: PingFangSC-Medium;
  margin-right: 20px;
  font-size: 16px;
  color: #3b404f;
}
.dialogoutline > div p span:first-child + span {
  width: 500px;
}
.dialogoutline > div p span:first-child + span /deep/ .el-progress-bar__outer {
  height: 10px !important;
}
.dialogoutline > div p span:first-child + span /deep/ .el-progress__text {
  display: none;
}
.dialogoutline
  > div
  p
  span:first-child
  + span
  /deep/
  .el-progress-bar__inner::after {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #ffffff;
  margin-top: -9px;
  margin-right: 1px;
}
.dialogoutline p {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #878ea1;
  line-height: 24px;
}
.dialogoutline p.title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 22px;
  color: #3b404f;
  /* font-weight: 600; */
  margin-bottom: 10px;
  margin-top: 10px;
}
.dialogoutline p:first-child.title span {
  font-weight: initial;
}
/*任务状态*/
.numberimg {
  position: absolute;
  top: 6px;
  left: 20px;
  height: 35px;
  width: 35px;
  background: red;
  border-radius: 50%;
}
.numberimg img{
  display: inline-block;
  height: 35px;
  width: 35px;
  border-radius: 50%;
}
.taskstatus {
  padding-top: 5px;
}
.taskstatus span {
  display: inline-block;
  border-radius: 2px;
  width: 100px;
  height: 27px;
  margin-right: 5px;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  line-height: 27px;
  color: #ffffff;
  background: #64dbb7;
}
.mydialog /deep/ .el-dialog__header{
  padding: 16px 20px 14px 10px!important;
}
.mydialog /deep/ .el-dialog__headerbtn{
  top: 25px!important;
}
.numberimg{
  top: 11px!important;
}
/*项目成员图标*/
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
