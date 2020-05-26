<template>
  <div class="project">
    <el-container>
      <el-header>
        <heads></heads>
      </el-header>
      <el-container>
        <el-aside>
          <div class="outline" v-show="showprojectmenu">
            <div class="outlinetitle">
              <div class="title">
                <p>{{ this.$store.state.user.projectName }}</p>
                <div class="projectprogress" style="">
                  <span
                    :style="item.styleObj"
                    :title="item.title"
                    v-for="item in projectprogress"
                    :key="item.index"
                  ></span>
                </div>
              </div>
              <div class="center">
                <p>项目所有者</p>
                <p>
                  <img
                    :src="this.$store.state.user.userImage" alt v-if="this.$store.state.user.userImage!=''"
                    style="display:inline-block;width:20px;height:20px;border-radius: 10px;"
                  />
                  <img
                    src="../assets/images/photo.png"
                    style="display:inline-block;width:20px;height:20px;border-radius: 10px;"
                    v-else
                  />
                  <span>{{ this.$store.state.user.projectOwner }}</span>
                </p>
              </div>
            </div>
            <div class="menunew">
              <el-row class="tac">
                <el-col style="width:165px">
                  <el-menu
                    :unique-opened="true"
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                  >
                    <el-submenu index="1">
                      <template slot="title">
                        <i class="el-icon-location el-icon-data"></i>
                        <span>项目日期</span>
                      </template>
                      <el-menu-item index="1-2" @click="setprojecttime"
                        >设置开始日期与结束日期</el-menu-item
                      >
                    </el-submenu>
                    <el-submenu index="2">
                      <template slot="title">
                        <i class="el-icon-location el-icon-tags"></i>
                        <span>项目标签</span>
                      </template>
                    </el-submenu>
                    <el-submenu index="3">
                      <template slot="title">
                        <i class="el-icon-location el-icon-report"></i>
                        <span>项目报告</span>
                      </template>
                      <el-menu-item index="3-2" @click="projectreport"
                        >查看项目报告</el-menu-item
                      >
                    </el-submenu>
                  </el-menu>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-show="showallProject">
            <div class="allProject">
              <i class="el-icon-menu"></i>所有项目({{ this.allprojectsnew }})
            </div>
            <div
              class="projectStyles"
              v-for="(item, index) in allProjects"
              :key="item.name"
              :class="{ active: item.active }"
              @click="projectCheck(item.name, item.path, index)"
            >
              <i class="icons" :class="item.icon"></i>
              {{ item.name }}
            </div>
          </div>
          <div class="outline" v-show="showfilesize">
            <div class="outlinetitle">
              <div class="title">
                <p>{{ this.$store.state.user.projectName }}</p>
                <div class="projectprogress" style="">
                  <span
                    :style="item.styleObj"
                    :title="item.title"
                    v-for="item in projectprogress"
                    :key="item.index"
                  ></span>
                </div>
              </div>
            </div>
            <div class="filesize">
              <p>文件空间</p>
              <P
                ><el-progress
                  :percentage="filesprogress"
                  :color="customColors"
                ></el-progress
              ></P>
              <p>{{ filessize.project + "GB/" + filessize.total + "GB" }}</p>
              <p>
                此项目使用{{ filessize.project }}GB，总空间{{
                  filessize.total
                }}GB
              </p>
            </div>
          </div>
          <div class="companylogo">
            <img src="../assets/images/login/companylogo.png" alt="logo" />
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>Powered by RockYourTeam</el-footer>
        </el-container>
      </el-container>
    </el-container>
    <!--新增、编辑-->
    <added-editor-dialog
      :dialogForm="dialogForm"
      :title="title"
      :width="width"
      :dialogVisible.sync="dialogVisible"
      @getCancel="handleCancel"
      @closeBindWarnStandard="handleCloseBindWarnStandard"
      @submitForm="submitForm"
    >
    </added-editor-dialog>
    <projectreport
      :reportdialogForm="reportdialogForm"
      :reporttitle="reporttitle"
      :reportwidth="reportwidth"
      :dialogVisible.sync="dialogreport"
      @reportgetCancel="reporthandleCancel"
      @reportcloseBindWarnStandard="reporthandleCloseBindWarnStandard"
      @reportsubmitForm="reportsubmitForm"
    ></projectreport>
  </div>
