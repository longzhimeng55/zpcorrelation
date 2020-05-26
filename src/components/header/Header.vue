<template>
  <div id="header">
    <div class="logo-name" @click="goindex">
      <img src="../../assets/images/login/leftlogo.png" />
      <!-- RockYourTeam -->
    </div>
    <div class="head-list">
      <ul>
        <li
          v-for="item in titleList"
          :key="item.title"
          @click="routeChange(item.path)"
          :class="{ actived: item.active }"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div class="search-erery">
      <el-input
        placeholder="搜索一切"
        class="input-with-select"
        v-model="searchall"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="usermessage">
      <div>
        <el-select
          @change="selectGet"
          v-model="value"
          clearable
          placeholder="请选择"
          class="header-select"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <span>{{this.companyname}}</span> -->
        <el-dropdown trigger="click" class="usermsg">
          <span class="el-dropdown-link" style="margin-right:0px">
            <i class="el-icon-message-solid"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="usermsgcontent">
            <p class="msgtitle">消息</p>
            <el-dropdown-item v-for="(item,index) in usermsgnew" v-if="usermsgnew.length!=0" :key="index" @click.native="lookallmsg">{{item.content}}</el-dropdown-item>
            <p style="text-align:center;line-height:100px">{{"暂无消息"}}</p>
            <p class="allmsg" v-if="usermsgnew.length!=0&&usermsgnew.length>=5" @click="lookallmsg">查看全部消息</p>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="bor-line"></span>
        <div style="float:right;cursor: pointer;">
          <el-dropdown trigger="click">
            <img
              class="user-photo"
              :src="this.$store.state.user.userImage"
              alt
              v-if="this.$store.state.user.userImage != ''"
            />
            <img
              class="user-photo"
              src="../../assets/images/photo.png"
              alt
              v-else
            />
            <span style="color: #fff;">{{
              this.$store.state.user.userName
            }}</span>
            <el-dropdown-menu
              slot="dropdown"
              placement="bottom-end"
              class="countdropdown"
            >
              <el-dropdown-item @click.native="accountsetting"
                >账号设置</el-dropdown-item
              >
              <el-dropdown-item @click.native="loginoutnew"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <span class="bor-line"></span>
        <span class="logout" @click="loginoutnew">退出</span> -->
      </div>
    </div>
    <div class="mydialog mydialognew">
      <!-- 编辑成员信息 -->
      <el-dialog
        title="账号设置"
        class=""
        :visible.sync="accountdialogVisible"
        width="550px"
        :close-on-click-modal="false"
        :before-close="accounthandleClose"
      >
        <el-form
          ref="accountdialogForm"
          :model="accountdialogForm"
          label-width="150px"
          
          :rules="accountrules"
        >
          <div class="outline">
            <p>头像</p>
            <div class="changephoto">
              <el-upload
                class="upload-demo upload-demofiles"
                action
                multiple
                ref="upload"
                :auto-upload="true"
                :http-request="uploadSuccess"
              >
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="this.$store.state.user.userImage"
                  alt=""
                />
                <span class="hoverchangephoto">
                  修改头像
                </span>
              </el-upload>
            </div>
            <p class="photoname">{{ this.$store.state.user.userName }}</p>
          </div>
          <div class="outline">
            <p>密码</p>
            <div>
              <el-form-item label="原始密码:" prop="password">
                <el-input
                  type="text"
                  v-model="accountdialogForm.password"
                  auto-complete="new-password"
                  placeholder="请输入原始密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="newPassword">
                <el-input
                  type="password"
                  v-model="accountdialogForm.newPassword"
                  auto-complete="new-password"
                  placeholder="请输入新密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认新密码:" prop="confPassword">
                <el-input
                  type="password"
                  v-model="accountdialogForm.confPassword"
                  auto-complete="new-password"
                  placeholder="请确认新密码"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accountcancel('accountdialogForm')"
            >取消</el-button
          >
          <el-button type="primary" @click="accountsave('accountdialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div class="mydialog mydialognew">
      <!-- 消息信息 -->
      <el-dialog
        title="消息"
        class=""
        :visible.sync="msgdialogVisible"
        width="550px"
        :close-on-click-modal="false"
        :before-close="msghandleClose"
      >
          <div v-infinite-scroll="load" infinite-scroll-disabled="disablednew" style="max-height:350px;overflow: auto;">
            <div class="usermsgout" v-for="(item,index) in usermsg" :key="index">
              <div class="usermsgleft">
                <img src="../../assets/images/usermsg.png"/>
              </div>
              <div class="usermsgright">
                <p><span>ROCK YOUR TEAM</span><span>{{item.createTime | formatDate }}</span></p>
                <p>{{item.content}}</p>
              </div>
            </div>
          </div>
        <div slot="footer" class="dialog-footer">
          <el-button style="color:#fff" type="primary" @click="msghandleClose">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <confirmDialogalldelete
      :isShowDialogalldelete="isShowDialogalldelete"
      :content="this.alldeletecontent"
      @on-result-changealldelete="changeIsShowDialogalldelete"
      @child-operation="operationalldelete"
    >
    </confirmDialogalldelete>
  </div>
