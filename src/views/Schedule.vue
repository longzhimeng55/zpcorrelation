<template>
  <div class="schedule">
    <el-container>
      <el-header>
        <heads></heads>
      </el-header>
      <el-container>
        <el-aside>
          <!-- <div>
            <div class="allProject">
              <i class="el-icon-menu"></i
              >{{ this.$store.state.user.projectName }}
            </div>
            <div>
              <p>22222</p>
            </div>
          </div>
          <div class="addattention">
            <p>
              点击下方“添加关注”
            </p>
            <p>添加你所关心的人员或项目</p>
            <button>
              <i class="el-icon-user el-icon-add"></i><span>添加关注</span>
            </button>
          </div> -->
        </el-aside>
        <el-container>
          <el-main>
            <!-- <div class="member-btns">
              <el-button
                class="upDown"
                size="mini"
                round
                icon="el-icon-user el-icon-teamadd"
                @click="addschedule">添加</el-button
              >
            </div> -->
            <div class="fullcalendaroutline">
              <div class="member-btns">
                <el-button
                  class="upDown"
                  size="mini"
                  round
                  icon="el-icon-user el-icon-teamadd"
                  @click="addschedule"
                  >添加日程</el-button
                >
              </div>
              <div>
                <FullCalendar
                  class="fullcalendar"
                  ref="fullCalendar"
                  defaultView="dayGridMonth"
                  firstDay="1"
                  locale="zh-cn"
                  allDayText="全天"
                  slotDuration="00:30:00"
                  eventLimit="4"
                  :droppable="this.isdroppable == true ? true : false"
                  :editable="this.isdroppable == true ? true : false"
                  weekNumberCalculation="ISO"
                  :plugins="calendarPlugins"
                  :buttonText="buttonText"
                  :header="{
                    left: 'timeGridDay,dayGridMonth,timeGridWeek,',
                    center: 'prev,title,next',
                    right: ''
                  }"
                  handleWindowResize="true"
                  @changeMonth="changeMonth"
                  @dateClick="handleDateClick"
                  @eventClick="handleEventClick"
                  @dayClick="dayClick"
                  @datesRender="handleDatesRender"
                  @eventDrop="calendarEventDrop"
                  schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                  :events="monthData"
                />
              </div>
            </div>
          </el-main>
          <!-- <el-footer>Powered by RockYourTeam</el-footer> -->
        </el-container>
      </el-container>
    </el-container>
    <!--添加-->
    <div class="mydialog mydialognew mydialogdeep">
      <!-- 添加 -->
      <el-dialog
        title="添加日程"
        class=""
        :visible.sync="addschdialogVisible"
        width="610px"
        :close-on-click-modal="false"
        :before-close="addschhandleClose"
      >
        <el-form
          ref="addschdialogForm"
          :model="addschdialogForm"
          label-width="90px"
          :rules="addschrules"
        >
          <el-form-item label="日程标题" prop="title">
            <el-input
              v-model="addschdialogForm.title"
              placeholder="请输入日程标题"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <el-col style="width:183px">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="addschdialogForm.startTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="pickerBeginDateBefore"
                  placeholder="请选择开始时间"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="width:35px;padding-left:8px;text-align:center">至</el-col>
            <el-col style="width:183px">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="addschdialogForm.endTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="pickerOptionsEnd"
                  placeholder="请选择结束时间"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="width:73px;text-align:center" class="allday">
              <el-form-item prop="delivery" label="全天" style="width:30px;padding-left:5px;">
                <el-switch v-model="addschdialogForm.delivery"></el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
          <div class="mgb">日程参与人员</div>
          <div class="projectMsg">
            <el-input
              placeholder="通过姓名或邮箱查找成员"
              v-model="filterText"
            ></el-input>
            <el-tree
              class="filter-tree"
              :data="treedata"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              @check-change="getChecked"
              :default-expand-all="false"
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
          </div>
          <el-form-item label="对谁可见">
            <el-radio-group v-model="addschdialogForm.viewType">
              <el-radio label="1" value="1">仅我可见</el-radio>
              <el-radio label="2" value="2">同项目组可见</el-radio>
              <el-radio label="3" value="3">同一公司可见</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addschcancel('addschdialogForm')">取消</el-button>
          <el-button type="primary" @click="addschsave('addschdialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!--编辑-->
    <div class="mydialog mydialognew mydialogdeep">
      <!-- 编辑 -->
      <el-dialog
        title="编辑日程"
        class=""
        :visible.sync="editschdialogVisible"
        width="610px"
        :close-on-click-modal="false"
        :before-close="editschhandleClose"
      >
        <div class="dialogdropdown">
          <el-dropdown :hide-on-click="false" placement="bottom">
            <span class="el-dropdown-link">
              <i class="el-icon-more" title="更多"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdowncontent">
              <el-dropdown-item
                @click.native="deleteschedule(editschdialogForm.id)"
                >删除日程</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-form
          ref="editschdialogForm"
          :model="editschdialogForm"
          label-width="90px"
          :rules="editschrules"
        >
          <el-form-item label="日程标题" prop="title">
            <el-input
              v-model="editschdialogForm.title"
              placeholder="请输入日程标题"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <el-col style="width:183px">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="editschdialogForm.startTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="editpickerBeginDateBefore"
                  placeholder="请选择开始时间"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="width:35px;padding-left:8px;text-align:center">至</el-col>
            <el-col style="width:183px">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="editschdialogForm.endTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="editpickerOptionsEnd"
                  placeholder="请选择结束时间"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="width:73px;text-align:center" class="allday">
              <el-form-item prop="delivery" label="全天" style="width:30px;padding-left:5px;">
                <el-switch v-model="editschdialogForm.delivery"></el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
          <div class="mgb">日程参与人员</div>
          <div class="projectMsg">
            <el-input
              placeholder="通过姓名或邮箱查找成员"
              v-model="filterText"
            ></el-input>
            <el-tree
              class="filter-tree"
              :data="treedata"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              @check-change="editgetChecked"
              :default-checked-keys="defaultcheckeddata"
              :default-expand-all="false"
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
          </div>
          <el-form-item label="对谁可见">
            <el-radio-group v-model="editschdialogForm.viewType">
              <el-radio :label="1" value="1">仅我可见</el-radio>
              <el-radio :label="2" value="2">同项目组可见</el-radio>
              <el-radio :label="3" value="3">同一公司可见</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editschcancel('editschdialogForm')"
            >取消</el-button
          >
          <el-button type="primary" @click="editschsave('editschdialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <confirmDialogalldelete
      :isShowDialogalldelete="isShowDialogdeleteschedule"
      :content="this.deleteschedulecontent"
      @on-result-changealldelete="changeIsShowDialogdeleteschedule"
      @child-operation="operationdeleteschedule"
    >
    </confirmDialogalldelete>
  </div>
