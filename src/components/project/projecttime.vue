<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="开始时间">
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="请选择开始时间"
            v-model="form.date1"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-col :span="12">
          <el-date-picker
            type="date"
            placeholder="请选择结束时间"
            v-model="form.date1"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
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
        createTime: "",
        endTime: ""
      },
      rules: {
        createTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "blur" }
        ]
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