</template>
<script>
import { constants } from "crypto";
import { formatDate } from "@/libs/date.js";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex"; //先要引入
import confirmDialogalldelete from "@/components/ConfirmDialogAlldelete.vue"; //组件放在的位置 根据实际修改
export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.accountdialogForm.confPassword !== "") {
          this.$refs.accountdialogForm.validateField("confPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认新密码"));
      } else if (value !== this.accountdialogForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      loadingnew: false,
      titleList: [
        { title: "项目", path: "/project", active: true },
        // { title: "知识库", path: "/knowledagebase", active: false },
        { title: "日程", path: "/schedule", active: false },
        { title: "团队", path: "/team", active: false }
      ],
      name: "",
      options: [],
      usermsg:[],
      usermsgnew:[],
      records:[],
      pageSize:10,
      pageNum:1,
      count: 10,
      allnumber:0,
      searchall: "",
      value: "",
      companyname: "北京博瑞华通有限公司",
      alldeletecontent: "确定要退出吗？",
      isShowDialogalldelete: false,
      accountdialogVisible: false,
      msgdialogVisible:false,
      accountdialogForm: {
        img: "",
        password: "",
        newPassword: "",
        confPassword: ""
      },
      accountrules: {
        password: [
          { required: true, message: "请输入原始密码", trigger: "blur" }
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        confPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  components: { confirmDialogalldelete },
  created() {
    this.getUserMsg();
    this.activeChange(this.$route.path);
    //this.getUsername();
    this.getCompanylist();
  },
  computed: {
    //vuex取值
    // ...mapGetters(["userName"]),
    username() {
      let username = localStorage.getItem("team_username");
      return username ? username : this.name;
    },
    noMore () {
      return this.count >= this.allnumber;
    },
    disablednew() {
      console.log(this.loadingnew);
      console.log(this.noMore);
      //return false;
      //console.log(this.loadingnew || this.noMore);
        return this.loadingnew || this.noMore
    },
  },
  methods: {
    ...mapActions("user", [
      //Login是指modules文件夹下的Login.js
      "userCompanyId", //Login.js文件中的actions里的方法，在上面的@click中执行并传入实参
      "userImage"
    ]),
    lookallmsg(){
      this.msgdialogVisible=true;
    },
    load () {
      // console.log(this.count)
      // console.log(this.allnumber)
        this.loadingnew = true
        setTimeout(() => {
          this.count+= 10;
          // this.pagesize+= 12;
          this.pageNum+=1;
          this.getUserMsg();
          this.loadingnew = false
        }, 2000)
        // this.records=[];
      },
    msghandleClose(){
      this.msgdialogVisible=false;
    },
    getUserMsg(){
      let tempobj={
        pageSize:this.pageSize,
        pageNum:this.pageNum
        };
         this.$http.user
            .getUserMsg(tempobj)
            .then(
              res => {
                if (res.data.ret == "0") {
                  let temparray = res.data.content.records;
                  if(temparray.length!=0){
                    for(let i=0;i<temparray.length;i++){
                      if(i<5){
                        this.usermsgnew.push(temparray[i])
                      }
                    }
                  }else{
                    this.usermsgnew=[]
                  }
                  this.usermsg=temparray;
                  if (temparray.length != "0") {
                      this.records.push(...temparray);
                      this.allnumber=res.data.content.totalRecord;
                    }else{

                    }
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              },
              error => {
                this.$message({
                  message: "请求错误",
                  type: "error"
                });
              }
            )
            .catch(function(error) {
              console.log(error);
            });
    },
    // 添加任务的自定义上传
    uploadSuccess(file) {
      console.log(file);
      let formData = new FormData();
      formData.append("file", file.file);
      let tempobj = {};
      // console.log(file.file);
      tempobj.name = file.file.name;
      tempobj.type = file.file.type;
      this.$http.user
        .uploadUserimage(formData)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.$message({
                message: "上传头像成功",
                type: "success"
              });
              this.accountdialogForm.img = res.data.content;
              let tempobj = { img: res.data.content };
              this.userImage(tempobj);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          },
          error => {
            this.$message({
              message: "请求错误",
              type: "error"
            });
          }
        )
        .catch(function(error) {
          console.log(error);
        });
    },
    accountsetting() {
      this.accountdialogVisible = true;
    },
    accounthandleClose() {
      this.$refs["accountdialogForm"].resetFields();
      this.accountdialogVisible = false;
    },
    accountcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["accountdialogForm"].resetFields();
          this.accountdialogVisible = false;
        } else {
          this.$refs["accountdialogForm"].resetFields();
          this.resetForm(formName);
          this.accountdialogVisible = false;
        }
      });
    },
    accountsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.accountdialogForm;
          this.$http.user
            .changePassword(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  let tempcontent = res.data.content.records;
                  this.resetForm(formName);
                  this.accountdialogVisible = false;
                  //this.getTeamList();
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              },
              error => {
                this.$message({
                  message: "请求错误",
                  type: "error"
                });
              }
            )
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goindex() {
      this.$router.push("/project");
    },
    changeIsShowDialogalldelete(val) {
      this.isShowDialogalldelete = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    operationalldelete(type) {
      if (type == "confirm") {
        this.loginout();
        //点击确认要执行的代码
      } else if (type == "cancel") {
        this.isShowDialogalldelete = false;
        //点击取消要执行的代码
      }
    },
    loginoutnew() {
      this.isShowDialogalldelete = true;
    },
    loginout() {
      this.$http.login
        .loginOut()
        .then(
          res => {
            if (res.data.ret == "0") {
              localStorage.removeItem("team_username");
              localStorage.removeItem("vuex");
              this.$router.push("/login");
              // this.$message({
              //   message: "退出成功",
              //   type: "success"
              // });
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
    },
    getUsername() {
      this.name = localStorage.getItem("team_username");
    },
    selectGet() {
      let obj = {};
      obj = this.options.find(item => {
        //这里的selectList就是上面遍历的数据源
        return item.id; //筛选出匹配数据
      });
      console.log(obj);
      this.userCompanyId(obj);
    },
    getCompanylist() {
      this.$http.login
        .getCompanylist()
        .then(
          res => {
            if (res.data.ret == "0") {
              this.options = res.data.content;
              this.value = res.data.content[0].id;
              this.selectGet();
              let obj = { id: this.value };
              this.userCompanyId(obj);
              // this.userCompanyId(res.data.content[0].id);
              console.log(res.data);
              // this.$message({
              //   message: "退出成功",
              //   type: "success"
              // });
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
    },
    routeChange(path) {
      // console.log(this.$route.query);
      // if (JSON.stringify(this.$route.query) == "{}") {
      this.$router.push({
        path,
        query: {
          t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
        }
      });
      //return this.$route.path + +new Date();
      // return this.$route.path.substr(1) === "scene_list" ? this.$route.path + +new Date() : this.$route.path
      // }
      // this.$router.push(path);
    },
    activeChange(path) {
      this.titleList.map(item => {
        if (path.indexOf(item.path) > -1) item.active = true;
        else item.active = false;
      });
    }
  }
};
</script>
<style scoped>
#header {
  display: flex;
}
.logo-name {
  width: 20%;
  line-height: 1;
  font-family: PingFangSC-Semibold;
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
  padding-left: 25px;
  box-sizing: border-box;
}
.logo-name img {
  display: inline-block;
  width: 180px;
  margin-top: 10px;
}
.head-list {
  width: 21%;
}
.head-list ul {
  display: flex;
  list-style: none;
  color: #ffffff;
  font-size: 15px;
  text-align: center;
}
.head-list ul li {
  width: 25%;
  line-height: 50px;
  height: 51px;
  cursor: pointer;
}
.head-list ul li > a {
  color: #ffffff;
}
.head-list ul li.actived {
  background: #3b404f;
}
.search-erery {
  width: 17.7%;
  margin-left: 3%;
}
.search-erery /deep/ .el-input-group {
  margin-top: 10px;
}
.search-erery /deep/ .el-input-group > .el-input__inner {
  height: 30px;
  line-height: 30px;
  background: #6a6cd1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: none;
  color: #cbcbff !important;
  font-size: 12px;
}
.search-erery
  /deep/
  .el-input-group
  > .el-input__inner::-webkit-input-placeholder {
  color: #cbcbff;
}
.search-erery /deep/ .el-input-group > .el-input__inner::-moz-placeholder {
  color: #cbcbff;
}
.search-erery /deep/ .el-input-group > .el-input__inner::-ms-input-placeholder {
  color: #cbcbff;
}
.search-erery /deep/ .el-input-group .el-input-group__append {
  background: #6a6cd1;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: none;
  color: #ffffff;
}
.usermessage {
  /* position: absolute;
  right: 30px; */
  line-height: 50px;
  color: #ffffff;
  width: 38.3%;
}
.usermessage > div {
  float: right;
}
.usermessage span,
.usermessage .el-icon-message-solid {
  margin-right: 20px;
}
.usermessage .el-icon-message-solid::before {
  vertical-align: middle;
  font-size: 17px;
  color: #fff;
}
.usermessage .bor-line {
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #ffffff;
  vertical-align: middle;
}
.usermessage .user-photo {
  width: 34px;
  height: 34px;
  vertical-align: middle;
  border-radius: 17px;
  margin-right: 10px;
}
.usermessage span:last-child {
  cursor: pointer;
}
.header-select {
  margin-right: 10px;
}
.header-select /deep/ .el-input--suffix .el-input__inner {
  height: 32px;
}
.header-select /deep/ .el-input.el-input--suffix.is-focus {
  /* height: 32px; */
}
.header-select /deep/ .el-input--suffix .el-input__inner {
  height: 32px;
  background: #6a6cd1;
  border: none;
  color: #ffffff;
}
.header-select /deep/ .el-input.el-input--suffix.is-focus .el-input__prefix,
.header-select /deep/ .el-input__suffix {
  top: 3px;
}
.header-select /deep/ .el-input.el-input--suffix.is-focus .el-input__prefix,
.header-select /deep/ .el-input__suffix {
  /* top: 3px; */
}
.header-select /deep/ .el-select__caret.el-input__icon.el-icon-circle-close {
  top: 0px;
}
.header-select /deep/ .el-input.el-input--suffix.is-focus .el-input__prefix,
.header-select /deep/ .el-input__suffix {
  top: 0px;
}
.header-select /deep/ .el-input--suffix .el-input__inner {
  color: #cbcbff !important;
  border: 1px solid #6a6cd1;
}
.header-select /deep/ .el-input--suffix .el-input__inner:hover {
  color: #cbcbff !important;
  border: 1px solid #7b7de5;
}
.countdropdown {
  width: 120px;
  margin-top: 0px;
  /* padding:0px 5px; */
  left: 89.5% !important;
}
.countdropdown .el-dropdown-menu__item {
}
.countdropdown /deep/ .popper__arrow {
  display: none;
}
.outline {
  padding: 15px 0px;
}
.outline p {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #3b404f;
  line-height: 32px;
}
.outline:first-child {
  padding-top: 0px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e9f6;
}
.outline:last-child {
  padding-bottom: 0px;
}
.outline /deep/ .el-input__inner {
  width: 250px;
}
.changephoto {
  position: relative;
  height: 80px;
  text-align: center;
}
.changephoto .el-upload.el-upload--text img {
  display: block;
  width: 75px;
  height: 75px;
  border-radius: 50%;
}
.photoname {
  line-height: 24px !important;
  text-align: center;
}
.changephoto /deep/ .el-upload.el-upload--text img:hover {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
}
.changephoto /deep/ .el-upload.el-upload--text:hover .hoverchangephoto {
  z-index: 100;
}
.hoverchangephoto {
  position: absolute;
  width: 75px;
  height: 50px;
  left: 219px;
  top: 0;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
  color: #fff;
  z-index: -1;
  opacity: 1;
  padding-top: 25px;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}
.changephoto /deep/ .el-upload-list.el-upload-list--text {
  display: none;
}
.usermsg{

}
.usermsgcontent{
  width:230px;
  left: 77.5% !important;
  margin-top: 0px;
  padding: 0px;
}
.usermsgcontent{
  font-size: 14px;
  line-height: 20px;
  color: #3B404F;
  /* padding: 0px 10px; */
}
.usermsgcontent p{
  font-size: 14px;
  line-height: 20px;
  color: #3B404F;
  padding: 0 20px;
  line-height: 36px;
}
.usermsgcontent p.msgtitle{
  background: #F6F6F6;  
}
.usermsgcontent p.allmsg{
  border-top:1px solid #E5E9F6;
  text-align: center;
  color: #878EA1;
}
.usermsgout{
  min-height: 20px;
  height: auto;
  width: 100%;
  display: table;
  padding-bottom: 10px;
  border-bottom: 1px solid #E5E9F6;
}
.usermsgout:last-child{
  border:none;
}
.usermsgout .usermsgleft{
  height: auto;
  width:43px;
  float: left;
}
.usermsgout .usermsgleft img{
  display: block;
  width:28px;
}
.usermsgout .usermsgright{
  display: flow-root;
  height: auto;
}
.usermsgout .usermsgright p:first-child{
  font-size: 14px;
  color: #878EA1;
  line-height: 24px;
}
.usermsgout .usermsgright p:last-child{
  font-size: 14px;
  color: #3B404F;
  line-height: 21px;
}
.usermsgout .usermsgright p:first-child span:first-child{
  display: inline-block;
  margin-right: 20px;
}
.usermsgcontent /deep/ .el-dropdown-menu__item:hover{
  font-family: inherit!important;
}
</style>
