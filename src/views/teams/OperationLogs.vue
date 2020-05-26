<template>
  <div class="operationLog">
    <div class="operation-titler">
      <el-row :gutter="15">
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="6">
                <span>操作名称:</span>
              </el-col>
              <el-col :span="18">
                <el-input
                  v-model="ruleform.name"
                  placeholder="请输入操作名称"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="13">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="16">
              <el-col :span="4">
                <span>用户时间:</span>
              </el-col>
              <el-col :span="6" style="width:210px">
                <!-- <el-input
                  v-model="ruleform.start"
                  placeholder="请选择操作时间"
                ></el-input> -->
                <el-date-picker
                  v-model="ruleform.start"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  placeholder="请选择开始时间"
                  :picker-options="pickerBeginDateBefore"
                ></el-date-picker>
                <span style="display:inline-block;margin-left:8px;">至</span>
              </el-col>
              <el-col :span="6">
                <el-date-picker
                  v-model="ruleform.end"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  placeholder="请选择结束时间"
                  :picker-options="pickerOptionsEnd"
                ></el-date-picker>
                <!-- <el-input
                  v-model="ruleform.end"
                  placeholder="请选择操作时间"
                ></el-input> -->
              </el-col>
            </el-col>
            <el-col :span="6">
              <div class="operation-btns">
                <el-button @click="search('ruleform')">查询</el-button>
                <el-button @click="resetFormnew('ruleform')">清除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="operation-btns member-btns">
      <!-- <el-button class="upDown" size="mini" round icon="el-icon-user"
        >详情</el-button
      > -->
    </div>
    <div class="tablenew">
      <el-table :data="tableData" :empty-text="emptyText" style="width: 100%">
        <!-- <el-table-column type="selection" width="30" prop="id"></el-table-column> -->
        <el-table-column label="操作人" width="300">
          <template slot-scope="scope">
            <span class="spannamenew" style="margin-left: 10px">{{
              scope.row.operatorName
            }}</span>
            <!-- <span style="margin-left: 0px">{{ scope.row.operatorName }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="功能">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import { formatDate } from "@/libs/date.js";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
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
      emptyText: "暂无任何数据",
      ruleform: {
        name: "",
        start: "",
        end: ""
      },
      tableData: [],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.ruleform.end;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.ruleform.start;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      }
    };
  },
  created() {
    this.getlistdata();
  },
  methods: {
    resetFormnew(formName) {
      this.ruleform = {
        name: "",
        start: "",
        end: ""
      };
    },
    search() {
      this.pageSize = 10;
      this.pageNum = 1;
      let temobj = { pageSize: this.pageSize, pageNum: this.pageNum };
      temobj.entity = this.ruleform;
      temobj.entity.companyId = this.$store.state.user.userCompanyId;
      this.$http.team
        .getTeamlogs(temobj)
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
      temobj.entity = { companyId: this.$store.state.user.userCompanyId };
      this.$http.team
        .getTeamlogs(temobj)
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
  }
};
</script>
<style scoped>
.operationLog {
  margin-bottom: 20px;
  height: 100%;
}
.operationLog .operation-titler {
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  margin: 15px 0;
  padding: 0 20px;
}
.operationLog .operation-titler /deep/ .el-input {
  font-size: 12px;
}
.operationLog .operation-titler /deep/ .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.operationLog .operation-titler /deep/ .el-col-4,
.operationLog .operation-titler /deep/ .el-col-2 {
  text-align: center;
}
.operationLog .operation-titler /deep/ .operation-btns {
  text-align: right;
}
.operationLog .operation-titler /deep/ .operation-btns > .el-button {
  padding: 5px 15px;
  font-size: 12px;
}
.operationLog
  .operation-titler
  /deep/
  .operation-btns
  > .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
}
.operationLog .operation-btns > .el-button {
  /* background: #7b7de5; */
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  /* color: #ffffff; */
  margin-bottom: 15px;
  /* padding: 6px 22px; */
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  padding: 8px 15px;
}
.operation-btns {
  padding-top: 9px;
  text-align: right;
  line-height: 1;
  vertical-align: middle;
}
.operation-btns.member-btns {
  text-align: left;
  padding-top: 0px;
}
.operation-btns /deep/ .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
  border: 1px solid #7b7de5;
}

.operationLog .operation-titler /deep/ .operation-btns > .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
/* 数据为空时的样式 ->*/
.operationLog .el-table {
  min-height: 320px;
}
.operationLog .el-table /deep/ .el-table__empty-block {
  min-height: 320px;
}
.operationLog .el-table /deep/ .el-table__empty-block > .el-table__empty-text {
  color: #3b404f;
  font-size: 13px;
}
/*<- 数据为空时的样式 */
.operationLog /deep/ .has-gutter tr,
.operationLog /deep/ .has-gutter th {
  background: #f6f6f6;
  padding: 8px 0;
}
.operationLog /deep/ .el-table__row td {
  font-size: 12px;
  padding: 8px 0;
}
.operationLog /deep/ .el-table thead {
  font-size: 13px;
  color: #3b404f;
}
.operationLog /deep/ th,
.operationLog /deep/ td {
  text-align: center;
}
.operationLog .page {
  padding: 15px 20px 15px 0;
  background-color: #ffffff;
}
.operationLog .page .el-pagination {
  text-align: right;
}
.operationLog .page /deep/ .el-pagination__jump {
  margin-left: 0;
}
.operationLog
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
  /* display: inline-block;
  vertical-align: middle; */
  /* width: 0px;
  height: 0px;
  margin-top: -3px; */
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 178px;
}
.operationLog /deep/ .el-table thead tr th:first-child .cell,
.operationLog /deep/ .el-table tbody tr td:first-child .cell {
  text-overflow: initial !important;
}
.tablenew .spannamenew {
  display: inline-block;
  margin-left: 15px;
  width: 50px;
}
.tablenew /deep/ .el-table__header-wrapper .el-table__header th:first-child div,.tablenew /deep/ .el-table__body-wrapper .el-table__body td:first-child{
  text-align: left;
  margin-left: 10px;
}
</style>
