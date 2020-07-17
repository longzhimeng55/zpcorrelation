<style>
@import "./login.css";
</style>

<template>
<!-- <div class="indextitle">
  <p><span></span><span>Rock Your Team</span></p>
</div> -->
  <div class="login">
    <div class="login-con1"></div>
    <div class="login-con">
      <p>欢迎登录</p>
      <p>WELCOME TO ROCK YOUR TEAE</p>
      <div icon="log-in">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/login-form";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  components: {
    LoginForm
  },
  computed: {},
  methods: {
    ...mapActions("user", [
      //Login是指modules文件夹下的Login.js
      "handleLogin", //Login.js文件中的actions里的方法，在上面的@click中执行并传入实参
      "userImage"
    ]),
    handleSubmit({ loginId, password }) {
      // let params = { loginId: "18513418356", password: "123456" };
      this.$http.login
        .login({ loginId, password })
        .then(
          res => {
            if (res.data.ret == "0") {
              localStorage.setItem("team_username", res.data.content.name);
              this.handleLogin(res.data.content);
              this.userImage(res.data.content);
              this.$router.push("/project");
              // this.$message({
              //   message: "登录成功",
              //   type: "success"
              // });
              // this.$Message.success("登录成功");
            } else {
              this.$Message.error(res.data.msg);
            }
          },
          error => {
            this.$Message.error("请求错误");
          }
        )
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
