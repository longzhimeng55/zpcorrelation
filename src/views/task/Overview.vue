<template>
  <div class="task">
    <div class="taskoutline">
      <div class="taskoutline-left">
        <div class="outline-content">
          <p>任务</p>
          <div class="outline-leftcontent">
            <div class="echarts-outline">
              <P>个人任务情况</P>
              <div class="echarts-content">
                <pieecharts v-if="temppersontask!=''" v-bind:parentToChild="eventspepie" v-bind:piechartData="temppersontask"></pieecharts>
              </div>
            </div>
            <div class="echarts-outline">
              <P>个人里程碑情况</P>
              <div>
                <pieecharts v-if="temppersonms!=''" v-bind:parentToChild="eventspepie" v-bind:piechartData="temppersonms"></pieecharts>
              </div>
            </div>
            <div class="echarts-outline">
              <P>项目任务情况</P>
              <div class="echarts-content">
                <pieecharts v-if="temptotaltask!=''" v-bind:parentToChild="eventspepie" v-bind:piechartData="temptotaltask"></pieecharts>
              </div>
            </div>
            <div class="echarts-outline">
              <P>项目里程碑情况</P>
              <div class="echarts-content">
                <pieecharts v-if="temptotalms!=''" v-bind:parentToChild="eventspepie" v-bind:piechartData="temptotalms"></pieecharts>
              </div>
            </div>
          </div>
        </div>
        <div class="echarts-qushi" style="margin-top:0px">
          <p class="echarts-title">项目趋势图</p>
          <div class="echarts-content">
            <barecharts v-if="tempcharts!=''" v-bind:parentToChild="eventsproject" v-bind:piechartData="tempcharts"></barecharts>
          </div>
        </div>
        <div class="echarts-qushi">
          <p class="echarts-title">任务燃尽图</p>
          <div class="echarts-content">
            <lineecharts v-if="tempburnout!=''" v-bind:parentToChild="eventsproject" v-bind:piechartData="tempburnout"></lineecharts>
          </div>
        </div>
      </div>
      <div class="taskoutline-right">
        <p class="outline-righttitle">
          <span class="left">Users</span>
          <span class="right"></span>
        </p>
        <div class="outline">
          <div
            class="outline-contents"
            v-if="overviewdata.length!=0"
            v-for="item in overviewdata"
            :key="'item'+item.id"
          >
            <div class="usermsgoutline">
              <div class="userphoto">
                <img src="../../assets/images/photo.png" v-if="item.img ==null" />
                <img :src="item.img" v-if="item.img !=null" />
              </div>
              <div class="usermsg">
                <p>{{item.name}}</p>
                <p>
                  <span>进度:{{item.progress}}%</span>
                  <span>数量: {{item.total}}(个)</span>
                </p>
              </div>
            </div>
            <el-progress :text-inside="true" :stroke-width="13" :percentage="item.progress"></el-progress>
          </div>
          <div class="grid-content" v-if="overviewdata.length ==0">
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pieecharts from "@/components/echarts/pieecharts.vue";
import Lineecharts from "@/components/echarts/lineecharts.vue";
import Barecharts from "@/components/echarts/barecharts.vue";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Overview",
  data() {
    return {
      eventspepie: {
        width: "100%",
        height: "250px"
      },
      eventsproject: {
        width: "100%",
        height: "250px"
      },
      overviewdata: [],
      //个人任务情况
      temppersontask:[],
      //个人里程碑情况
      temppersonms: [],
      //项目里程碑情况
      temptotaltask: [],
       // 项目任务情况
      temptotalms: [],
      // 项目柱状图
      tempcharts:[],
      //项目燃尽图
      tempburnout:[]
    };
  },
  computed: {
    //使用计算属性获取vuex中的值
    ...mapState(["userProjectId"])
  },
  created() {
    this.getoverviewdata();
  },
  components: {
    Pieecharts,
    Lineecharts,
    Barecharts
  },
  methods: {
    changeChartsData(originaldata,newdata) {
      let temparray = [];
      let temppersontask = originaldata;
      for (let key in temppersontask) {
        let temobj = {};
        // console.log(key)
        // console.log(temppersontask[key])
        if (key == "finish") {
          (temobj.name = "完成");
          if (key == "finish"&&temppersontask[key]!="0"){
            (temobj.value = temppersontask[key]);
          }
          temparray.push(temobj);
        }
        if (key == "later") {
          (temobj.name = "延迟");
           if (key == "later"&&temppersontask[key]!="0"){
            (temobj.value = temppersontask[key]);
          }
          temparray.push(temobj);
        }
        if (key == "start") {
          (temobj.name = "开始");
          if (key == "start"&&temppersontask[key]!="0"){
            (temobj.value = temppersontask[key]);
          }
          // (temobj.value = temppersontask[key]);
          temparray.push(temobj);
        }
        if (key == "noDate") {
          (temobj.name = "未知");
          if (key == "noDate"&&temppersontask[key]!="0"){
            (temobj.value = temppersontask[key]);
          }
          // (temobj.value = temppersontask[key]);
          temparray.push(temobj);
        }
        if (key == "today") {
          (temobj.name = "今天");
          if (key == "today"&&temppersontask[key]!="0"){
            (temobj.value = temppersontask[key]);
          }
          // (temobj.value = temppersontask[key]);
          temparray.push(temobj);
        }
        // if (key == "finish"&&temppersontask[key]!="0") {
        //   (temobj.name = "完成"), 
        //   (temobj.value = temppersontask[key]);
        //   temparray.push(temobj);
        // }
        // if (key == "later"&&temppersontask[key]!="0") {
        //   (temobj.name = "延迟"), 
        //   (temobj.value = temppersontask[key]);
        //   temparray.push(temobj);
        // }
        // if (key == "start"&&temppersontask[key]!="0") {
        //   (temobj.name = "开始"), 
        //   (temobj.value = temppersontask[key]);
        //   temparray.push(temobj);
        // }
        // if (key == "noDate"&&temppersontask[key]!="0") {
        //   (temobj.name = "未知"), (temobj.value = temppersontask[key]);
        //   temparray.push(temobj);
        // }
        // if (key == "today"&&temppersontask[key]!="0") {
        //   (temobj.name = "今天"), (temobj.value = temppersontask[key]);
        //   temparray.push(temobj);
        // }
      }
      return newdata=temparray;
    },
    getoverviewdata() {
      let projectid = this.$store.state.user.projectId;
      let temobj = { projectId: projectid };
      this.$http.overview
        .getOverviewList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              console.log(res.data);
              this.overviewdata = res.data.content.members;
              //个人任务情况
              let temppersontask = res.data.content.personTask;
              if (JSON.stringify(temppersontask) != "{}") {
                this.temppersontask=this.changeChartsData(temppersontask,this.temppersontask);
              } else {
                this.temppersontask = ["0"];
                this.temppersonlegend = ["0"];
              }
              //个人里程碑情况
              let temppersonms = res.data.content.personMS;
              if (JSON.stringify(temppersonms) != "{}") {
                this.temppersonms=this.changeChartsData(temppersonms,this.temppersonms);
              } else {
                this.temppersonms = ["0"];
                // this.temppersonlegend = ["0"];
              }
              // 项目任务情况
              let temptotalms = res.data.content.totalMS;
              if (JSON.stringify(temptotalms) != "{}") {
                this.temptotalms=this.changeChartsData(temptotalms,this.temptotalms);
              } else {
                this.temptotalms = ["0"];
                // this.temppersonlegend = ["0"];
              }
              //项目里程碑情况
              let temptotaltask = res.data.content.totalTask;
              if (JSON.stringify(temptotaltask) != "{}") {
                this.temptotaltask=this.changeChartsData(temptotaltask,this.temptotaltask);
              } else {
                this.temptotaltask = ["0"];
                // this.temppersonlegend = ["0"];
              }
              //项目趋势图
              let tempcharts = res.data.content.charts;
              if (JSON.stringify(tempcharts) != "{}") {
                this.tempcharts=tempcharts;
              } else {
                this.tempcharts = ["0"];
                // this.temppersonlegend = ["0"];
              }
              //项目燃尽图
              let tempburnout = res.data.content.burnout;
              if (JSON.stringify(tempburnout) != "{}") {
                this.tempburnout=tempburnout;
              } else {
                this.tempburnout = ["0"];
                // this.temppersonlegend = ["0"];
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
    }
  }
};
</script>

