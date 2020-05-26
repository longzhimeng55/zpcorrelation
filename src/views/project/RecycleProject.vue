<template>
  <div class="project" v-loading="loading">
    <div class="containerTitle">
      <div class="btns">
        <el-button size="mini" round @click="order">
          按项目名称排序
          <i v-bind:class="[sortstatus=='upper'?'el-icon-defalut el-icon-up':'el-icon-defalut el-icon-down']"></i>
        </el-button>
        <!-- <el-button size="mini" round>
          添加项目
          <i class="el-icon-circle-plus-outline"></i>
        </el-button> -->
        <!-- <el-button size="mini" round>
          过滤筛选
          <i class="el-icon-upload el-icon--right"></i>
        </el-button> -->
      </div>
      <div class="projectName">{{projectType}}</div>
    </div>
    <div class="projectCarts">
      <el-row :gutter="12" v-model="records">
        <template v-if="records.length!==0">
          <el-col :span="8" v-for="(item,index) in records" :key="index">
            <div class="cart">
              <div class="cart-title">
                <div>
                  <i class="el-icon-star-on"
                    v-bind:class="{classadd:item.star=='1'}"
                    @click.stop="addAsterisk(item)"
                  ></i>
                  <span class="projectname">{{item.name}}</span>
                </div>
                <div v-on:click.stop="more">
                  <i class="el-icon-more"></i>
                </div>
              </div>
              <div class="cart-describe">
                <span v-if="item.desc!==''">{{item.desc}}</span>
                <span v-if="item.desc===''">{{暂无该项目的描述}}</span>
              </div>
              <div class="cart-progress">
                进度:
                <span>{{item.finish}}%</span>
              </div>
              <el-progress
                :text-inside="true"
                :color="customColor"
                :stroke-width="12"
                :percentage="item.progress"
                status="exception"
              ></el-progress>
              <div class="pregress-types">
                <el-row type="flex" justify="space-between">
                  <!-- <el-col
                  :span="item.spans"
                  v-for="(item,index) in typesMsg"
                  :key="index"
                  :class="'active'+index"
                >
                  <span>
                    <span class="nums">{{item.nums}}</span>
                    {{item.name}}
                  </span>
                  </el-col>-->
                <el-col :span="6" class="active2" title="已延迟">
                    <span>
                      <span class="nums">{{item.later}}</span>
                      已延迟
                    </span>
                  </el-col>
                   <el-col :span="5" class="active1" title="今天">
                    <span>
                      <span class="nums">{{item.today}}</span>
                      今天
                    </span>
                  </el-col>
                  <el-col :span="6" class="active0" title="已开始">
                    <span>
                      <span class="nums">{{item.finish}}</span>
                      已开始
                    </span>
                  </el-col>
                  <el-col :span="6" class="active3" title="未开始">
                    <span>
                      <span class="nums">{{item.unStart}}</span>
                      未开始
                    </span>
                  </el-col>
                </el-row>
              </div>
              <div class="project-usermsg">
                <i class="el-icon-user-solid"></i>
                项目所有者:
                <span class="project-Owner">{{item.creatorName}}</span>
                <i class="el-icon-user-solid"></i>
                参与人数:
                <span class="project-Owner">{{item.memberNum}}人</span>
              </div>
            </div>
          </el-col>
        </template>
        <el-col :span="24" v-if="records.length===0">
          <p class="nodata">暂无数据</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { sortByKey } from "@/libs/util.js";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      addProjectStyl: false,
      loading: true,
      formLabelWidth: "68px",
      projectType: "管理项目",
      sortstatus: "upper",
      records: [],
      form: {
        name: "",
        desc: "",
        region: "",
        radio: "1",
        persons: [],
        startTime: "",
        endTime: ""
      },
      pagesize: 10,
      pagenum: 1,
      companyid: "1",
      checked: true,
      personNums: 50,
      customColor: "#7B7DE5",
      typesMsg: [
        { name: "Late", nums: 5, spans: 4 },
        { name: "Today", nums: 3, spans: 5 },
        { name: "Today", nums: 4, spans: 5 },
        { name: "Upcoming", nums: 8, spans: 6 }
      ],
      checkList: ["选中且禁用", "复选框 A"]
    };
  },
  created() {
    // 获取项目列表
    this.getProjectlist();
    // 获取项目类型
    this.projectType = this.$route.meta.fatherTitle;
  },
  methods: {
     ...mapActions("user", ["userProjectId","aginProjectMenu","userProjectName","userProjectOwner"]),
    // 加星标
    addAsterisk(item) {
      let temnum = "";
      // star //1:打星，0：取消
      if (item.star == "1") {
        temnum = 0;
      } else {
        temnum = 1;
      }
      let temobj = {
        id: item.id,
        star: temnum
      };
      this.$http.project
        .addAsterisk(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              //刷新列表数据
              //告诉父组件重新请求数据
              let tempindexi=new Date();
              let temp = { id: tempindexi};
              this.aginProjectMenu(temp);
              this.getProjectlist();
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
    // 排序
    order() {
      if (this.sortstatus == "upper") {
        this.sortstatus = "";
        sortByKey(this.records, "name", "upper");
      } else {
        this.sortstatus = "upper";
        sortByKey(this.records, "name");
      }
    },
    getProjectlist() {
      let temobj = {
        pageSize: this.pagesize,
        pageNum: this.pagenum,
        entity: {
          companyId: this.companyid,
          orderBy: 0 //0正序，1反序
        }
      };
      this.$http.project
        .getRecycleProjectlist(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let temparray = res.data.content.records;
              if (temparray.length != "0") {
                this.records = temparray;
                this.loading = false;
              } else {
                this.loading = false;
              }
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
<style scoped>
.project .containerTitle {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 18px 0;
}
.project .containerTitle .btns .el-button {
  background: #7b7de5;
  color: #ffffff;
}
.project .containerTitle .projectName {
  color: #878ea1;
}
/* 项目卡片部分 */
.project .projectCarts .cart {
  margin-bottom: 20px;
  background: #ffffff;
  box-shadow: 0 0 7px 0 rgba(130, 132, 223, 0.26);
  border-radius: 4px;
  box-sizing: border-box;
  color: #3b404f;
  cursor: pointer;
}
.project .projectCarts .cart > div {
  padding: 0px 15px;
}
.project .projectCarts .cart .cart-title {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding-top: 5px;
  background: #f2f2f5;
}
.project .projectCarts .cart .cart-title .el-icon-star-on {
  vertical-align: middle;
  margin-top: -4px;
  cursor: pointer;
}
.project .projectCarts .cart .cart-title .el-icon-star-on:before {
  color: #7b7de5;
  font-size: 20px;
  padding-right: 5px;
  cursor: pointer;
}
.project .projectCarts .cart .cart-title .el-icon-more:before {
  font-size: 16px;
  cursor: pointer;
}
.project .projectCarts .cart .cart-describe {
  background: #f2f2f5;
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 11px;
  color: #3b404f;
}
.project .projectCarts .cart .cart-progress {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #484d5e;
}
.project .projectCarts .cart .cart-progress span {
  margin-left: 8px;
}
.project .projectCarts .cart .pregress-types {
  text-align: center;
  color: #ffffff;
  padding-top: 20px;
  padding-bottom: 20px;
}
.project .projectCarts .cart .project-usermsg {
  color: #878ea1;
  padding-bottom: 20px;
}
.project .projectCarts .cart .project-usermsg .el-icon-user-solid {
  margin-right: 3px;
}
.project .projectCarts .cart .project-usermsg .project-Owner {
  margin-left: 5px;
  margin-right: 18px;
}
.project .projectCarts .nodata {
  text-align: center;
  padding-top: 80px;
  font-size: 14px;
}
.active0 {
  background-color: #64dbb7;
  border-radius: 2px;
}
.active1 {
  background-color: #ffae38;
  border-radius: 2px;
}
.active2 {
  background-color: #fb5f5a;
  border-radius: 2px;
}
.active3 {
  background-color: #04bfe0;
  border-radius: 2px;
}
.project /deep/ .el-dialog__body {
  padding: 20px;
}
.project /deep/ .el-dialog__body .el-form .projectMsg {
  min-height: 200px;
  border: 1px solid #e5e9f6;
  border-radius: 4px;
  padding: 15px 30px 15px 15px;
}
.project /deep/ .el-dialog__body .el-form .mgb {
  margin-bottom: 10px;
}
.project /deep/ .el-dialog__body .el-form .mgtb {
  margin: 10px 0;
}
.project
  /deep/
  .el-dialog__body
  .el-form
  .productVideo
  .videos
  .el-radio
  > .el-radio__label {
  display: none;
}
.project /deep/ .el-dialog__body .el-form .productVideo .videos {
  margin: 6px 0;
}
.project /deep/ .el-dialog__body .el-form .productVideo .videos > .sp1 {
  padding-right: 15px;
}
.project /deep/ .el-dialog__body .el-form .productVideo .videos > .sp2 {
  padding-right: 42px;
}
.project /deep/ .el-dialog__body .el-form .productVideo .videos > .sp3 {
  padding-right: 42px;
}
.project /deep/ .el-dialog__body .el-form .productVideo .checkboxes > div {
  margin-left: 26px;
  color: #878ea1;
  font-size: 12px;
  margin-top: 3px;
}
.project
  /deep/
  .el-dialog__body
  .el-form
  .productVideo
  .checkboxes
  > div
  > .el-checkbox {
  display: inline-block;
  margin-left: 8px;
}
.project /deep/ .el-dialog__body .el-form .productVideo .personFind {
  color: #878ea1;
  font-size: 12px;
}
.project /deep/ .el-dialog__body .el-form .productVideo .personFind > span {
  color: #8480ed;
  font-size: 13px;
}
.project /deep/ .el-dialog__body .el-form .productVideo .pNumbers {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  font-size: 11px;
  color: #878ea1;
}
.project
  /deep/
  .el-dialog__body
  .el-form
  .productVideo
  .pNumbers
  > div:last-child {
  border: 1px solid #e5e9f6;
  border-radius: 4px;
  padding: 3px 4px;
}
.project /deep/ .el-dialog__body .el-form .el-textarea {
  border-radius: 4px;
  font-size: 12px;
  color: #878ea1;
}
.project /deep/ .el-dialog__body .el-form .el-date-editor.el-input {
  width: 180px;
}
.project /deep/ .el-dialog__body .el-form .el-textarea > .el-textarea__inner {
  background: #f6f6f6;
}
.project /deep/.el-dialog .el-dialog__footer {
  border: 1px solid #e5e9f6;
  padding: 16px 20px 16px;
}
.project /deep/.el-dialog .el-dialog__footer .dialog-footer .el-button {
  font-size: 12px;
  color: #878ea1;
  padding: 10px 20px;
}
.project
  /deep/.el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button--primary {
  background: #e5e9f6;
  border: 1px solid #e5e9f6;
}
span.projectname {
  cursor: pointer;
}
/*自定义列表上面的按钮样式 */
.containerTitle /deep/ .el-button--mini,.containerTitle /deep/ .el-button--mini.is-round{
    padding: 10px 15px!important;
}
.el-icon-defalut {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-top: -3px;
  vertical-align: middle;
}
.el-icon-defalut.el-icon-up {
  width: 16.5px;
  height: 11px;
  background: url("./../../assets/images/up.png") no-repeat;
  background-size: 16.5px 11px;
}
.el-icon-defalut.el-icon-down {
  width: 16.5px;
  height: 11px;
  background: url("./../../assets/images/down.png") no-repeat;
  background-size: 16.5px 11px;
}
.el-icon-defalut.el-icon-add {
  background: url("./../../assets/images/add.png") no-repeat;
  background-size: 14px 14px;
}
.el-icon-defalut.el-icon-filter {
  width: 12px;
  height: 10.3px;
  margin-top: -2px;
  background: url("./../../assets/images/filter.png") no-repeat;
  background-size: 12px 10.3px;
}
.pregress-types /deep/ .el-row--flex{
  height: 23px;
}
.pregress-types /deep/ .el-row--flex>.el-col{
    padding: 1px 0px;
    /* font-size: 12px; */
    line-height: 22px;
}
.project .projectCarts .cart /deep/ .el-progress-bar .el-progress-bar__inner::after {
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background: #fff;
    line-height: 1;
    margin-top: -2px;
    margin-right: 1px;
    vertical-align: middle;
}
.project .projectCarts .cart .cart-title .el-icon-star-on.classadd:before {
    color: #7b7de5;
}
.project .projectCarts .cart .cart-title{
  border-radius: 4px 4px 0px 0px!important;
}
</style>