</template>
<script>
import Heads from "@/components/header/Header.vue";
// import FullCalendar from "@fullcalendar/vue";
// import dayGridPlugin from "@fullcalendar/daygrid";
import confirmDialogalldelete from "@/components/ConfirmDialogAlldelete.vue"; //组件放在的位置 根据实际修改
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import { getDate } from "@/libs/date.js";
export default {
  name: "project",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      formLabelWidth: "80px",
      addschdialogVisible: false,
      editschdialogVisible: false,
      isShowDialogdeleteschedule: false,
      deletescheduleid: "",
      deleteschedulecontent: "",
      // 树的输入框的字
      filterText: "",
      treedata: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tempschedule: [],
      // 编辑项目时默认选中
      defaultcheckeddata: "",
      addschdialogForm: {
        title: "",
        startTime: "",
        endTime: "",
        participateIds: "",
        viewType: ""
      },
      editschdialogForm: {
        title: "",
        startTime: "",
        endTime: "",
        participateIds: "",
        viewType: ""
      },
      addschrules: {
        title: [{ required: true, message: "请输入日程标题", trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
        viewType: [
          { required: true, message: "请选择对谁可见", trigger: "change" }
        ]
      },
      editschrules: {
        title: [{ required: true, message: "请输入日程标题", trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
        viewType: [
          { required: true, message: "请选择对谁可见", trigger: "change" }
        ]
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.addschdialogForm.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.addschdialogForm.startTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      editpickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.editschdialogForm.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      editpickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.editschdialogForm.startTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        interactionPlugin
      ],
      buttonText: {
        today: "今天",
        month: "月",
        week: "周",
        day: "日",
        list: "列表"
      },
      isdroppable: true,
      monthData: [],
      calendarEventDrop: info => {
        this.dropEvent(info);
      }
      // monthData: [
      //   {
      //     title: "eeeeeeeee", // 事件内容
      //     start: "2019-12-11 0:12:00", // 事件开始时间
      //     end: "2019-12-30 0:12:00", // 事件结束时间
      //   },
      //   {
      //     title: "sssss",
      //     start: "2019-12-25",
      //     end: "2019-12-30",
      //   },
      //   {
      //     title: "dddddddd",
      //     start: "2019-12-09",
      //     end: "2019-12-30",
      //   },
      //   {
      //     title: "cccccc",
      //     start: "2019-12-20",
      //     end: "2019-12-30",
      //   },
      //   {
      //     title: "aaaaaa",
      //     start: "2019-12-01",
      //     end: "2019-12-30",
      //   },
      //   {
      //     title: "bbbbbb",
      //     start: "2019-12-05",
      //     end: "2019-1-10",
      //   }
      // ]
    };
  },
  created() {
    let data = Date.parse(new Date());
    this.getMonthSchedule(data);
    this.getCompanylist();
  },
  components: { Heads, FullCalendar, confirmDialogalldelete },
  methods: {
    //拖动事件
    dropEvent(info) {
      let tempstarttime = info.event.start;
      let tempendTime = info.event.end;
      let tempstart = tempstarttime.getTime(tempstarttime);
      let tempend = tempendTime.getTime(tempendTime);
      //console.log(info);
      let tempobjnew = {
        id: info.event.id,
        title: info.event.title,
        startTime: tempstart,
        endTime: tempend
      };
      this.$http.schedule
        .editSchedule(tempobjnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.editschdialogForm.participateIds = "";
              this.editschdialogForm.viewType = "";
              let data = Date.parse(new Date());
              this.getMonthSchedule(data);
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
      // this.saveEvent();
    },
    addschedule() {
      this.getCompanylist();
      this.addschdialogVisible = true;
      this.addschdialogForm.startTime=new Date().getTime();
      this.addschdialogForm.endTime=new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
    },
    // 获取项目成员树的数据
    getCompanylist(params) {
      let userCompanyId = this.$store.state.user.userCompanyId;
      let temobj = { id: userCompanyId };
      this.$http.project
        .getCompanylist(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.treedata = res.data.content;
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
    // // 获取项目成员树的数据
    // getCompanylist() {
    //   let projectid = this.$route.query.id;
    //   if (projectid == undefined) {
    //     // 如果重新切换可能projectid找不到了
    //     projectid = this.$store.state.user.projectId;
    //   }
    //   let temobj = { projectId: projectid };
    //   this.$http.task
    //     .getProjectUser(temobj)
    //     .then(
    //       res => {
    //         if (res.data.ret == "0") {
    //           this.treedata = res.data.content;
    //         } else {
    //           this.$message({
    //             message: res.data.msg,
    //             type: "error"
    //           });
    //         }
    //       },
    //       error => {
    //         this.$message({
    //           message: "请求错误",
    //           type: "error"
    //         });
    //       }
    //     )
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    //项目成员的树
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取选中的key值
    getChecked() {
      let temparray = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes());
      let temparraynew = [];
      if (temparray.length != 0) {
        for (let i = 0; i < temparray.length; i++) {
          if (temparray[i].type == "2") {
            //type=1是部门，type=2是成员
            temparraynew.push(parseInt(temparray[i].id));
          }
        }
      }
      this.addschdialogForm.participateIds = "";
      //this.addschdialogForm.participateIds = temparraynew;
      this.addschdialogForm.participateIds = temparraynew.toString();
    },
    // 获取选中的key值
    editgetChecked() {
      let temparray = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes());
      let temparraynew = [];
      if (temparray.length != 0) {
        for (let i = 0; i < temparray.length; i++) {
          if (temparray[i].type == "2") {
            //type=1是部门，type=2是成员
            temparraynew.push(parseInt(temparray[i].id));
          }
        }
      }
      this.editschdialogForm.participateIds = "";
      //this.addschdialogForm.participateIds = temparraynew;
      this.editschdialogForm.participateIds = temparraynew.toString();
    },
    addschhandleClose() {
      this.$refs["addschdialogForm"].resetFields();
      this.addschdialogVisible = false;
      this.addschdialogForm.viewType = "";
    },
    editschhandleClose() {
      this.$refs["editschdialogForm"].resetFields();
      this.editschdialogVisible = false;
      this.editschdialogForm.viewType = "";
    },
    addschcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["addschdialogForm"].resetFields();
          this.addschdialogVisible = false;
          this.addschdialogForm.participateIds = "";
          this.addschdialogForm.viewType = "";
        } else {
          this.$refs["addschdialogForm"].resetFields();
          this.resetForm(formName);
          this.addschdialogVisible = false;
          this.addschdialogForm.participateIds = "";
          this.addschdialogForm.viewType = "";
        }
      });
    },
    editschcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["editschdialogForm"].resetFields();
          this.editschdialogVisible = false;
          this.editschdialogForm.participateIds = "";
          this.editschdialogForm.viewType = "";
        } else {
          this.$refs["editschdialogForm"].resetFields();
          this.resetForm(formName);
          this.editschdialogVisible = false;
          this.editschdialogForm.participateIds = "";
          this.editschdialogForm.viewType = "";
        }
      });
    },
    addschsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.addschdialogForm;
          this.$http.schedule
            .addSchedule(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  // let tempcontent = res.data.content.records;
                  this.resetForm(formName);
                  this.addschdialogVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  this.addschdialogForm.participateIds = "";
                  this.addschdialogForm.viewType = "";
                  let data = Date.parse(new Date());
                  this.getMonthSchedule(data);
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
    editschsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.editschdialogForm;
          this.$http.schedule
            .editSchedule(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  // let tempcontent = res.data.content.records;
                  this.resetForm(formName);
                  this.editschdialogVisible = false;
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.editschdialogForm.participateIds = "";
                  this.editschdialogForm.viewType = "";
                  let data = Date.parse(new Date());
                  this.getMonthSchedule(data);
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
    //删除日程
    deleteschedule(id) {
      this.$refs["editschdialogForm"].validate(valid => {
        if (valid) {
          this.$refs["editschdialogForm"].resetFields();
          this.editschdialogVisible = false;
          this.editschdialogForm.participateIds = "";
          this.editschdialogForm.viewType = "";
        } else {
          this.$refs["editschdialogForm"].resetFields();
          this.resetForm(formName);
          this.editschdialogVisible = false;
          this.editschdialogForm.participateIds = "";
          this.editschdialogForm.viewType = "";
        }
      });
      this.deletescheduleid = id;
      this.isShowDialogdeleteschedule = true;
      this.deleteschedulecontent = "确定要删除吗？";
    },
    changeIsShowDialogdeleteschedule(val) {
      this.isShowDialogdeleteschedule = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    operationdeleteschedule(type) {
      if (type == "confirm") {
        this.deleteSchedule();
        //点击确认要执行的代码
      } else if (type == "cancel") {
        this.deletescheduleid = "";
        this.isShowDialogdeleteschedule = false;
        //点击取消要执行的代码
      }
    },
    deleteSchedule() {
      let tempobjnew = { id: this.deletescheduleid };
      this.$http.schedule
        .deleteSchedule(tempobjnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialogdeleteschedule = false;
              this.deletescheduleid = "";
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.editschdialogForm.participateIds = "";
              this.editschdialogForm.viewType = "";
              let data = Date.parse(new Date());
              this.getMonthSchedule(data);
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    defaultchecked(data) {
      this.defaultcheckeddata = "";
      this.defaultcheckeddata = data;
      console.log(this.defaultcheckeddata);
    },
    handleDatesRender(arg) {
      console.log(arg);
      // console.log(arg.view.currentStart);
      let tempstarttime = arg.view.currentStart;
      let temptime = tempstarttime.getTime(tempstarttime);
      console.log(temptime);
      if (arg.view.viewSpec.buttonTextDefault == "day") {
        this.isdroppable = false;
        this.getDaySchedule(temptime);
      } else if (arg.view.viewSpec.buttonTextDefault == "month") {
        this.isdroppable = true;
        this.getMonthSchedule(temptime);
      } else if (arg.view.viewSpec.buttonTextDefault == "week") {
        this.isdroppable = false;
        this.getWeekSchedule(temptime);
      }
      // this.getMonthSchedule(temptime);
      //console.log(arg.currentEnd);
    },
    // 选择月份
    changeMonth(start, end, current) {
      console.log(start, end, current);
    },
    //点击天,添加内容
    handleDateClick(arg) {
      this.getCompanylist();
      //  if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      //   this.monthData.push({ // add new event data
      //     title: 'New Event',
      //     start: arg.date,
      //     allDay: arg.allDay
      //   })
      //   //this.calendarApi.refetchEvents()
      // }
      this.addschdialogVisible = true;
    },
    handleEventClick(info) {
      console.log(info);
      // console.log(info.event.id);
      this.editschdialogForm = this.tempschedule.find(
        item => item.id == info.event.id
      );
      console.log(this.editschdialogForm);
      let temptreecheckeddata;
      if (
        this.editschdialogForm.participateIds != null &&
        this.editschdialogForm.participateIds.length != 0
      ) {
        temptreecheckeddata = this.editschdialogForm.participateIds.split(",");
        this.defaultchecked(temptreecheckeddata);
      } else {
        this.defaultchecked();
      }
      this.editschdialogVisible = true;
    },
    dayClick(e, js) {
      console.log(e, js);
    },
    //获取月的数据
    getMonthSchedule(data) {
      let datanew = getDate("yyyy-mm-dd", data);
      let tempobjnew = { startTime: datanew };
      this.$http.schedule
        .getByMonthSchedule(tempobjnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              //为了在编辑的时候过滤数据用
              this.tempschedule = res.data.content;
              let tempcontent = res.data.content;
              if (tempcontent.length != 0) {
                let temparray = [];
                for (let i = 0; i < tempcontent.length; i++) {
                  let tempobj = {};
                  tempobj.title = tempcontent[i].title;
                  tempobj.start = tempcontent[i].startTime;
                  tempobj.end = tempcontent[i].endTime;
                  tempobj.id = tempcontent[i].id;
                  temparray.push(tempobj);
                  // tempobj.start = "2019-12-11";
                  // tempobj.end = "2019-12-30";
                }
                console.log(temparray);
                this.monthData = temparray;
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
    //获取日试图的数据
    getDaySchedule(data) {
      let datanew = getDate("yyyy-mm-dd", data);
      let tempobjnew = { startTime: datanew };
      this.$http.schedule
        .getByDaySchedule(tempobjnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              //为了在编辑的时候过滤数据用
              this.tempschedule = res.data.content;
              let tempcontent = res.data.content;
              if (tempcontent.length != 0) {
                let temparray = [];
                for (let i = 0; i < tempcontent.length; i++) {
                  let tempobj = {};
                  tempobj.title = tempcontent[i].title;
                  tempobj.start = tempcontent[i].startTime;
                  tempobj.end = tempcontent[i].endTime;
                  tempobj.id = tempcontent[i].id;
                  temparray.push(tempobj);
                  // tempobj.start = "2019-12-11";
                  // tempobj.end = "2019-12-30";
                }
                console.log(temparray);
                this.monthData = temparray;
              }
              console.log(this.monthData);
              // this.monthData = [
              //   {
              //     title: "eeeeeeeee", // 事件内容
              //     start: "2019-12-11 0:12:00", // 事件开始时间
              //     end: "2019-12-30 0:12:00" // 事件结束时间
              //   },
              //   {
              //     title: "sssss",
              //     start: "2019-12-25",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "dddddddd",
              //     start: "2019-12-09",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "cccccc",
              //     start: "2019-12-20",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "aaaaaa",
              //     start: "2019-12-01",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "bbbbbb",
              //     start: "2019-12-05",
              //     end: "2019-1-10"
              //   }
              // ];
              //this.monthData=tempcontent;
              console.log(this.monthData);
              // this.getTeamList();
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
    //获取周的数据
    getWeekSchedule(data) {
      let datanew = getDate("yyyy-mm-dd", data);
      let tempobjnew = { startTime: datanew };
      this.$http.schedule
        .getByWeekSchedule(tempobjnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              //为了在编辑的时候过滤数据用
              this.tempschedule = res.data.content;
              let tempcontent = res.data.content;
              if (tempcontent.length != 0) {
                let temparray = [];
                for (let i = 0; i < tempcontent.length; i++) {
                  let tempobj = {};
                  tempobj.title = tempcontent[i].title;
                  tempobj.start = tempcontent[i].startTime;
                  tempobj.end = tempcontent[i].endTime;
                  tempobj.id = tempcontent[i].id;
                  temparray.push(tempobj);
                  // tempobj.start = "2019-12-11";
                  // tempobj.end = "2019-12-30";
                }
                console.log(temparray);
                this.monthData = temparray;
              }
              console.log(this.monthData);
              // this.monthData = [
              //   {
              //     title: "eeeeeeeee", // 事件内容
              //     start: "2019-12-11 0:12:00", // 事件开始时间
              //     end: "2019-12-30 0:12:00" // 事件结束时间
              //   },
              //   {
              //     title: "sssss",
              //     start: "2019-12-25",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "dddddddd",
              //     start: "2019-12-09",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "cccccc",
              //     start: "2019-12-20",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "aaaaaa",
              //     start: "2019-12-01",
              //     end: "2019-12-30"
              //   },
              //   {
              //     title: "bbbbbb",
              //     start: "2019-12-05",
              //     end: "2019-1-10"
              //   }
              // ];
              //this.monthData=tempcontent;
              console.log(this.monthData);
              // this.getTeamList();
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
/* .schedule,
.schedule /deep/ .el-container.is-vertical {
  height: 100%;
} */
.schedule /deep/ .el-header {
  padding: 0;
  height: auto !important;
  background: #7b7de5;
}
.schedule /deep/ .el-aside {
  width: 0px !important;
  /* width: 18% !important;
  background: #484d5e; */
}
.schedule /deep/ .el-footer {
  padding: 0;
  background: #e8e9ed;
  line-height: 60px;
  text-align: center;
  color: #878ea1;
}
.allProject {
  height: 70px;
  padding: 26px 0 0 29px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 14px;
  background: #3b404f;
  cursor: pointer;
}
.allProject .el-icon-menu {
  margin-right: 12px;
  font-size: 18px;
  vertical-align: middle;
  margin-top: -3px;
}
.addattention {
  position: absolute;
  text-align: center;
  bottom: 20px;
  /* left: 4.1%; */
  left: 48px;
}
.addattention p {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 20px;
}
.addattention p:nth-child(2) {
  margin-bottom: 5px;
}
.addattention button {
  display: inline-block;
  /* width: 110px; */
  padding: 10px 30px;
  border: none;
  outline: 0;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #ffffff;
  background: #7b7de5;
  border-radius: 4px;
  text-align: center;
  margin: 0 auto;
}
.el-icon-user:before {
  content: "";
}
.el-icon-user {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-top: -3px;
  vertical-align: middle;
}
.el-icon-user.el-icon-add {
  background: url(../assets/images/task/add.png) no-repeat;
  background-size: 14px 14px;
  margin-right: 5px;
}
.red {
  background: red;
}
.blue {
  background: blue;
}
.tasktime {
  display: table;
}
.seemStyle {
  padding-left: 10px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #878ea1;
}
.allday /deep/ .el-form-item__label,
.allday /deep/ .el-form-item {
  width: 37px !important;
  padding-right: 0px;
}
.allday /deep/ .el-form-item__content {
  margin-left: 42px !important;
}
.mgb {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
  line-height: 30px;
  margin-bottom: 15px;
  padding: 0px 20px 3px 20px;
}
.mydialogdeep /deep/ .projectMsg {
  min-height: 150px;
  border: 1px solid #e5e9f6;
  border-radius: 4px;
  padding: 15px 30px 15px 15px;
  margin-bottom: 15px;
  margin-left: 20px;
}
.mydialogdeep .dialogdropdown {
  position: absolute;
  top: 12px;
  right: 60px;
}
.mydialogdeep /deep/ .el-dialog__body .el-form .el-date-editor.el-input {
    width: 190px!important;
}
.dropdowncontent {
  width: 100px;
  font-size: 14px;
  padding: 0px;
}
/*自定义页面样式*/
.fullcalendaroutline {
  background: #fff;
  padding: 15px 15px;
  /* overflow: auto; */
  width: 98%;
  overflow-x: hidden;
  min-height: 45%;
  height: 700px;
  max-height: 87%;
  position: relative;
}
.fullcalendaroutline /deep/ .fc-center div .fc-button {
  display: inline-block !important;
}
.fullcalendaroutline /deep/ .fc-toolbar h2 {
  display: inline-block !important;
  vertical-align: middle;
  margin-left: 3px;
  margin-right: 3px;
  color: #3b404f;
  font-size: 18px;
}
.fullcalendaroutline /deep/ .fc-center .fc-button-primary {
  color: #2c3e50;
  background-color: #fff;
  border: none !important;
  outline: none !important;
}
.fullcalendaroutline /deep/ .fc-center .fc-button-primary:focus {
  outline: none;
  box-shadow: none !important;
} /*for IE*/
.fullcalendaroutline /deep/ .fc-center .fc-button-primary::-moz-focus-inner {
  border-color: transparent;
  box-shadow: none !important;
} /*for mozilla*/
.member-btns {
  padding-top: 10px;
  padding-left: 10px;
  background: #fff;
  text-align: left;
  line-height: 1;
  height: 45px;
  vertical-align: middle;
  margin-bottom: 5px;
}
.member-btns > .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.member-btns > .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
}
.member-btns > .el-button {
  background: #7b7de5;
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  padding: 8px 15px;
  border: 1px solid #7b7de5;
}
.member-btns /deep/ .el-icon-user:before {
  content: "" !important;
}
.member-btns /deep/ .el-icon-user {
  display: inline-block;
  vertical-align: middle;
  width: 15px;
  height: 15px;
  margin-top: -3px;
}
.member-btns /deep/ .el-icon-user.el-icon-teamadd {
  background: url(../assets/images/team/teamadd.png) no-repeat;
  background-size: 100% 100%;
}
/*自定义样式*/
/* .fullcalendaroutline /deep/ .fc-day-header.fc-widget-header.fc-fri,
.fullcalendaroutline /deep/ .fc-row.fc-widget-header table thead tr {
  border-color: #fff !important;
}
.fullcalendaroutline
  /deep/
  .fc-ltr
  .fc-dayGrid-view
  .fc-day-top
  .fc-day-number {
  float: left;
  margin: 10px 10px;
  padding: 8px;
}
.fullcalendaroutline /deep/ .fc-unthemed td.fc-today{
  background: inherit;
}
.fullcalendaroutline /deep/ .fc-day-top.fc-fri.fc-today .fc-day-number {
  display: inline-block;
  background: #7b7de5;
  border-radius: 50%;
  font-family: PingFangSC-Regular;
  color: #ffffff;
}
.fullcalendaroutline /deep/ .fc th{
    border:1px solid #fff!important;
    padding: 0;
    vertical-align: top;
}
.fullcalendaroutline /deep/ .fc td{
    border-left: 1px solid #E5E9F6!important;
    padding: 0;
    vertical-align: top;
}
.fullcalendaroutline /deep/ .fc thead tr td{
  border-top: 1px solid #E5E9F6!important;
  border-bottom: 1px solid #fff!important;
}
.fullcalendaroutline /deep/ .fc table{
  border: none!important;
}
.fc-view, .fc-view > table{
  border:1px solid #fff!important;
}
.fc-unthemed th {
  border-color: #fff !important;
} */
.fullcalendaroutline
  /deep/
  .fc-ltr
  .fc-dayGrid-view
  .fc-day-top
  .fc-day-number {
  float: left;
  margin: 10px 10px;
  padding: 8px;
}
.fullcalendaroutline /deep/ .fc-unthemed td.fc-today {
  background: inherit;
}
.fullcalendaroutline /deep/ .fc-day-top.fc-fri.fc-today .fc-day-number {
  display: inline-block;
  background: #7b7de5;
  border-radius: 50%;
  font-family: PingFangSC-Regular;
  color: #ffffff;
}
.fullcalendaroutline /deep/ .fc-row.fc-week.fc-widget-content.fc-rigid {
  cursor: pointer;
}
.fullcalendaroutline /deep/ .fc-dayGridMonth-button.fc-button.fc-button-primary,
.fullcalendaroutline /deep/ .fc-timeGridWeek-button.fc-button.fc-button-primary,
.fullcalendaroutline /deep/ .fc-timeGridDay-button.fc-button.fc-button-primary {
  color: #878ea1 !important;
  background: #ffffff !important;
  border: 1px solid #878ea1 !important;
  font-size: 13px;
}
.fullcalendaroutline
  /deep/
  .fc-timeGridWeek-button.fc-button.fc-button-primary.fc-button-active,
.fullcalendaroutline
  /deep/
  .fc-timeGridDay-button.fc-button.fc-button-primary.fc-button-active,
.fullcalendaroutline
  /deep/
  .fc-dayGridMonth-button.fc-button.fc-button-primary.fc-button-active {
  background: #7b7de5 !important;
  color: #ffffff !important;
  border: 1px solid #7b7de5 !important;
  font-size: 13px;
}
.fullcalendaroutline /deep/ .fc-button-primary:not(:disabled):active:focus,
.fullcalendaroutline
  /deep/
  .fc-button-primary:not(:disabled).fc-button-active:focus {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.fullcalendaroutline
  /deep/
  .fc-row.fc-widget-header
  table
  thead
  tr:first-child {
  line-height: 45px;
  border: 1px solid #fff;
}
.fullcalendaroutline
  /deep/
  .fc-row.fc-widget-header
  table
  thead
  tr:first-child
  th {
  text-align: left;
  margin: 10px 10px;
  padding-left: 20px;
  border: 1px solid #fff;
}
.fullcalendaroutline
  /deep/
  .fc-row.fc-widget-header
  table
  thead
  tr:first-child
  th
  span {
  color: #3b404f;
}
.fullcalendaroutline /deep/ .fc-icon-chevron-left:before,
.fullcalendaroutline /deep/ .fc-icon-chevron-right:before {
  color: #878ea1;
}
.fullcalendaroutline /deep/ .fc-head-container.fc-widget-header {
  /* border:1px solid #fff;
    border-bottom:1px solid #E5E9F6; */
}
.fullcalendaroutline /deep/ .fc-content-skeleton table thead tr td {
  border: 1px solid #e5e9f6;
  border-bottom: none;
}
.fullcalendaroutline /deep/ .fc-day-top.fc-thu.fc-today .fc-day-number {
  display: inline-block;
  background: #7b7de5;
  border-radius: 50%;
  font-family: PingFangSC-Regular;
  color: #ffffff;
}
.fullcalendaroutline /deep/ .fc-time-grid .fc-slats table tbody tr,
.fullcalendaroutline /deep/ .fc-time-grid .fc-slats table tbody tr.fc-minor {
  line-height: 35px;
  height: 35px;
  color: #878ea1;
}
.fullcalendaroutline /deep/ .fc-event,
.fullcalendaroutline /deep/ .fc-event-dot {
  /* opacity: 0.1; */
  /* border: 1px solid #e5e9f6; */
  border: none;
  background: #f8f8ff;
  color: #3b404f;
  line-height: 25px;
}
.fullcalendaroutline /deep/ .fc-divider.fc-widget-header {
  border-color: #e5e9f6;
  padding: 0px;
  margin: 0px;
}
.fullcalendaroutline /deep/ .fc-time-grid .fc-slats .fc-minor td {
  border: 1px solid #e5e9f6;
}
.fullcalendaroutline /deep/ .fc-head-container.fc-widget-header {
  border-color: #e5e9f6;
}
.fullcalendaroutline /deep/ .fc .fc-row .fc-content-skeleton table,
.fullcalendaroutline /deep/ .fc .fc-row .fc-content-skeleton td,
.fullcalendaroutline /deep/ .fc .fc-row .fc-mirror-skeleton td {
  border-color: #e5e9f6;
}
.fullcalendaroutline /deep/ .fc-unthemed th,
.fullcalendaroutline /deep/ .fc-unthemed td,
.fullcalendaroutline /deep/ .fc-unthemed thead,
.fullcalendaroutline /deep/ .fc-unthemed tbody,
.fullcalendaroutline /deep/ .fc-unthemed .fc-divider,
.fullcalendaroutline /deep/ .fc-unthemed .fc-row,
.fullcalendaroutline /deep/ .fc-unthemed .fc-content,
.fullcalendaroutline /deep/ .fc-unthemed .fc-popover,
.fullcalendaroutline /deep/ .fc-unthemed .fc-list-view,
.fullcalendaroutline /deep/ .fc-unthemed .fc-list-heading td {
  border-color: #e5e9f6;
}
.fullcalendaroutline
  /deep/
  .fc-head-container.fc-widget-header
  .fc-row.fc-widget-header {
  border-color: #e5e9f6;
}
.fullcalendaroutline /deep/ .fc-day-grid-event .fc-time,
.fullcalendaroutline /deep/ .fc-day-grid-event .fc-title {
  display: inline-block;
  padding: 3px;
  color: #7b7de5;
}
.fullcalendaroutline /deep/ .fc-row.fc-rigid .fc-content-skeleton a.fc-more {
  color: #7b7de5;
}
.fullcalendaroutline /deep/ .fc-popover.fc-more-popover {
  border-radius: 5px;
}
.fullcalendaroutline
  /deep/
  .fc-popover.fc-more-popover
  .fc-header.fc-widget-header {
  padding: 10px 20px 10px 10px;
  height: 24px;
  background: none;
  /* background: #e5e9f6; */
  border-bottom: 1px solid #e5e9f6 !important;
}
.fullcalendaroutline
  /deep/
  .fc-popover.fc-more-popover
  .fc-header.fc-widget-header
  .fc-title {
  font-size: 14px;
  font-weight: 600;
}
.fullcalendaroutline /deep/ .fc-icon-x:before,
.fullcalendaroutline /deep/ .fc-icon-x:after {
  content: "";
}
.fullcalendaroutline /deep/ .fc-icon-x {
  width: 15px;
  height: 15px;
  /* margin-right: 8px; */
  margin-top: -15px;
  vertical-align: middle;
  background: url(../assets/images/common/dialogclose.png) no-repeat;
  background-size: 100% 100%;
}
.fullcalendaroutline /deep/ .fc-toolbar .fc-left {
  position: relative;
  left: 132px;
  float: initial;
}
.fullcalendaroutline .member-btns {
  position: absolute;
  top: 3px;
}
.fullcalendaroutline /deep/ tr:first-child > td > .fc-day-grid-event {
  border-left: none;
  border-right: none;
  border-bottom: none;
}
.fullcalendaroutline /deep/ .fc-ltr .fc-h-event.fc-not-end {
  border-left: none;
  border-right: none;
  border-bottom: none;
  border-top: 1px solid #ffffff;
}
.fullcalendaroutline /deep/ .fc-day-grid-event{
  padding:0px;
  margin:0px;
}
.fullcalendaroutline /deep/ .fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end{
  /* border: 1px solid #e5e9f6; */
  border:none;
  border-bottom: 1px solid #fff;
}
.fullcalendaroutline /deep/ .fc-event-container .fc-content{
  /* border-color:#e5e9f6; */
  border:none;
  border-bottom: 1px solid #fff;
}
.fullcalendaroutline /deep/ .fc-row.fc-week.fc-widget-content.fc-rigid .fc-content-skeleton table tbody tr td.fc-event-container{
  /* border:1px solid#e5e9f6!important; */
  border:none;
}
.fullcalendaroutline /deep/ .fc-unthemed td.fc-today,
.fullcalendaroutline /deep/ .fc-time-grid .fc-content-col {
  cursor: pointer;
}
.fullcalendaroutline
  /deep/
  .fc-timeGrid-view
  .fc-day-grid
  .fc-row
  .fc-content-skeleton {
  display: none;
}
.mydialog /deep/ .el-switch.is-checked .el-switch__core {
  border-color: #7b7de5;
  background-color: #7b7de5;
}
.mydialog /deep/ .el-dialog .el-dialog__body {
  padding: 15px 20px 15px 8px;
}
.mydialog /deep/ .el-checkbox-button__inner,
.mydialog /deep/ .el-radio {
  font-weight: initial;
}
.mydialog /deep/ .el-dialog .el-dialog__body {
  padding: 15px 20px 0px 8px;
}
/*PC端响应式媒体查询*/
@media (min-width: 1024px) {
} /*>=1024的设备*/

@media (min-width: 1100px) {
} /*>=1024的设备*/
@media (min-width: 1280px) {
}

@media (min-width: 1366px) {
}

@media (min-width: 1440px) {
  .fullcalendaroutline {
    max-height: 99%;
    height:695px;
  }
}

@media (min-width: 1680px) {
  .fullcalendaroutline {
    max-height: 67%;
    height:480px;
  }
}
@media (min-width: 1920px) {
  .fullcalendaroutline {
    max-height: 99%;
  }
}
</style>
