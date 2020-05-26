<template>
  <div class="systemNoti">
    <div class="system-titler">
      <el-row :gutter="11">
        <el-col :span="6">
          <div>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="3">
                <span>标题:</span>
              </el-col>
              <el-col :span="24">
                <el-input
                  v-model="ruleform.content"
                  placeholder="请输入标题"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="system-btns">
            <el-button @click="search('ruleform')">查询</el-button>
            <el-button @click="resetFormnew('ruleform')">清除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="system-button member-btns">
      <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamadd"
        @click="addteammsg"
        >添加</el-button
      >
      <!-- <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamdelete"
        @click="onDeldata"
        :disabled="this.sels.length === 0"
        >删除</el-button
      > -->
      <!-- <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamedit"
        >编辑</el-button
      >
      <!-- <el-button class="upDown seemBtn" size="mini" round icon>废弃</el-button> -->
      <!-- <el-button class="upDown seemBtn" size="mini" round icon>发送</el-button> -->
    </div>
    <div>
      <div class="tablenew">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="" label="" width="15"></el-table-column>
          <el-table-column label="标题" width="400">
            <template slot-scope="scope">
              <span class="spannamenew" style="margin-left:0px">{{
                scope.row.content
              }}</span>
              <div class="tableopt">
                <!-- <i class="seemIcon el-icon-edit-outline" title="编辑" @click="edittable(scope.row)"></i> -->
                <i
                  class="seemIcon el-icon-delete"
                  @click.stop="handleDelete(scope.$index, scope.row)"
                  title="删除"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">{{ "群发" }}</span>
              <span v-if="scope.row.type == 2">{{ "指定用户" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">{{ "新建" }}</span>
              <span v-if="scope.row.type == 2">{{ "已发送" }}</span>
              <span v-if="scope.row.type == 3">{{ "发送失败" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发送时间">
            <template slot-scope="scope">
              <span>{{ scope.row.sendTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="作者"></el-table-column>
        </el-table>
      </div>
      <div class="list_page pagination" v-if="totalRecord > 0">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord"
        ></el-pagination>
      </div>
    </div>
    <!--添加-->
    <div class="mydialog mydialognew">
      <!-- 添加成员信息 -->
      <el-dialog
        title="添加系统通知"
        class=""
        :visible.sync="adddialogVisible"
        width="510px"
        :close-on-click-modal="false"
        :before-close="addhandleClose"
      >
        <el-form
          ref="adddialogForm"
          :model="adddialogForm"
          label-width="90px"
          :rules="addrules"
        >
          <el-form-item label="通知标题" prop="content">
            <el-input
              v-model="adddialogForm.content"
              placeholder="请输入通知标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="通知类型" prop="type">
            <el-select
              placeholder="请选择通知类型"
              @change="handleChange"
              v-model="adddialogForm.type"
            >
              <el-option label="全部" value="1" key="1">全部</el-option>
              <el-option label="指定人员" value="2" key="2">指定人员</el-option>
            </el-select>
          </el-form-item>
          <div class="projectMsg" v-if="showcheckpeople == true">
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
            <div class="productVideo">
              <div class="personFind">
                如果您要找的人不在已有列表中,请点击
                <span>邀请</span>
              </div>
              <el-progress :text-inside="true" :stroke-width="10"></el-progress>
              <div class="pNumbers">
                <div>
                  成员数量
                  <span>1/10</span>
                </div>
                <div class="addCart">
                  <i class="el-icon-circle-plus-outline"></i>
                  增加成员上限
                </div>
              </div>
            </div>
          </div>
          <el-row style="margin-left:4px">
            <el-col style="width:188px">
              <el-form-item label="通知时间" prop="sendTime">
                <el-date-picker
                  v-model="adddialogForm.sendTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  placeholder="请输入开始时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addcancel('adddialogForm')">取消</el-button>
          <el-button type="primary" @click="addsave('adddialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <confirmDialog
      :isShowDialog="isShowDialog"
      :content="this.content"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
    </confirmDialog>
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
import confirmDialog from "@/components/ConfirmDialog.vue"; //组件放在的位置 根据实际修改
import confirmDialogalldelete from "@/components/ConfirmDialogAlldelete.vue"; //组件放在的位置 根据实际修改
import { formatDate } from "@/libs/date.js";
export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  data() {
    return {
      userName: "",
      radio: "",
      currentPage4: 1,
      pageNum: 1,
      pageSize: 10,
      currentPage1: "",
      totalPage: "",
      totalRecord: "",
      tableData: [],
      //删除相关的内容
      sels: [],
      isShowDialogalldelete: false,
      alldeletecontent: "",
      ruleform: {
        content: "",
        type: "",
        user: "",
        sendTime: ""
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      treedata: [],
      filterText: "",
      //删除文件的id
      filesid: "",
      isShowDialog: false,
      showcheckpeople: false,
      content: "",
      adddialogVisible: false,
      adddialogForm: {
        content: "",
        type: "",
        user: "",
        sendTime: ""
      },
      addrules: {
        content: [{ required: true, message: "请输入标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择通知类型", trigger: "blur" }],
        sendTime: [
          { required: true, message: "请选择通知时间", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCompanylist();
    this.getlistdata();
  },
  methods: {
    handleCurrentChange(row, event, column) {
      if (row.tick == undefined || row.tick == false) {
        row.tick = true;
        this.$refs.multipleTable.toggleRowSelection(row, true); //点击选中
      } else {
        row.tick = false;
        this.$refs.multipleTable.toggleRowSelection(row, false); //点击选中
      }
    },
    //删除文件
    handleDelete(index, item) {
      this.sels = [];
      this.sels.push(item.id);
      this.isShowDialogalldelete = true;
      this.alldeletecontent = "确定要删除吗？";
    },
    // 选中某一项的时候触发
    selsChange(sels) {
      console.log(sels);
      this.sels = sels.map(sels => sels.id);
      // console.log(this.sels);
    },
    changeIsShowDialogalldelete(val) {
      //this.sels=[];
      this.isShowDialogalldelete = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    operationalldelete(type) {
      if (type == "confirm") {
        this.daleteprojectallfiles();
        //点击确认要执行的代码
      } else if (type == "cancel") {
        this.isShowDialogalldelete = false;
        //点击取消要执行的代码
      }
    },
    daleteprojectallfiles() {
      let temobj = this.sels;
      //console.log(this.sels);
      this.$http.team
        .deleteTeamNotice(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialogalldelete = false;
              this.$message({
                message: "删除文件成功",
                type: "success"
              });
              this.sels = [];
              this.getlistdata();
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
    // 删除按钮批量删除数据
    onDeldata() {
      this.sels.map(item => item.id);
      this.isShowDialogalldelete = true;
      this.alldeletecontent = "确定要删除吗？";
    },
    addhandleClose() {
      this.$refs["adddialogForm"].resetFields();
      this.adddialogVisible = false;
      this.showcheckpeople=false;
    },
    addcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["adddialogForm"].resetFields();
          this.adddialogVisible = false;
          this.showcheckpeople=false;
        } else {
          this.$refs["adddialogForm"].resetFields();
          this.resetForm(formName);
          this.adddialogVisible = false;
          this.showcheckpeople=false;
        }
      });
    },
    addsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.adddialogForm;
          this.$http.team
            .addTeamNotice(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  let tempcontent = res.data.content.records;
                  this.resetForm(formName);
                  this.adddialogVisible = false;
                  this.showcheckpeople = false;
                  this.getlistdata();
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
    //重置表单元素
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取项目成员树的数据
    getCompanylist() {
      let projectid = this.$store.state.user.projectId;
      // 如果重新切换可能projectid找不到了
      let temobj = { projectId: projectid };
      this.$http.task
        .getProjectUser(temobj)
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
    handleChange(data) {
      console.log(data);
      if (data == 2) {
        this.showcheckpeople = true;
      } else {
        this.showcheckpeople = false;
      }
    },
    //项目成员的树
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取选中的key值
    getChecked(data, checked, node) {
      // let id;
      // if (checked) {
      //   this.$refs.tree.setCheckedNodes([data]);
      //   id = data.id;
      // }
      let temparray = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes());
      let temparraynew = [];
      if (temparray.length != 0) {
        for (let i = 0; i < temparray.length; i++) {
          // if (temparray[i].type == "2") {
          //type=1是部门，type=2是成员
          temparraynew.push(parseInt(temparray[i].id));
          // }
        }
      }
      // let temp = "";
      // for (let i = 0; i < temparraynew.length; i++) {
      //   temp += temparraynew[i] + ",";
      // }
      // let tempnew= temp.toString();
      this.adddialogForm.user = temparraynew.toString();
      //this.adddialogForm.user= id;
    },
    addteammsg() {
      this.adddialogVisible = true;
      this.adddialogForm.sendTime=new Date().getTime();
    },
    resetFormnew(formName) {
      this.ruleform = {
        content: ""
      };
    },
    handleDelete(index, row) {
      this.filesid = row.id;
      this.isShowDialog = true;
      this.content = "确定要删除该文件吗？";
    },
    changeIsShowDialog(val) {
      console.log(val);
      this.isShowDialog = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    operation(type) {
      if (type == "confirm") {
        this.daletesystemmsg();
        //点击确认要执行的代码
      } else if (type == "cancel") {
        this.isShowDialog = false;
        //点击取消要执行的代码
      }
    },
    daletesystemmsg() {
      let temobj = { id: this.filesid };
      this.$http.team
        .deleteTeamNotice(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialog = false;
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getlistdata();
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
    search() {
      this.pageSize = 10;
      this.pageNum = 1;
      let temobj = { pageSize: this.pageSize, pageNum: this.pageNum };
      temobj.entity = this.ruleform;
      this.$http.team
        .getTeamNotice(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content.records;
              this.pageNum = res.data.content.pageNum;
              this.pageSize = res.data.content.pageSize;
              this.totalPage = res.data.content.totalPage;
              this.totalRecord = res.data.content.totalRecord;
              this.tableData = tempcontent;
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
    getlistdata() {
      let tempagesize = this.pageSize;
      let temppagenum = this.pageNum;
      let temobj = { pageSize: tempagesize, pageNum: temppagenum };
      this.$http.team
        .getTeamNotice(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.filesbreadcrumb = [];
              let tempcontent = res.data.content.records;
              this.pageNum = res.data.content.pageNum;
              this.pageSize = res.data.content.pageSize;
              this.totalPage = res.data.content.totalPage;
              this.totalRecord = res.data.content.totalRecord;
              this.tableData = tempcontent;
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
    handleSizeChange1(pageSize) {
      // 每页条数切换
      this.pageSize = pageSize;
      this.handleCurrentChange1(this.pageNum);
    },
    handleCurrentChange1(currentPage) {
      //页码切换
      this.pageNum = currentPage;
      this.getlistdata();
      // this.currentChangePage(this.tableData, currentPage);
    },
    //分页方法（重点）
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tempList = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tempList.push(list[from]);
        }
      }
    }
  },
  components: { confirmDialog, confirmDialogalldelete }
};
</script>
<style scoped>
.systemNoti {
  margin-bottom: 20px;
}
.systemNoti .system-titler {
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  margin: 15px 0;
  padding: 0 20px;
}
.systemNoti .system-titler /deep/ .el-input {
  font-size: 12px;
}
.systemNoti .system-titler /deep/ .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.systemNoti .system-titler /deep/ .system-btns {
  text-align: right;
}
.systemNoti .system-titler /deep/ .system-btns > .el-button {
  padding: 5px 15px;
  font-size: 12px;
}
.systemNoti .system-titler /deep/ .system-btns > .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
}
.systemNoti .system-titler /deep/ .system-btns > .el-button:last-child:hover {
  border: 1px solid #dcdfe6;
  color: #606266;
}
.systemNoti .system-button > .el-button {
  background: #7b7de5;
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  padding: 8px 15px;
  border: 1px solid #7b7de5;
}
.systemNoti .system-button > .seemBtn {
  padding: 7.35px 23.5px;
}
.systemNoti /deep/ .has-gutter tr,
.systemNoti /deep/ .has-gutter th {
  background: #f6f6f6;
  padding: 8px 0;
}
.systemNoti /deep/ .el-table__row td {
  font-size: 12px;
  padding: 8px 0;
}
.systemNoti /deep/ .el-table thead {
  font-size: 13px;
  color: #3b404f;
}
.systemNoti /deep/ th,
.systemNoti /deep/ td {
  text-align: center;
}

.systemNoti .page {
  padding: 15px 20px 15px 0;
  background-color: #ffffff;
}
.systemNoti .page .el-pagination {
  text-align: right;
}
.systemNoti .page /deep/ .el-pagination__jump {
  margin-left: 0;
}
.systemNoti
  .page
  /deep/
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  background: #7b7de5;
  color: #fff;
}
/*自定义按钮图标*/
.member-btns /deep/ .el-icon-user:before {
  content: "";
}
.member-btns /deep/ .el-icon-user {
  display: inline-block;
  vertical-align: middle;
  width: 15px;
  height: 15px;
  margin-top: -3px;
}

.member-btns /deep/ .el-icon-user.el-icon-teamadd {
  background: url(../../assets/images/team/teamadd.png) no-repeat;
  background-size: 100% 100%;
}
.member-btns /deep/ .el-icon-user.el-icon-teamedit {
  background: url(../../assets/images/team/teamedit.png) no-repeat;
  background-size: 100% 100%;
}
.member-btns /deep/ .el-icon-user.el-icon-teamdelete {
  background: url(../../assets/images/team/teamdelete.png) no-repeat;
  background-size: 100% 100%;
}
.system-btns {
  padding-top: 9px;
  text-align: right;
  line-height: 1;
  vertical-align: middle;
}
.system-btns /deep/ .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
  border: 1px solid #7b7de5;
}

.systemNoti .system-titler /deep/ .system-btns > .el-button.el-button {
  padding: 8px 18px;
  font-size: 12px;
}
/*列表中的操作按钮*/
.tableopt /deep/ .el-icon-edit-outline:before,
.tableopt /deep/ .el-icon-delete:before,
.tableopt /deep/ .el-icon-download:before {
  content: "";
}
.tableopt {
  display: inline-block;
  float: right;
}
.tableopt /deep/ .el-icon-edit-outline {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 16px;
  vertical-align: middle;
  background: url(../../assets/images/file/editfiles.png) no-repeat;
  background-size: 100% 100%;
  margin-top: -2px;
}
.tableopt /deep/ .el-icon-delete {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
  vertical-align: middle;
  background: url(../../assets/images/file/deletefiles.png) no-repeat;
  background-size: 100% 100%;
  margin-top: -2px;
}
.tableopt /deep/ .el-icon-download {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 1px;
  vertical-align: middle;
  background: url(../../assets/images/file/filesdownload.png) no-repeat;
  background-size: 50% 100%;
  margin-top: -2px;
}

.projectMsg {
  min-height: 150px;
  border: 1px solid #e5e9f6;
  border-radius: 4px;
  padding: 15px 30px 15px 15px;
  margin-bottom: 15px;
  width: 307px;
  margin-left: 89px;
}
.pNumbers {
  padding-top: 10px !important;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 12px;
  font-size: 11px;
  color: #878ea1;
}
.pNumbers > div:last-child {
  border: 1px solid #e5e9f6;
  border-radius: 4px;
  padding: 3px 4px;
}
.mydialog /deep/ .el-input__inner {
  width: 350px;
  height: initial;
}
.projectMsg /deep/ .el-input__inner {
  width: 310px;
  height: initial;
}
.tableopt {
  display: none;
  float: right;
  width: 100px;
}
.tablenew .el-table__row:hover .tableopt {
  display: inline-block;
  cursor: pointer;
}
.tablenew /deep/ .el-table .cell {
  text-align: left;
}
.tablenew .spannamenew {
  display: inline;
  margin-left: 15px;
  width: 50px;
}
.tablenew .el-table__row:hover .spannamenew {
  margin-right: -31px;
}
.system-button.member-btns > .el-button.is-disabled {
  opacity: 0.5;
}
/* .tablenew /deep/ tbody .el-table__row{
  cursor: pointer;
} */
</style>
