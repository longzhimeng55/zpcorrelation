<template>
  <div class="mydialog">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleCloseBindWarnStandard"
      :width="width"
    >
    <el-form ref="form" :model="dialogForm" label-width="80px">
      <el-form-item label="重命名" prop="name">
        <el-input v-model="dialogForm.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('dialogForm')">取消</el-button>
        <el-button type="primary" @click="save('dialogForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "confirmDialog",
  props: {
    dialogForm: {
      type: Object,
    }
  },
  data() {
    return {
      dialogForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
      },
      showDialog: this.isShowDialog
    };
  },
  created() {
    console.log(this.isShowDialog);
  },
  methods: {
    childOperation(value) {
      this.$emit("child-operation", value);
    }
  },
  watch: {
    isShowDialog(val) {
      this.showDialog = val; //②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
    },
    showDialog(val) {
      this.$emit("on-result-change", val); //③组件内对myResult变更后向外部发送事件通知
    }
  }
};
</script>

<style scoped></style>
