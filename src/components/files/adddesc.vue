<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" >
      <el-form-item label="添加描述" prop="desc">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取消</el-button>
        <el-button type="primary" @click="save('form')">确定</el-button>
      </div>
  </div>
</template>
<script>
export default {
  name: "confirmDialog",
  props: {
    form: {
      type: Object,
    }
  },
  data() {
    return {
      form: {
        desc: "",
      },
      rules: {
        desc: [
          { required: true, message: "请输入说明描述", trigger: "blur" }
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
