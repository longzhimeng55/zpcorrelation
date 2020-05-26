<template>
  <div class="actionLog">
    <el-button size="mini" @click="choseLog" round class="filtrater">
      筛选查看
      <i class="el-icon-defalut el-icon-filter"></i>
    </el-button>
    <el-table :data="tableData" style="width: 100%" class="tableoutline">
      <el-table-column label="姓名" width="300" style="margin-left:20px;">
        <template slot-scope="scope">
          <img class="photoName" :src="scope.row.url" alt v-if="scope.row.url!=null"/>
          <img class="photoName" src="../../assets/images/photo.png" alt v-else/>
          <span style="margin-left: 20px">{{ scope.row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作"
        width="400"
      ></el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="list_page pagination"
      v-if="totalRecord > 10"
      style="text-align: center;padding-top: 7px;height: 45px"
    >
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
    <!-- 筛选查看弹出层 -->
    <el-dialog
      width="350px"
      title="筛选日志"
      custom-class="addCart"
      :visible.sync="logDialog"
      :before-close="searchlogsDialogClose"
      :close-on-click-modal="false"
    >
      <el-form :model="searchlogsdata" ref="searchlogsdata">
        <el-form-item label="">
          <el-input
            v-model="searchlogsdata.operatorName"
            placeholder="请输入项目成员名称"
          ></el-input>
          <!-- <el-input v-model="form.title" placeholder="开始时间"></el-input> -->
          <el-date-picker
            v-model="searchlogsdata.start"
            size="mini"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="timestamp"
            align="center"
            placeholder="请选择开始时间"
            :picker-options="pickerBeginDateBefore"
          ></el-date-picker>
          <!-- <el-input v-model="form.title" placeholder="结束时间"></el-input> -->
          <el-date-picker
            v-model="searchlogsdata.end"
            size="mini"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="timestamp"
            align="center"
            placeholder="请选择结束时间"
            :picker-options="pickerOptionsEnd"
          ></el-date-picker>
        </el-form-item>
        <!-- <div>日志类型</div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="里程碑"></el-checkbox>
          <el-checkbox label="文件"></el-checkbox>
        </el-checkbox-group>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('searchlogsdata')">清空</el-button>
        <el-button type="primary" @click="searchLogs">筛选</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
      logDialog: false,
      // 分页
      pageNum: 1,
      pageSize: 10,
      currentPage1: "",
      totalPage: "",
      totalRecord: "",
      searchlogsdata: {
        operatorName: "",
        start: "",
        end: ""
      },
      tableData: [
        { name: "许文强", action: "添加了文件", date: "2019.06.17 10:45" },
        { name: "许文强", action: "添加了文件", date: "2019.06.17 10:45" },
        { name: "许文强", action: "添加了文件", date: "2019.06.17 10:45" },
        { name: "许文强", action: "添加了文件", date: "2019.06.17 10:45" },
        { name: "许文强", action: "添加了文件", date: "2019.06.17 10:45" }
      ],
      form: {},
      checkList: ["任务"],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.searchlogsdata.end;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.searchlogsdata.start;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      }
    };
  },
  created() {
    this.getLogslist();
  },
  methods: {
    choseLog() {
      this.logDialog = !this.logDialog;
      this.searchlogsdata.start=new Date().getTime();
      //this.searchlogsdata.start=new Date(new Date().toLocaleDateString()).getTime();
      this.searchlogsdata.end=new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
      console.log(this.form);
    },
    //重置表单
    resetForm(formName) {
      this.searchlogsdata.operatorName = "";
      this.searchlogsdata.start = "";
      this.searchlogsdata.end = "";
      // this.$refs[formName].resetFields();
    },
    searchlogsDialogClose() {
      this.logDialog = false;
      this.searchlogsdata.operatorName = "";
      this.searchlogsdata.start = "";
      this.searchlogsdata.end = "";
    },
    //筛选日志
    searchLogs() {
      let projectid = this.$store.state.user.projectId;
      let companyid = this.$store.state.user.userCompanyId;
      let tempagesize = 10;
      let temppagenum = 1;
      let tempstart = this.timeFormatter(this.searchlogsdata.start);
      let tempend = this.timeFormatter(this.searchlogsdata.end);
      let tempcontent = {
        pageSize: tempagesize,
        pageNum: temppagenum,
        entity: {
          projectId: projectid,
          companyId: companyid,
          start: tempstart,
          end: tempend,
          operatorName: this.searchlogsdata.operatorName
        }
      };
      this.$http.logs
        .getLogList(tempcontent)
        .then(
          res => {
            if (res.data.ret == "0") {
              console.log(res.data.content);
              this.pageNum = res.data.content.pageNum;
              this.pageSize = res.data.content.pageSize;
              this.totalPage = res.data.content.totalPage;
              this.totalRecord = res.data.content.totalRecord;
              this.tableData = res.data.content.records;
              // this.getboardlist();
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
      this.logDialog = false;
      this.searchlogsdata.operatorName = "";
      this.searchlogsdata.start = "";
      this.searchlogsdata.end = "";
    },
    // 将时间转换成年月日时分秒
    timeFormatter(timeStamp) {
      let time = new Date(timeStamp);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return (
        year +
        "-" +
        this.add0(month) +
        "-" +
        this.add0(date) +
        " " +
        this.add0(hours) +
        ":" +
        this.add0(minutes) +
        ":" +
        this.add0(seconds)
      );
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    handleSizeChange1(pageSize) {
      // 每页条数切换
      this.pageSize = pageSize;
      this.handleCurrentChange1(this.pageNum);
    },
    handleCurrentChange1(currentPage) {
      //页码切换
      this.pageNum = currentPage;
      this.getLogslist();
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
    },
    getLogslist() {
      let projectid = this.$store.state.user.projectId;
      let companyid = this.$store.state.user.userCompanyId;
      let tempagesize = this.pageSize;
      let temppagenum = this.pageNum;
      let tempcontent = {
        pageSize: tempagesize,
        pageNum: temppagenum,
        entity: {
          projectId: projectid,
          companyId: companyid
        }
      };
      this.$http.logs
        .getLogList(tempcontent)
        .then(
          res => {
            if (res.data.ret == "0") {
              console.log(res.data.content);
              this.pageNum = res.data.content.pageNum;
              this.pageSize = res.data.content.pageSize;
              this.totalPage = res.data.content.totalPage;
              this.totalRecord = res.data.content.totalRecord;
              this.tableData = res.data.content.records;
              // this.getboardlist();
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
.actionLog {
  padding-top: 20px;
}
.actionLog .el-button {
  background: #7b7de5;
  color: #ffffff;
}
.actionLog .el-table {
  margin-top: 20px;
}
.actionLog /deep/ .photoName {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  vertical-align: middle;
}
.actionLog /deep/ .el-table thead {
  font-size: 13px;
  opacity: 0.5;
}
.actionLog /deep/ .has-gutter tr,
.actionLog /deep/ .has-gutter th {
  background: #f6f6f6;
  padding: 8px 0;
}
.actionLog /deep/ .el-table__row td {
  font-size: 12px;
  padding: 8px 0;
}
.actionLog /deep/ .el-table thead {
  font-size: 13px;
  color: #3b404f;
}
.actionLog
  /deep/
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td {
  background: #ebebf3;
}
/* 帅选弹出层 */
.actionLog /deep/ .el-dialog__body {
  padding: 7px 20px;
}
.actionLog /deep/ .el-dialog__body .el-form .el-form-item {
  margin-bottom: 10px;
}
.actionLog /deep/ .el-form-item__content {
  line-height: 50px;
}
.actionLog /deep/ .el-form-item__content .el-date-editor.el-input {
  width: 100%;
}
.actionLog /deep/ .el-dialog__footer {
  text-align: center;
}
.actionLog /deep/ .el-dialog__footer .dialog-footer .el-button {
  padding: 8px 40px;
}
.actionLog /deep/ .el-dialog__footer .dialog-footer .el-button:first-child {
  background-color: #ffffff;
  border: 1px solid #e5e9f6;
  color: #606266;
}
.actionLog
  /deep/
  .el-dialog__footer
  .dialog-footer
  .el-button:first-child
  span {
  color: #606266;
}
.actionLog /deep/ .el-dialog__footer .dialog-footer .el-button:last-child {
  background: #7b7de5;
  border: 1px solid #e5e9f6;
  color: #3b404f;
}
/* 筛选查看 */
.actionLog /deep/ .el-button span {
  font-family: PingFangSC-Regular;
  /* font-size: 14px; */
  color: #ffffff;
  display: inline-block;
  padding: 2px 0px;
}
.el-icon-defalut {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-top: -3px;
  vertical-align: middle;
}
.el-icon-defalut.el-icon-filter {
  width: 12px;
  height: 10.3px;
  margin-top: -2px;
  background: url("../../assets/images/filter.png") no-repeat;
  background-size: 12px 10.3px;
}
.list_page /deep/ .el-input--mini .el-input__inner {
  height: 20px;
  line-height: 20px;
  border: none !important;
}
.actionLog /deep/ .el-table__body-wrapper tbody tr td:first-child .cell,
.actionLog /deep/ thead.has-gutter tr th:first-child div.cell {
  padding-left: 30px;
}
.actionLog /deep/ .el-table__row td .cell>span, .actionLog /deep/ .el-table__row td .cell {
    line-height: 28px;
}
</style>
