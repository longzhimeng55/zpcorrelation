<template>
  <div class="role">
    <div class="role-titler">
      <el-row :gutter="11">
        <el-col :span="6">
          <div>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="5">
                <span>角色名称:</span>
              </el-col>
              <el-col :span="21">
                <el-input
                  v-model="ruleform.name"
                  placeholder="请输入角色名称"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="role-btns">
            <el-button @click="search('ruleform')">查询</el-button>
            <el-button @click="resetFormnew('ruleform')">清除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="role-button member-btns">
      <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamadd"
        @click="add"
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
    </div>
    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column type="selection" width="50" prop="id"></el-table-column> -->
      <el-table-column prop="" label="" width="15"></el-table-column>
      <el-table-column label="角色名称" width="400">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.name }}</span>
          <div class="tableopt">
            <i
              class="seemIcon el-icon-edit-outline"
              title="编辑"
              @click="edittable(scope.row)"
            ></i>
            <i
              class="seemIcon el-icon-delete"
              @click.stop="handleDelete(scope.$index, scope.row)"
              title="删除"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
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
    <!--添加-->
    <div class="mydialog">
      <!-- 添加角色信息 -->
      <el-dialog
        title="添加角色"
        class=""
        :visible.sync="adddialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="addhandleClose"
      >
        <el-form
          ref="adddialogForm"
          :model="adddialogForm"
          label-width="100px"
          :rules="addrules"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="adddialogForm.name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="type">
            <el-select
              placeholder="请选择角色类型"
              v-model="adddialogForm.type"
            >
              <el-option label="公司角色" value="1" key="1">公司角色</el-option>
              <el-option label="项目角色" value="2" key="2">项目角色</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="相应权限">
            <div class="relateauth" v-if="setroledata.length != 0">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 0px 0;"></div>
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="item in setroledata"
                  :label="item.id"
                  :key="item.id"
                  true-label
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
            <div class="relateauth" v-else>
              <p>暂无相关数据</p>
            </div>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input
              type="textarea"
              v-model="adddialogForm.desc"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addcancel('adddialogForm')">取消</el-button>
          <el-button type="primary" @click="addsave('adddialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div class="mydialog">
      <!-- 编辑成员信息 -->
      <el-dialog
        title="编辑角色"
        class=""
        :visible.sync="editdialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="edithandleClose"
      >
        <el-form
          ref="editdialogForm"
          :model="editdialogForm"
          label-width="100px"
          :rules="editrules"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="editdialogForm.name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="type">
            <el-select
              placeholder="请选择角色类型"
              v-model="editdialogForm.type"
            >
              <el-option label="公司角色" :value="1" key="1"
                >公司角色</el-option
              >
              <el-option label="项目角色" :value="2" key="2"
                >项目角色</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item label="相应权限">
            <div class="relateauth" v-if="setroledata.length != 0">
              <el-checkbox
                :indeterminate="iseditIndeterminate"
                v-model="editcheckAll"
                @change="edithandleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 0px 0;"></div>
              <el-checkbox-group
                v-model="editcheckedCities"
                @change="edithandleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="item in setroledata"
                  :label="item.id"
                  :key="item.id"
                  true-label
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
            <div class="relateauth" v-else>
              <p>暂无相关数据</p>
            </div>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input
              type="textarea"
              v-model="editdialogForm.desc"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editcancel('editdialogForm')">取消</el-button>
          <el-button type="primary" @click="editsave('editdialogForm')"
            >确定</el-button
          >
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
import confirmDialogalldelete from "@/components/ConfirmDialogAlldelete.vue"; //组件放在的位置 根据实际修改
export default {
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
      setroledata: [],
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      //编辑
      editcheckAll: false,
      editcheckedCities: [],
      iseditIndeterminate: true,
      ruleform: {
        name: ""
      },
      adddialogForm: {
        name: "",
        type: "",
        desc: "",
        privilegeList: []
      },
      addrules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择角色类型", trigger: "change" }
        ],
        desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
      },
      editdialogForm: {
        name: "",
        type: "",
        desc: "",
        privilegeList: []
      },
      editrules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择角色类型", trigger: "change" }
        ],
        desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
      },
      tableData: [],
      //删除相关的内容
      //sels: [],
      sels: "",
      isShowDialogalldelete: false,
      alldeletecontent: "",
      adddialogVisible: false,
      editdialogVisible: false
    };
  },
  created() {
    this.getlistdata();
    this.getroleauth();
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.setroledata : [];
      let tempcheckedCities = this.checkedCities;
      if (tempcheckedCities.length != 0) {
        let temparray = [];
        for (let i = 0; i < tempcheckedCities.length; i++) {
          temparray.push(tempcheckedCities[i].id);
        }
        this.checkedCities = temparray;
      }
      console.log(this.checkedCities);
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.setroledata.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.setroledata.length;
      console.log(this.checkedCities);
    },
    edithandleCheckAllChange(val) {
      this.editcheckedCities = val ? this.setroledata : [];
      let tempcheckedCities = this.editcheckedCities;
      if (tempcheckedCities.length != 0) {
        let temparray = [];
        for (let i = 0; i < tempcheckedCities.length; i++) {
          temparray.push(tempcheckedCities[i].id);
        }
        this.editcheckedCities = temparray;
      }
      this.iseditIndeterminate = false;
    },
    edithandleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.editcheckAll = checkedCount === this.setroledata.length;
      this.iseditIndeterminate =
        checkedCount > 0 && checkedCount < this.setroledata.length;
    },
    //获取角色权限
    getroleauth() {
      this.$http.team
        .getJurisdiction()
        .then(
          res => {
            if (res.data.ret == "0") {
              this.setroledata = res.data.content;
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
    //获取编辑数据
    edittable(data) {
      this.editdialogForm = data;
      let params = { id: data.id };
      this.$http.team
        .geteditRole(params)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempprivilegeList = res.data.content;
              if (tempprivilegeList.length != 0 || tempprivilegeList != null) {
                let temparray = [];
                for (let i = 0; i < tempprivilegeList.length; i++) {
                  temparray.push(tempprivilegeList[i].id);
                }
                this.editdialogForm.tempprivilegeList = [];
                this.editdialogForm.tempprivilegeList = temparray;
                this.editcheckedCities = temparray;
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
      this.editdialogVisible = true;
    },
    editcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["editdialogForm"].resetFields();
          this.editcheckedCities = [];
          this.editcheckAll = false;
          this.iseditIndeterminate = true;
          this.editdialogVisible = false;
          this.editdialogForm = {};
        } else {
          this.$refs["editdialogForm"].resetFields();
          this.resetForm(formName);
          this.editcheckedCities = [];
          this.editcheckAll = false;
          this.iseditIndeterminate = true;
          this.editdialogVisible = false;
          this.editdialogForm = {};
        }
      });
    },
    editsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.editdialogForm;
          let tempcheckedCities = this.editcheckedCities;
          if (tempcheckedCities.length != 0) {
            let temarray = [];
            for (let i = 0; i < tempcheckedCities.length; i++) {
              let temobj = {};
              temobj.id = tempcheckedCities[i];
              temarray.push(temobj);
            }
            tempobjnew.privilegeList = temarray;
          }
          this.$http.team
            .editRole(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.editdialogForm = {};
                  this.resetForm(formName);
                  this.editcheckedCities = [];
                  this.editcheckAll = false;
                  this.iseditIndeterminate = true;
                  this.editdialogVisible = false;
                  this.$message({
                    message: "编辑成功",
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
        }
      });
    },
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
      // this.sels = [];
      this.sels = item.id;
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
      //let temobj = this.sels;
      let temobj = { id: this.sels };
      //console.log(this.sels);
      this.$http.team
        .deleteRole(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialogalldelete = false;
              this.$message({
                message: "删除文件成功",
                type: "success"
              });
              //this.sels = [];
              this.sels = "";
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
    add() {
      this.adddialogVisible = true;
    },
    addhandleClose() {
      this.$refs["adddialogForm"].resetFields();
      this.checkedCities = [];
      this.checkAll = false;
      this.isIndeterminate = true;
      this.adddialogVisible = false;
    },
    edithandleClose() {
      this.$refs["editdialogForm"].resetFields();
      this.editcheckedCities = [];
      this.editcheckAll = false;
      this.iseditIndeterminate = true;
      this.editdialogVisible = false;
      this.editdialogForm = {};
    },
    addcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["adddialogForm"].resetFields();
          this.checkedCities = [];
          this.checkAll = false;
          this.isIndeterminate = true;
          this.adddialogVisible = false;
        } else {
          this.$refs["adddialogForm"].resetFields();
          this.resetForm(formName);
          this.checkedCities = [];
          this.checkAll = false;
          this.isIndeterminate = true;
          this.adddialogVisible = false;
        }
      });
    },
    addsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.adddialogForm;
          let tempcheckedCities = this.checkedCities;
          if (tempcheckedCities.length != 0) {
            let temarray = [];
            for (let i = 0; i < tempcheckedCities.length; i++) {
              let temobj = {};
              temobj.id = tempcheckedCities[i];
              temarray.push(temobj);
            }
            tempobjnew.privilegeList = temarray;
          }
          this.$http.team
            .addRole(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  let tempcontent = res.data.content.records;
                  this.resetForm(formName);
                  this.checkedCities = [];
                  this.checkAll = false;
                  this.isIndeterminate = true;
                  this.adddialogVisible = false;
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
    resetFormnew(formName) {
      this.ruleform = {
        name: ""
      };
    },
    //重置表单元素
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search() {
      this.pageSize = 10;
      this.pageNum = 1;
      let temobj = { pageSize: this.pageSize, pageNum: this.pageNum };
      temobj.entity = this.ruleform;
      temobj.entity.companyId = this.$store.state.user.userCompanyId;
      this.$http.team
        .getRoleList(temobj)
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
        .getRoleList(temobj)
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
  components: { confirmDialogalldelete }
};
</script>
<style scoped>
.role {
  margin-bottom: 20px;
}
.role .role-titler {
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  margin: 15px 0;
  padding: 0 20px;
}
.role .role-titler /deep/ .el-input {
  font-size: 12px;
}
.role .role-titler /deep/ .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.role .role-titler /deep/ .role-btns {
  padding-top: 9px;
  text-align: right;
  line-height: 1;
  vertical-align: middle;
}
.role .role-titler /deep/ .role-btns > .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.role .role-titler /deep/ .role-btns > .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
  border: 1px solid #7b7de5;
}
.role .role-titler /deep/ .role-btns > .el-button:last-child:hover {
  border: 1px solid #dcdfe6;
  color: #606266;
}
.role .role-button > .el-button {
  background: #7b7de5;
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  padding: 8px 15px;
  border: 1px solid #7b7de5;
}
.role .role-button > .seemBtn {
  padding: 7.35px 23.5px;
}
.role /deep/ .has-gutter tr,
.role /deep/ .has-gutter th {
  background: #f6f6f6;
  padding: 8px 0;
}
.role /deep/ .el-table__row td {
  font-size: 12px;
  padding: 8px 0;
}
.role /deep/ .el-table thead {
  font-size: 13px;
  color: #3b404f;
}
/* .role /deep/ th,
.role /deep/ td {
  text-align: left;
} */
/* .role /deep/ th{
  text-align: center;
} */
.role .page {
  padding: 15px 20px 15px 0;
  background-color: #ffffff;
}
.role .page .el-pagination {
  text-align: right;
}
.role .page /deep/ .el-pagination__jump {
  margin-left: 0;
}
.role
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
.role-button.member-btns > .el-button.is-disabled {
  opacity: 0.5;
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
/* .role /deep/ tbody .el-table__row {
  cursor: pointer;
} */
.mydialog /deep/ .el-input,
.mydialog /deep/ .el-textarea {
  width: 300px;
}
.mydialog /deep/ .el-textarea .el-textarea__inner {
  height: 90px;
}
.tableopt {
  display: none;
  float: right;
  width: 100px;
}
.el-table__row:hover .tableopt {
  display: inline-block;
  cursor: pointer;
}
.relateauth {
    width: 401px;
    min-height: 40px;
    padding: 5px 10px;
    height: 100px;
    max-height: 200px;
    overflow: auto;
    border: 1px solid #E5E9F6;
    margin-bottom: 20px;
}
.relateauth .el-checkbox {
  margin-right: 24px;
  line-height: 20px;
  font-weight: initial!important;
}
</style>