<style scoped>
.task {
  height: auto;
}
.task .taskoutline {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}
.task .taskoutline .taskoutline-left {
  width: 72%;
  height: auto;
}
.task .taskoutline .taskoutline-left .outline-content > p {
  font-family: PingFangSC-Medium;
  font-size: 13px;
  color: #3b404f;
  margin-top: 10px;
  margin-bottom: 10px;
}
/* Taks内容部分样式 */
.outline-content .outline-leftcontent {
  /* height: 285px; */
  height: auto;
  overflow: hidden;
}
.outline-content .outline-leftcontent > .echarts-outline {
  width: 49%;
  float: left;
  background: #fff;
  margin-bottom: 20px;
}
.outline-content .outline-leftcontent > .echarts-outline:nth-child(odd) {
  margin-right: 2%;
}
.outline-content .outline-leftcontent > .echarts-outline > p {
  background: #7b7de5;
  text-align: center;
  font-family: PingFangSC-Medium;
  /* font-size: 12px; */
  font-size: 15px;
  /* font-weight: 600; */
  height: 35px;
  line-height: 35px;
  color: #ffffff;
}
/* 趋势图部分样式 */
.echarts-qushi {
  height: 312px;
  margin-top: 20px;
  width: 100%;
  background: #fff;
}
.echarts-qushi > .echarts-title {
  font-family: PingFangSC-Medium;
  font-size: 15px;
  /* line-height: 30px; */
  padding-top: 12px;
  margin-left: 20px;
  color: #3b404f;
  font-weight: 600;
}
/* 右侧部分列表 */
.task .taskoutline .taskoutline-right {
  width: 26.5%;
}
.taskoutline-right .outline-righttitle {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 21px;
  font-family: PingFangSC-Medium;
  font-size: 13px;
  color: #3b404f;
}
.taskoutline-right .outline-righttitle span:first-child {
  display: inline-block;
  float: left;
}
.taskoutline-right .outline-righttitle span:last-child {
  display: inline-block;
  float: right;
}
.taskoutline-right > .outline {
  background: #fff;
  overflow-x: hidden;
  /* overflow-y: scroll; */
  height: auto;
}
.taskoutline-right > .outline .outline-contents {
  padding: 20px;
  border-bottom: 1px solid #f1f1f6;
}
.outline-contents .usermsgoutline {
  display: flex;
  margin-bottom: 20px;
  overflow: hidden;
}
.outline-contents .usermsgoutline .userphoto {
  height: 50px;
}
.outline-contents .usermsgoutline .userphoto img {
  display: inline-block;
  width: 50px;
  height: 50px;
  vertical-align: middle;
  border-radius: 25px;
}
.outline-contents .usermsgoutline .usermsg {
  height: 50px;
  margin-left: 20px;
}
.outline-contents .usermsgoutline .usermsg > p {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  line-height: 27px;
  color: #484d5e;
}
.outline-contents .usermsgoutline .usermsg > p:first-child {
  font-size: 14px;
  color: #3b404f;
}
.outline-contents .usermsgoutline .usermsg > p span {
  display: inline-block;
}
.outline-contents .usermsgoutline .usermsg > p span:first-child {
  margin-right: 15px;
}
.taskoutline-right > .outline .outline-contents:last-child {
  border-bottom: none;
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
.outline /deep/ .el-progress-bar .el-progress-bar__inner::after {
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