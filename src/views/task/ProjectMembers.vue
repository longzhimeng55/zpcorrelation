<template>
  <div>
    <div class="projectMembers">
      <div
        class="cart"
        v-if="getprojectmember.length != 0"
        v-for="(item, index) in getprojectmember"
        :key="'getprojectmember' + index"
      >
        <div class="cart-title">
          <div>
            <img class="user-photo" :src="item.img" alt v-if="item.img!=null"/>
            <img class="user-photo" src="../../assets/images/photo.png" alt v-else/>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <i
              class="el-icon-more"
              title="更多"
              @click="moremsg(item.name, item.id)"
            ></i>
          </div>
        </div>
        <div class="cart-progress">
          进度:
          <span>{{ item.progress }}%</span>
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
            <el-col :span="6" class="active2" title="已延迟">
              <span>
                <span class="nums">{{ item.later }}</span>
                已延迟
              </span>
            </el-col>
            <el-col :span="5" class="active1" title="今天">
              <span>
                <span class="nums">{{ item.today }}</span>
                今天
              </span>
            </el-col>
            <el-col :span="6" class="active0" title="已开始">
              <span>
                <span class="nums">{{ item.finish }}</span>
                已开始
              </span>
            </el-col>
            <el-col :span="6" class="active3" title="未开始">
              <span>
                <span class="nums">{{ item.unStart }}</span>
                未开始
              </span>
            </el-col>
          </el-row>
          <!-- <el-col
              :span="item.spans"
              v-for="(item, index) in typesMsg"
              :key="index"
              :class="'active' + index"
            >
              <span>
                <span class="nums">{{ item.nums }}</span>
                {{ item.name }}
              </span>
            </el-col>
          </el-row> -->
        </div>
        <div class="project-usermsg"></div>
      </div>
      <span v-else>{{ "暂无数据" }}</span>
    </div>
    <div class="projectMems">
      <span>项目成员</span>
      <div class="userPic">
        <img
          :src="item1.img"
          v-if="getprojectmember.length != 0"
          v-for="(item1, index1) in getprojectmember"
          :key="'getprojectmemberimg1' + index1"
          :title="item1.name"
        />
        <!-- <img src="../../assets/images/photo.png"/> -->
        <span v-else>{{ "暂无数据" }}</span>
      </div>
    </div>
    <morenumber
      :reportdialogForm="reportdialogForm"
      :reporttitle="reporttitle"
      :reportwidth="reportwidth"
      :dialogVisible.sync="dialogreport"
      @reportgetCancel="reporthandleCancel"
      @reportcloseBindWarnStandard="reporthandleCloseBindWarnStandard"
      @reportsubmitForm="reportsubmitForm"
    ></morenumber>
  </div>
</template>
<script>
import morenumber from "@/components/morenumber/morenumber.vue";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      dialogreport: false,
      reportwidth: "680px",
      reporttitle: "编辑",
      reportdialogForm: {},
      customColor: "#7B7DE5",
      typesMsg: [
        { name: "Late", nums: 5, spans: 4 },
        { name: "Today", nums: 3, spans: 5 },
        { name: "Today", nums: 4, spans: 5 },
        { name: "Upcoming", nums: 8, spans: 6 }
      ],
      getprojectmember: []
    };
  },
  created() {
    this.getProjectMember();
  },
  methods: {
    //更多信息
    moremsg(name, id) {
      //项目报告
      this.dialogreport = true;
      let projectid = this.$store.state.user.projectId;
      let userid = this.$store.state.user.userId;
      let temobj = { projectId: projectid, userId: id };
      this.$http.project
        .getMemberReport(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              // this.title=res.data.content.name;
              this.reporttitle = name + "成员报告";
              // console.log(this.reporttitle);
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
    //获取项目成员
    getProjectMember() {
      let projectid = this.$store.state.user.projectId;
      let temobj = { projectId: projectid };
      this.$http.project
        .getProjectMember(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content;
              for (let i = 0; i < tempcontent.length; i++) {
                if (tempcontent[i].img == null) {
                  tempcontent[i].img = "static/img/photo.d6a0ec50.png";
                }
              }
              this.getprojectmember = tempcontent;
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
  },
  components: { morenumber }
};
</script>
<style scoped>
.projectMembers {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  /* justify-content: space-between;
  flex-wrap: wrap; */
}
.projectMembers .cart {
  width: 32%;
  margin-left: 20px;
  margin-bottom: 20px;
  background: #ffffff;
  box-shadow: 0 0 7px 0 rgba(130, 132, 223, 0.26);
  border-radius: 4px;
  box-sizing: border-box;
  color: #3b404f;
  cursor: pointer;
}
.projectMembers .cart:first-child,
.projectMembers .cart:nth-of-type(3n + 1) {
  margin-left: 0px;
}
.projectMembers .cart > div {
  padding: 0px 15px;
}
.projectMembers .cart .cart-title {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding-top: 5px;
  background: #f2f2f5;
}
.projectMembers .cart .cart-title .user-photo {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  vertical-align: middle;
  margin: -7px 10px 0 10px;
}
.projectMembers .cart .cart-title .el-icon-more:before {
  font-size: 16px;
  cursor: pointer;
}
.projectMembers .cart .cart-progress {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #484d5e;
}
.projectMembers .cart .cart-progress span {
  margin-left: 8px;
}
.projectMembers .cart .pregress-types {
  text-align: center;
  color: #ffffff;
  padding-top: 20px;
  padding-bottom: 20px;
}
.pregress-types /deep/ .el-row--flex {
    height: 23px;
}
.pregress-types /deep/ .el-row--flex>.el-col {
    padding: 1px 0px;
    /* font-size: 12px; */
    line-height: 22px;
}
.projectMembers .cart .project-usermsg {
  color: #484d5e;
  margin-bottom: 20px;
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
  background-color: #58A1FF;
  /* background-color: #04bfe0; */
  border-radius: 2px;
}
.projectMems {
  background-color: #ffffff;
  padding: 15px;
}
.projectMems .userPic {
  padding-top: 10px;
}
.projectMems .userPic img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  padding: 0 10px;
}
.projectMembers .cart > .cart-title {
  padding-left: 5px;
}
/* 自定义进度条样式 */
.el-progress-bar__inner::after {
  margin-right: 1px;
  /* height: 100%; */
  width: 10px;
  margin-top: -1px;
  height: 10px;
  background: #fff;
  border-radius: 5px;
}
.projectMembers /deep/ .el-progress-bar .el-progress-bar__inner::after {
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background: #fff;
    line-height: 1;
    margin-top: -2px;
    margin-right: 1px;
    vertical-align: middle;
}
</style>
