<template>
  <div class="milePost"
       v-loading="loading">
    <div class="mileTitle">
      <div v-for="item in titleList"
           @click="titleChange(item.title)"
           :class="{ actived: item.active }"
           :key="item.title">
        <div>
          {{ item.title }}
          <span v-if="item.num"
                class="nums">({{ item.num }})</span>
        </div>
        <i v-show="item.active"
           class="el-icon-caret-top"></i>
      </div>
      <!-- <el-button size="mini" round @click="SortPro">
        按项目名称排序
        <i class="el-icon-upload el-icon--right"></i>
      </el-button> -->
    </div>
    <div class="mileComent">
      <div class="coment">
        <template v-if="getmilestonedatanew.length != 0">
          <div class="comentList"
               v-for="item in getmilestonedatanew"
               :key="'item' + item.id">
            <div class="comentLf">
              <div class="dateMsg">
                <div>{{ item.whatmonth + "月" }}</div>
                <strong>{{ item.whatday }}</strong>
                <div>{{ item.whatdayweek }}</div>
              </div>
              <!-- <el-checkbox v-model="checked"></el-checkbox> -->
              <div class="comentDes">
                <p style="font-size:14px;color:#3b404f">{{ item.name }}</p>
                <p class="p-describe">{{ item.remark | ellipsis }}</p>
                <div class="projectProgress">
                  <el-row type="flex"
                          class="row-bg"
                          justify="space-between">
                    <el-col :span="17">
                      <el-progress :percentage="item.progress"
                                   :show-text="showText"
                                   :format="format"></el-progress>
                    </el-col>
                    <el-col :span="6">
                      <div class="grid-content bg-purple">
                        进度:{{ item.progress }}%
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <!-- <div>{{"2222222222222222222" | ellipsis}}</div> -->
              </div>
            </div>
            <div class="timeRemaining">
              <div style="width:85px;position: absolute;top: 0px;">
                <el-checkbox @change="changecheckbox(item)"
                             :checked="item.checkedstatus"
                             :label="item.statusname"
                             :disabled="item.status === 2">{{ item.statusname }}</el-checkbox>
              </div>
              <div class="timeConment">
                <i class="el-icon-alarm-clock"></i>还剩{{ item.remain }}天
              </div>
            </div>
          </div>
        </template>
        <div class="comentList"
             v-else>
          <p>暂无数据</p>
        </div>
      </div>
      <div class="timeTable">
        <Calendar :textTop="texttop"
                  v-on:choseDay="clickDay"
                  v-on:changeMonth="changeDate"
                  ref="nowDate"
                  :markDateMore="arrnew"></Calendar>
        <Calendar :textTop="texttop"
                  v-on:choseDay="clickDaynew"
                  v-on:changeMonth="changeDate"
                  ref="tMonthAgo"
                  :markDateMore="arr"></Calendar>
      </div>
    </div>
  </div>