</template>
<script>
import Heads from "@/components/header/Header.vue";
import AddedEditorDialog from "@/components/project/AddedEditorDialog";
import projectreport from "@/components/projectreport/projectreport.vue";
import confirmDialog from "@/components/ConfirmDialog.vue"; //组件放在的位置 根据实际修改
import projecttime from "@/components/project/projecttime.vue";
import { setTimeout } from "timers";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "project",
  //监听vuex中的内容是不是改变，是不是要重新请求菜单的数据
  watch: {
    "$store.state.user.isagain": function(newFlag, oldFlag) {
      // 需要执行的代码
      //  console.log(newFlag);
      this.getmenuProject();
      //重新选择某个菜单
      //this.allProjects[0].active=true;
    },
    $route: "getPath"
  },
  data() {
    return {
      //在项目首页的时候显示
      showallProject: true,
      //在进入具体项目中的时候显示
      showprojectmenu: false,
      //在进入到文件菜单的时候显示
      showfilesize: false,
      //进度条相关的内容
      //文件所占的容量空间
      filessize: {},
      //文件的进度条
      filesprogress: "",
      projectprogress: [],
      //封装的dialog公用页面
      isShowDialog: false,
      //弹窗
      dialogVisible: false,
      dialogreport: false,
      dialogForm: {
        startTime: "",
        endTime: ""
      },
      reportdialogForm: "",
      width: "400px",
      reportwidth: "800px",
      title: "编辑",
      reporttitle: "",
      //总的项目数量
      allprojectsnew: "",
      // percentage: 20,
      customColor: "#409eff",
      customColors: [
        { color: "#7B7DE5", percentage: 20 },
        { color: "#7B7DE5", percentage: 40 },
        { color: "#7B7DE5", percentage: 60 },
        { color: "#7B7DE5", percentage: 80 },
        { color: "#7B7DE5", percentage: 100 }
        // { color: "#f56c6c", percentage: 20 },
        // { color: "#e6a23c", percentage: 40 },
        // { color: "#5cb87a", percentage: 60 },
        // { color: "#1989fa", percentage: 80 },
        // { color: "#6f7ad3", percentage: 100 }
      ],
      innerVisible: false,
      outerVisible: false,
      cartFlag: true,
      allProjects: [
        {
          name: "星标项目",
          nums: 9,
          icon: "el-icon-star-on",
          active: false,
          path: "/project/starProject"
        },
        {
          name: "管理项目",
          nums: 9,
          icon: "el-icon-refresh",
          active: true,
          path: "/project/manageProject"
        },
        {
          name: "归档项目",
          nums: 9,
          icon: "el-icon-suitcase-1",
          active: false,
          path: "/project/fileProject"
        },
        {
          name: "回收站",
          nums: 9,
          icon: "el-icon-delete",
          active: false,
          path: "/project/recycleProject"
        }
      ]
    };
  },
  created() {
    //知道当前路由是什么
    this.getPath();
    this.getmenuProject();
    // 添加项目选中标识
    this.projectFlag(this.$route.meta.fatherTitle);
  },
  computed() {},
  methods: {
    ...mapActions("user", [
      //Login是指modules文件夹下的Login.js
      "checkProjectMenu" //Login.js文件中的actions里的方法，在上面的@click中执行并传入实参
    ]),
    //项目报告
    projectreport() {
      this.dialogreport = true;
      let projectid = this.$store.state.user.projectId;
      let temobj = { projectId: projectid };
      this.$http.project
        .getReport(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              // this.title=res.data.content.name;
              this.reporttitle =
                this.$store.state.user.projectName + "项目报告";
              console.log(this.reporttitle);
              this.reportdialogForm = res.data.content;
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
    //设置项目起止时间
    setprojecttime() {
      this.dialogVisible = true;
      let projectid = this.$store.state.user.projectId;
      let temobj = { id: projectid };
      this.$http.project
        .editProject(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.title = res.data.content.name;
              this.dialogForm = res.data.content;
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
    // 点击弹框下的取消
    handleCancel() {
      this.dialogVisible = false;
    },
    //关闭弹窗
    handleCloseBindWarnStandard() {
      this.dialogVisible = false;
    },
    //新增、修改弹窗提交
    submitForm(val) {
      let temobj = val;
      this.$http.project
        .updataProject(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.dialogVisible = false;
              this.dialogForm = {};
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
    //项目报告
    // 点击弹框下的取消
    reporthandleCancel() {
      this.dialogreport = false;
    },
    //关闭弹窗
    reporthandleCloseBindWarnStandard() {
      this.dialogreport = false;
    },
    //新增、修改弹窗提交
    reportsubmitForm(val) {
      console.log(333);
    },
    //监听路由的变化
    getPath() {
      let temprouter = this.$route.path;
      if (temprouter.search("/project/manageProject/cart") != -1) {
        this.showprojectmenu = false;
        this.showallProject = true;
        this.showfilesize = false;
      }
      if (temprouter.search("/project/manageProject/cartDetail") != -1) {
        //console.log(3333);
        this.getprojectprogress();
        this.showprojectmenu = true;
        this.showallProject = false;
        this.showfilesize = false;
      }
      if (temprouter.search("/project/manageProject/cartDetail/file") != -1) {
        this.showprojectmenu = false;
        this.showallProject = false;
        this.getprojectallfilessize();
        this.showfilesize = true;
      }
      // console.log(this.$route.path);
    },
    //获取项目的进度相关的内容
    getprojectprogress() {
      let projectid = this.$store.state.user.projectId;
      let temp = { projectId: projectid };
      this.$http.project
        .getProjectProgress(temp)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempprojectprogress = res.data.content;
              let temparray = [];
              let temparraynew = [];
              let temparray2 = [];
              temparray.push(tempprojectprogress);
              temparraynew["normal"] = tempprojectprogress.normal;
              temparraynew["warning"] = tempprojectprogress.warning;
              temparraynew["delay"] = tempprojectprogress.delay;
              let tempall =
                tempprojectprogress.warning +
                tempprojectprogress.delay +
                tempprojectprogress.normal;
              for (let key in temparraynew) {
                let tempobj = {};
                if (key == "normal") {
                  let index =
                    (tempprojectprogress.normal / tempall).toFixed(2) * 100;
                  tempobj.title = "正常";
                  let tempobjnew = {};
                  tempobjnew.background = "#64DBB7";
                  tempobjnew.width = index + "%";
                  tempobj.styleObj = tempobjnew;
                }
                if (key == "warning") {
                  let index =
                    (tempprojectprogress.warning / tempall).toFixed(2) * 100;
                  let tempobjnew = {};
                  tempobj.title = "即将逾期";
                  tempobjnew.background = "#FFAE38";
                  tempobjnew.width = index + "%";
                  tempobj.styleObj = tempobjnew;
                }
                if (key == "delay") {
                  let index =
                    (tempprojectprogress.delay / tempall).toFixed(2) * 100;
                  let tempobjnew = {};
                  tempobj.title = "已逾期";
                  tempobjnew.background = "#FB5F5A";
                  tempobjnew.width = index + "%";
                  tempobj.styleObj = tempobjnew;
                }
                temparray2.push(tempobj);
              }
              this.projectprogress = temparray2;
              console.log(temparray2);
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
    //获取项目文件大小的内容
    getprojectallfilessize() {
      let projectid = this.$store.state.user.projectId;
      let temp = { projectId: projectid };
      this.$http.files
        .getAllFilesSize(temp)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempfilessize = res.data.content;
              this.filessize = res.data.content;
              let filesprogress =
                (tempfilessize.project / tempfilessize.total).toFixed(2) * 100;
              // this.filesprogress=
              if (isNaN(filesprogress)) {
                this.filesprogress = "0";
              } else {
                this.filesprogress = filesprogress;
              }
              console.log(this.filesprogress);
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
    //文件占用的容量的颜色变化
    customColorMethod(percentage) {
      if (percentage < 30) {
        return "#909399";
      } else if (percentage < 70) {
        return "#e6a23c";
      } else {
        return "#67c23a";
      }
    },
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    },
    ///menu/getProject
    getmenuProject() {
      let companyid = this.$store.state.user.userCompanyId;
      this.$http.project
        .getProjectMenu({ companyId: companyid })
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content;
              let tempstr = 0;
              let temparray = [];
              if (tempcontent.length != 0) {
                this.allprojectsnew = "";
                for (var i = 0; i < tempcontent.length; i++) {
                  let tempobj = {};
                  tempstr += parseInt(
                    tempcontent[i].name.substring(
                      tempcontent[i].name.indexOf("(") + 1,
                      tempcontent[i].name.indexOf(")")
                    )
                  );
                  if (tempcontent[i].id == "project_star") {
                    tempobj.name = tempcontent[i].name;
                    tempobj.nums = 9;
                    tempobj.icon = "el-icon-star-on";
                    tempobj.active = false;
                    tempobj.path = "/project/starProject";
                  } else if (tempcontent[i].id == "project_all") {
                    tempobj.name = tempcontent[i].name;
                    tempobj.nums = 9;
                    tempobj.icon = "el-icon-refresh";
                    tempobj.active = false;
                    tempobj.path = "/project/manageProject";
                  } else if (tempcontent[i].id == "project_store") {
                    tempobj.name = tempcontent[i].name;
                    tempobj.nums = 9;
                    tempobj.icon = "el-icon-suitcase-1";
                    tempobj.active = false;
                    tempobj.path = "/project/fileProject";
                  } else if (tempcontent[i].id == "project_recycle") {
                    tempobj.name = tempcontent[i].name;
                    tempobj.nums = 9;
                    tempobj.icon = "el-icon-delete";
                    tempobj.active = false;
                    tempobj.path = "/project/recycleProject";
                  }
                  temparray.push(tempobj);
                }
                // console.log(tempstr);
                this.allprojectsnew = tempstr;
                this.allProjects = temparray;
                let menucontentnew = this.$store.state.user.menucontent;
                let temprouter = this.$route.path;
                if (temprouter.search("/project/manageProject/cart") != -1) {
                  this.allProjects[1].active = true;
                } else {
                  this.allProjects[menucontentnew].active = true;
                }
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
    // 项目种类切换，管理，星标，归档，回收站
    projectCheck(name, path, index) {
      // console.log(index)
      let menuindex = { id: index };
      this.checkProjectMenu(menuindex);
      this.allProjects.map(item => {
        if (item.name == name) item.active = true;
        else item.active = false;
      });
      this.$router.push(path);
    },
    projectFlag(title) {
      this.allProjects.map(item => {
        if (item.name == title) item.active = true;
        else item.active = false;
      });
    }
  },
  components: { Heads, AddedEditorDialog, projectreport }
};
</script>
<style scoped>
.project,
.project /deep/ .el-container.is-vertical,
.project /deep/ .el-container {
  height: 100%;
}
.project /deep/ .el-header {
  height: 50px !important;
  padding: 0;
  background: #7b7de5;
}
.project /deep/ .el-aside {
  width: 17.7% !important;
  background: #484d5e;
}
.project /deep/ .el-footer {
  height: 40px !important;
  padding: 0;
  background: #e8e9ed;
  line-height: 40px;
  text-align: center;
  color: #878ea1;
  font-size: 14px;
}
.project .allProject {
  height: 70px;
  padding: 26px 0 0 29px;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 14px;
  background: #3b404f;
  cursor: pointer;
}
.project .allProject .el-icon-menu {
  margin-right: 12px;
  font-size: 18px;
  vertical-align: middle;
  margin-top: -3px;
}
.project .projectStyles {
  height: 40px;
  padding: 18px 0 0 25px;
  color: #a3aed0;
  font-size: 14px;
  background: #484d5e;
  cursor: pointer;
}
.project .active {
  color: #ffffff;
  background: #51576d;
  border-left: 3px solid #7b7de5;
}
.project .projectStyles .icons {
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
  margin-top: -3px;
}
.project /deep/ .el-main {
  padding: 0 30px;
  box-sizing: border-box;
  background: #f0f1f4;
}
/*新的菜单*/
.outline {
  height: 100%;
}
.outlinetitle {
  width: 100%;
  background: #3b404f;
  height: auto;
}
.outlinetitle .title {
  padding-left: 25px;
  height: 65px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  padding-top: 15px;
}
.outlinetitle .title p:first-child {
  font-family: PingFangSC-Medium;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
}
.outlinetitle .center {
  padding-left: 25px;
  height: 65px;
  padding-top: 15px;
}
.outlinetitle .center p:first-child {
  font-family: PingFangSC-Medium;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
}
.outlinetitle .center p:last-child {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  margin-top: 10px;
}
.outlinetitle .center p:last-child img {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  vertical-align: middle;
  margin-right: 8px;
}
.outlinetitle .center p:last-child span {
  display: inline-block;
  vertical-align: middle;
}
.outlinetitle .menunew {
  width: 100%;
}
.menunew /deep/ .el-menu {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #c1cdf5;
  border-right: none;
  background: #484d5e !important;
}
.menunew /deep/ .el-submenu__title {
  padding-left: 27px !important;
  background: #484d5e !important;
}
.menunew /deep/ .el-submenu__title * {
  vertical-align: initial;
}
.menunew /deep/ .el-submenu__title i {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #c1cdf5;
}
.menunew /deep/ .el-submenu__title span,
.menunew /deep/ .el-submenu .el-menu-item {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #c1cdf5;
  background: #484d5e !important;
}
.menunew /deep/ .el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #c1cdf5 !important;
  padding-left: 55px !important;
}
.menunew /deep/ .el-menu-item,
.menunew /deep/ .el-submenu__title {
  height: 52px;
  line-height: 52px;
}
.menunew /deep/ .tac.el-row .el-col.el-col-24 {
  width: 100% !important;
  /* padding-right: 87px; */
}
.menunew /deep/ li.el-submenu > div.el-submenu__title {
  border-left: 3px solid #484d5e;
  height: 52px;
}
.menunew /deep/ .el-submenu.is-opened .el-submenu__title {
  background: #51576d !important;
  border-left: 3px solid #7b7de5;
  height: 52px;
}
.menunew /deep/ .el-submenu.is-opened .el-submenu__title i {
  color: #fff;
}
.menunew /deep/ .el-submenu.is-opened .el-submenu__title span {
  background: none !important;
  color: #fff;
}
.menunew /deep/ .el-submenu.is-opened .el-submenu .el-menu-item {
  color: #fff;
}
.menunew /deep/ .el-submenu__icon-arrow {
  right: 100px;
}
.menunew /deep/ .el-icon-location:before {
  content: "";
}
.menunew /deep/ .el-icon-location {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}
.menunew /deep/ .el-icon-location.el-icon-data {
  background: url(../assets/images/project/date.png) no-repeat;
  background-size: 80% 80%;
}
.menunew /deep/ .el-icon-location.el-icon-tags {
  background: url(../assets/images/project/tags.png) no-repeat;
  background-size: 80% 80%;
}
.menunew /deep/ .el-icon-location.el-icon-report {
  background: url(../assets/images/project/report.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles .icons {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}
.project .projectStyles /deep/ .icons.el-icon-star-on:before,
.project .projectStyles /deep/ .icons.el-icon-refresh:before,
.project .projectStyles /deep/ .icons.el-icon-suitcase-1:before,
.project .projectStyles /deep/ .icons.el-icon-delete:before {
  content: "";
}
.project .projectStyles /deep/ .icons.el-icon-star-on {
  background: url(../assets/images/project/starton.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles /deep/ .icons.el-icon-refresh {
  background: url(../assets/images/project/openmangageproject.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles /deep/ .icons.el-icon-suitcase-1 {
  background: url(../assets/images/project/filemanage.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles /deep/ .icons.el-icon-delete {
  background: url(../assets/images/project/recycle.png) no-repeat;
  background-size: 80% 80%;
}
/*菜单选中样式*/
.project .projectStyles.active /deep/ .el-icon-star-on {
  background: url(../assets/images/project/openstarton.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles.active /deep/ .icons.el-icon-refresh {
  background: url(../assets/images/project/openmangageproject.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles.active /deep/ .icons.el-icon-suitcase-1 {
  background: url(../assets/images/project/openfilemanage.png) no-repeat;
  background-size: 80% 80%;
}
.project .projectStyles.active /deep/ .icons.el-icon-delete {
  background: url(../assets/images/project/openrecycle.png) no-repeat;
  background-size: 80% 80%;
}
.menunew /deep/ .el-submenu.is-opened .el-icon-location.el-icon-data {
  background: url(../assets/images/project/opendate.png) no-repeat;
  background-size: 80% 80%;
}
.menunew /deep/ .el-submenu.is-opened .el-icon-location.el-icon-report {
  background: url(../assets/images/project/openreport.png) no-repeat;
  background-size: 80% 80%;
}
.menunew /deep/ .el-submenu.is-opened .el-icon-location.el-icon-tags {
  background: url(../assets/images/project/opentags.png) no-repeat;
  background-size: 80% 80%;
}
.filesize p {
  padding-left: 25px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  line-height: 20px;
  padding-top: 7px;
  color: #ffffff;
}
.filesize p:first-child + p + p {
  color: #c1cdf5;
}
.filesize p:first-child,
.filesize p:last-child {
  padding-top: 15px;
  width: 89%;
}
.projectprogress {
  width: 90%;
  height: 8px;
  display: inline-flex;
  margin-top: 7px;
}
.projectprogress span {
  display: inline-block;
  height: 8px;
}
.filesize /deep/ .el-progress__text {
  display: none;
}
.companylogo {
  position: absolute;
  text-align: center;
  bottom: 13px;
  left: 4.1%;
}
.companylogo img {
  display: inline-block;
  width: 110px;
  text-align: center;
  margin: 0 auto;
}
</style>
