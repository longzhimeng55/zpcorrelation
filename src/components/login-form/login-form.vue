<style>
p.titlenew{
  position: fixed;
  top:40px;
}
p.titlenew span{
  font-family: ArialMT;
  font-size: 26px;
  color: #333333;
  line-height: 50px;
  vertical-align: middle;
}
p.titlenew span.titleimg{
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  background: url("../../assets/images/login/title.png") no-repeat;
  background-size: 100% 100%;
  margin-right: 5px;
}
.el-form-item__label {
  color: inherit;
}
.el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-right: 4px;
}
.el-input__inner {
  background: none;
  outline: none;
  border: none;
  border: 1px solid #DCDFE6; 
}
.br-ruleForm .el-form-item{
  background: #F7F9FE;
  border-radius: 33px;
}
.br-ruleForm .el-form-item:last-child{
  background: none;
}
.br-ruleForm .el-form-item__label{
  color:#F7F9FE;
  width:inherit!important;
  margin-left: 30px;
  padding: 0px;
  line-height: 38px;
}
.br-ruleForm .el-form-item:first-child .el-form-item__label::before{
  display: inline-block;
  vertical-align: middle;
  width: 17px;
  height: 17px;
  background: url("../../assets/images/login/user.png") no-repeat;
  background-size: 100% 100%;
}
.br-ruleForm .el-form-item:first-child+.el-form-item .el-form-item__label::before{
  display: inline-block;
  width: 17px;
  height: 17px;
  vertical-align: middle;
  background: url("../../assets/images/login/password.png") no-repeat;
  background-size: 100% 100%;
}
.br-ruleForm .el-form-item .el-form-item__content{
  margin-left: 54px!important;
}
.br-ruleForm .el-form-item:last-child .el-form-item__content{
  margin-left: 0px!important;  
}
.br-ruleForm .el-form-item .el-form-item__content .el-input__inner{
  border: none;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #666666;
  padding-left: 0px;
}
/* 重写登录按钮样式 */
.br-ruleForm .el-button--primary{
  padding: 10px 40px;
  border: none;
  background-image: linear-gradient(90deg, #635BFF 14%, #7B7DE5 86%);
  box-shadow: 0 2px 4px 2px rgba(123,125,229,0.32);
  border-radius: 40px;
}
.br-ruleForm .el-button--primary:focus, .el-button--primary:hover {
    background: none;
    border: none;
    color: #FFF;
    background-image: linear-gradient(90deg, #635BFF 14%, #7B7DE5 86%);
    box-shadow: 0 2px 4px 2px rgba(123,125,229,0.32);
}
.forgetpass{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #999999;
  float: right;
  margin-right: 5px;
}
</style>

<template>
<div>
  <p class="titlenew">
    <span class="titleimg"></span>
    <span>Rock Your Team</span>
  </p>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm br-ruleForm"
  >
    <el-form-item label=" " prop="username">
      <el-input
        type="text"
        placeholder="请输入用户名/邮箱/手机号"
        v-model="ruleForm.username"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label=" " prop="password">
      <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">登录1</el-button>
      <span class="forgetpass">忘记密码？</span>
      <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "18513418356",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { min: 3, max: 50, message: "账号长度3-50个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 4,
            max: 16,
            message: "密码长度6-16个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            loginId: this.ruleForm.username,
            password: this.ruleForm.password
          });
        } else {
          this.$message({
            message: "表单校验失败!!",
            type: "warning",
            center: true
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