</template>
<script>
import Calendar from "vue-calendar-component";
import { getDate, getWeek, getNewDate, beforeOneMonth } from "@/libs/date.js";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  data () {
    return {
      loading: true,
      showText: false,
      status: "0",
      // 获取全部的里程碑的数据
      getmilestonedata: [],
      //前端实现过滤的功能
      getmilestonedatanew: [],
      //全部
      total: "",
      //未完成
      unFinish: "",
      //逾期
      later: "",
      //两个月之前的
      arr: [
        { date: "" }
      ],
      // 现在的时间
      arrnew: [{ date: "" }],
      // 自定义头部显示
      texttop: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ],

      titleList: [
        { title: "全部", num: "", active: true },
        { title: "未完成", num: "", active: false },
        { title: "逾期", num: "", active: false }
        // { title: "日程表", active: false }
      ]
    };
  },
  filters: {
    ellipsis (value) {
      if (!value) return "";
      if (value.length > 10) {
        return value.slice(0, 10) + "...";
      }
      return value;
    }
  },
  created () {
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    this.getMilestoneList();
    this.titleChange("全部");
  },
  mounted () {
    this.getdatanew();
  },
  methods: {
    //获取checkbox中数据的改变
    changecheckbox (item) {
      let temobj = { id: item.id, status: 2 };
      this.$http.milestone
        .isTaskFinish(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              if (item.checkedstatus == false) {
                item.checkedstatus = true;
                item.statusname = "已完成";
                item.status = 2;
              } else {
                item.checkedstatus = false;
                item.statusname = "未完成";
                item.status = 1;
              }
              this.getMilestoneList();
            } else {
              item.checkedstatus = false;
              item.statusname = "未完成";
              item.status = 1;
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
        .catch(function (error) {
          console.log(error);
        });
    },
    // 默认选中两个月的
    getdatanew () {
      let nowdata = new Date();
      this.arrnew[0].date = getNewDate(nowdata);
      this.arr[0].date = beforeOneMonth(nowdata);
      this.$refs.tMonthAgo.ChoseMonth(beforeOneMonth(nowdata));
      this.$refs.nowDate.ChoseMonth(getNewDate(nowdata));
      console.log(this.arrnew);
      console.log(this.arr);

    },
    // 获取里面碑中的所有数据
    getMilestoneList () {
      let projectid = this.$store.state.user.projectId;
      let temobj = { projectId: projectid };
      this.$http.milestone
        .getMilestoneList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              console.log(res.data);
              let tempobj = res.data.content;
              let temprecords = res.data.content.records;
              this.getmilestonedata = res.data.content.records;
              let tepmgetmilestonedata = this.getmilestonedata;
              this.titleChange("全部");
              for (let i = 0; i < tepmgetmilestonedata.length; i++) {
                if (tepmgetmilestonedata[i].status == 2) {
                  tepmgetmilestonedata[i].statusname = "已完成";
                  tepmgetmilestonedata[i].checkedstatus = true;
                } else {
                  tepmgetmilestonedata[i].statusname = "未完成";
                  tepmgetmilestonedata[i].checkedstatus = false;
                }
              }
              console.log(this.getmilestonedata);
              let temptitleList = this.titleList;
              if (temprecords.length != "0") {
                for (let i = 0; i < temprecords.length; i++) {
                  let tempdata = getDate(
                    "yyyy-mm-dd",
                    temprecords[i].createTime
                  ).substring(0, 10);
                  temprecords[i].whatdayweek = getWeek(tempdata);
                  let tempmonth = getDate(
                    "yyyy-mm-dd",
                    temprecords[i].createTime
                  ).substring(5, 7);
                  temprecords[i].whatmonth = tempmonth.replace(/\b(0+)/gi, "");
                  let tempday = getDate(
                    "yyyy-mm-dd",
                    temprecords[i].createTime
                  ).substring(8, 10);
                  temprecords[i].whatday = tempday.replace(/\b(0+)/gi, "");
                  let tempremain = temprecords[i].remain + "";
                  temprecords[i].remain = tempremain.replace(/-/g, "");
                  // console.log(tempmonth)
                }
              }
              console.log(this.getmilestonedata);
              for (let i = 0; i < temptitleList.length; i++) {
                if (temptitleList[i].title == "全部") {
                  temptitleList[i].num = tempobj.total;
                } else if (temptitleList[i].title == "未完成") {
                  temptitleList[i].num = tempobj.unFinish;
                } else if (temptitleList[i].title == "逾期") {
                  temptitleList[i].num = tempobj.later;
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
        .catch(function (error) {
          console.log(error);
        });
    },
    format (percentage) {
      return percentage === 100 ? "100%" : `${percentage}%`;
    },
    clickDay (data) {
      console.log(data, this.arrnew); //选中某天
    },
    clickDaynew (data) {
      console.log(data, this.arr); //选中某天
    },
    changeDate (data) {
      //console.log(data); //左右点击切换月份
    },
    SortPro () { },
    // 全部/未完成/逾期/日程表/部分切换
    titleChange (title) {
      //console.log(title);
      if (title == "全部") {
        this.status = "0";
      } else if (title == "未完成") {
        this.status = "1";
      } else if (title == "逾期") {
        this.status = "2";
      }
      this.titleList.map(item => {
        if (item.title == title) item.active = true;
        else item.active = false;
      });
      switch (title) {
        case "全部":
          this.allTask();
          break;
        case "未完成":
          this.unfinished();
          break;
        case "逾期":
          this.beOverdue();
          break;
        // case "日程表":
        //   this.agenda();
        //   break;
      }
      // this.getMilestoneList();
    },
    // 全部任务
    allTask () {
      // console.log(this.getmilestonedata);
      // console.log(this.getmilestonedatanew);
      this.getmilestonedatanew = this.getmilestonedata;
    },
    // 未完成
    unfinished () {
      this.getmilestonedatanew = this.getmilestonedata.filter(
        item => item.status === 1
      );
    },
    // 逾期
    beOverdue () {
      this.getmilestonedatanew = this.getmilestonedata.filter(
        item => item.finishStatus === 1
      );
      // console.log("逾期");
    }
    // 日程表
    // agenda() {
    //   console.log("日程表");
    // }
  },
  components: { Calendar }
};
</script>
<style scoped>
.milePost {
  height: auto;
}
.milePost .mileTitle {
  padding: 20px 0;
  display: flex;
}
.milePost .mileTitle > div {
  padding-right: 35px;
  color: #3b404f;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}
.milePost .mileTitle div.actived {
  color: #7b7de5;
}
.milePost .mileTitle div.actived div:first-child {
  margin-bottom: -7px;
}
.milePost .mileTitle > div span.nums {
  padding-left: 2px;
}
.milePost .mileTitle .el-button {
  background: #7b7de5;
  color: #ffffff;
  margin-left: 8px;
  margin-top: -5px;
  height: 30px;
}
.milePost .mileComent {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}
.milePost .mileComent .coment {
  width: 62%;
  border-radius: 4px;
}
.milePost .mileComent .coment .comentList {
  padding: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  margin-bottom: 15px;
}
.milePost .mileComent .coment .comentList .comentLf {
  width: 70%;
  display: flex;
}
.milePost .mileComent .coment .comentList .comentLf .dateMsg {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  color: #878ea1;
  font-size: 11px;
  text-align: center;
  background: #ebebf3;
  margin-right: 20px;
}
.milePost .mileComent .coment .comentList .comentLf .dateMsg > div:first-child {
  height: 26px;
  /* line-height: 20px; */
  background: #fb5f5a;
  color: #ffffff;
  /* opacity: 0.7; */
  font-size: 12px;
  line-height: 28px;
  margin-bottom: 3px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.milePost .mileComent .coment .comentList .comentLf .dateMsg strong {
  color: #3b404f;
  font-size: 20px;
}
.milePost .mileComent .coment .comentList .comentLf .comentDes {
  font-size: 11px;
  color: #878ea1;
  flex: 1;
}
.milePost
  .mileComent
  .coment
  .comentList
  .comentLf
  .comentDes
  .projectProgress {
  height: 18px;
  line-height: 18px;
  color: #484d5e;
}
.milePost
  .mileComent
  .coment
  .comentList
  .comentLf
  .comentDes
  .projectProgress
  .el-row--flex.is-justify-space-between {
  align-items: center;
}
.milePost
  .mileComent
  .coment
  .comentList
  .comentLf
  .comentDes
  > p.timeRemaining[data-v-3a11c075]
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner.timeRemaining[data-v-3a11c075]
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
  font-size: 15px;
  color: #3b404f;
  line-height: 36px;
}
.timeConment /deep/ .el-icon-alarm-clock:before {
  font-size: 14px;
}
.timeTable /deep/ .wh_content_item .wh_top_tag {
  color: #3b404f;
}
.timeTable /deep/ .wh_content_item .wh_item_date {
  color: #878ea1;
}
/* .timeRemaining
  /deep/
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
  background-color: none;
  border-color: none;
  width: 16px;
  height: 16px;
  /* vertical-align: middle; */
/* background: url(../../assets/images/milestone/disabledcheckbox.png) no-repeat;
  background-size: 100% 100%;
} */
/* .timeRemaining /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, */
/* .timeRemaining /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: none !important;
  border-color: none !important;
  width: 16px;
  height: 16px;
  /* vertical-align: middle; */
/* background: url(../../assets/images/milestone/checkbox.png) no-repeat;
  background-size: 100% 100%;
} */
.milePost .mileComent .coment .comentList .comentLf .comentDes > .p-describe {
  height: 40px;
  max-height: 40px;
}
.milePost .mileComent .coment .comentList .timeRemaining {
  width: 12%;
  display: flex;
  flex-direction: column-reverse;
}
.milePost .mileComent .coment .comentList .timeRemaining {
  position: relative;
  font-size: 10px;
  color: #878ea1;
}
.milePost .mileComent .coment .comentList .el-icon-alarm-clock {
  font-size: 12px;
  padding-right: 5px;
}
.milePost .mileComent .timeTable {
  width: 36%;
}
/* 日历属性 */
.milePost .mileComent .timeTable .wh_container {
  border-radius: 4px;
  margin-bottom: 10px;
}
.milePost .mileComent .timeTable .wh_container /deep/ .wh_jiantou1,
.milePost .mileComent .timeTable .wh_container /deep/ .wh_jiantou2 {
  /* display: none; */
}
.milePost .mileComent .timeTable .wh_container /deep/ .wh_jiantou1 {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  background: url(../../assets/images/milestone/leftarrow.png) no-repeat;
  background-size: 100% 100%;
  border-top: none;
  border-left: none;
  transform: rotate(0deg);
  /* border-top: 2px solid #878EA1;
  border-left: 2px solid  #878EA1; */
}
.milePost .mileComent .timeTable .wh_container /deep/ .wh_jiantou2 {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  background: url(../../assets/images/milestone/rightarrow.png) no-repeat;
  background-size: 100% 100%;
  border-top: none !important;
  border-right: none !important;
  transform: rotate(0deg);
  /* border-top: 2px solid #878EA1;
  border-left: 2px solid  #878EA1; */
}
.milePost .mileComent .timeTable .wh_container /deep/ .wh_jiantou2 {
  border-top: 2px solid #878ea1;
  border-right: 2px solid #878ea1;
}
.timeTable /deep/ .wh_content_all {
  background: #ffffff;
}
.timeTable /deep/ .wh_content_item .wh_isToday,
.timeTable /deep/ .wh_content_item .wh_chose_day,
.timeTable /deep/ .wh_item_date:hover {
  background: #7b7de5;
  /* font-family: PingFangSC-Medium; */
  font-size: 16px;
  color: #ffffff;
  border-radius: 100px;
}
.timeTable /deep/ .wh_top_changge li {
  /* font-family: PingFangSC-Semibold; */
  font-size: 19px;
  color: #7b7de5;
  font-weight: initial !important;
}
.timeTable /deep/ .wh_content_item,
.timeTable /deep/ .wh_content_item_tag {
  /* font-family: PingFangSC-Medium; */
  font-size: 14px;
  color: #878ea1;
}
.timeTable /deep/ .wh_item_date,
.timeTable /deep/ .wh_top_tag {
  width: 42px;
  font-weight: initial !important;
}
/*自定义disabled的效果*/
/* .timeRemaining /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__input.is-disabled .el-checkbox__inner{
  background-color: none!important;
  border: none!important;
}
.timeRemaining /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: none!important;
  border: none!important;
}
.timeRemaining /deep/ .el-checkbox__input.is-checked{
  background-color: none!important;
  border: none!important;
}
.timeRemaining /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,.timeRemaining /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: none!important;
  border-color: none!important;
}
.timeRemaining /deep/ .el-checkbox__inner{
border: none!important;
}
.timeRemaining /deep/ .el-checkbox__inner::after{
border: none!important;
} */
.mileComent /deep/ .el-progress-bar .el-progress-bar__inner::after {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: #fff;
  line-height: 1;
  margin-top: -7px;
  margin-right: 1px;
  vertical-align: middle;
}
</style>
