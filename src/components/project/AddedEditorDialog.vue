<template>
  <div class="mydialog">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleCloseBindWarnStandard"
      :width="width"
    >
      <el-form
        label-width="80px"
        :model="dialogForm"
        ref="dialogForm"
        :rules="dialogFormdatarules"
      >
        <el-form-item label="开始时间" prop="startTime">
          <el-col :span="22">
            <el-date-picker
              size="mini"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="timestamp"
              align="center"
              placeholder="请选择开始时间"
              :picker-options="pickerBeginDateBefore"
              v-model="dialogForm.startTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-col :span="22">
            <el-date-picker
              size="mini"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="timestamp"
              align="center"
              placeholder="请选择结束时间"
              :picker-options="pickerOptionsEnd"
              v-model="dialogForm.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('dialogForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')"
          >确 定</el-button
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
    title: {
      type: String
    },
    width: {
      type: String
    },
    dialogForm: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormdatarules: {
        startTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "blur" }
        ]
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.dialogForm.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.dialogForm.startTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
    };
  },
  created() {
    console.log(this.dialogForm);
  },
  computed: {},
  methods: {
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         this.$emit("submitForm", this.dialogForm);
         this.resetForm(formName);
        } else {
          return false;
        }
      });
      //console.log(this.handleType)
    },
    //关闭弹窗
    handleCancel(formName) {
      this.$refs[formName].validate(valid => {
        this.$emit("getCancel");
        this.resetForm(formName);
      });
    },
    //重置表单元素
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //关闭弹窗，不可以删这个方法。不用这个方法点击遮罩层关闭会报错
    handleCloseBindWarnStandard() {
      this.$refs["dialogForm"].resetFields();
      this.$emit("closeBindWarnStandard");
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
.mydialog /deep/ .el-input__inner{
    height: 30px;
}
</style>
