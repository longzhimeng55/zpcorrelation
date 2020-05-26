<template>
  <div class="member" v-loading="loading">
    <div class="member-titler">
      <el-row :gutter="12">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="5">
                <span>成员姓名:</span>
              </el-col>
              <el-col :span="19">
                <el-input
                  v-model="ruleform.name"
                  maxlength="30"
                  placeholder="请输入成员姓名"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="5">
                <span>成员电话:</span>
              </el-col>
              <el-col :span="19">
                <el-input
                  v-model="ruleform.phone"
                  maxlength="11"
                  placeholder="请输入成员电话"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="10">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                是否在职:
                <el-radio-group
                  v-model="ruleform.status"
                  @change="openEditRadio"
                >
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="member-btns member-btnsnew">
                <el-button @click="search('ruleform')">查询</el-button>
                <el-button @click="resetForm('ruleform')">清除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="member-btns">
      <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamadd"
        @click="addmumber"
        >添加</el-button
      >
      <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamdelete"
        @click="onDeldata"
        :disabled="this.sels.length === 0"
        >删除</el-button
      >
      <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-user el-icon-teamsetting"
        >管理域配置</el-button
      >
    </div>
    <div>
      <div class="tablenew">
        <el-table
          :data="getteamlist"
          style="width: 100%"
          @selection-change="selsChange"
          ref="multipleTable"
          @row-click="handleCurrentChange"
        >
          <el-table-column type="selection" width="30" prop="id">
          </el-table-column>
          <el-table-column label="用户ID" width="170">
            <template slot-scope="scope">
              <span class="spannamenew" style="margin-left: 10px">{{
                scope.row.id
              }}</span>
              <div class="tableopt">
                <i
                  class="seemIcon el-icon-edit-outline"
                  title="编辑"
                  @click.stop="edittable(scope.row)"
                ></i>
                <i
                  class="seemIcon el-icon-delete"
                  @click.stop="handleDelete(scope.$index, scope.row)"
                  title="删除"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户姓名" width="140">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="企业微信ID" width="130"> </el-table-column>
          <el-table-column label="用户电话">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户邮箱">
            <template slot-scope="scope">
              <span v-if="scope.row.mail == null">{{ "暂无用户邮箱" }}</span>
              <span else>{{ scope.row.mail }}</span>
            </template>
          </el-table-column>
          <el-table-column label="职位">
            <template slot-scope="scope">
              <span v-if="scope.row.position == null">{{
                "暂无职位信息"
              }}</span>
              <span else>{{ scope.row.position }}</span>
            </template>
          </el-table-column>
          <el-table-column label="在职状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">{{ "在职" }}</span>
              <span v-if="scope.row.status == 1">{{ "离职" }}</span>
            </template>
          </el-table-column>
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
    <div class="mydialog mydialognew">
      <!-- 添加成员信息 -->
      <el-dialog
        title="添加成员信息"
        class=""
        :visible.sync="adddialogVisible"
        width="630px"
        :close-on-click-modal="false"
        :before-close="addhandleClose"
      >
        <el-form
          ref="adddialogForm"
          :model="adddialogForm"
          label-width="90px"
          :rules="addrules"
        >
          <el-row>
            <el-col span="12">
              <el-form-item label="成员ID" prop="loginId">
                <el-input
                  v-model="adddialogForm.loginId"
                  placeholder="请输入成员ID"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="成员姓名" prop="name">
                <el-input
                  v-model="adddialogForm.name"
                  auto-complete="new-password"
                  placeholder="请输入成员姓名"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="adddialogForm.password"
                  type="password"
                  auto-complete="new-password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="确认密码" prop="confPassword">
                <el-input
                  v-model="adddialogForm.confPassword"
                  type="password"
                  placeholder="请输入确认密码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="成员电话" prop="phone">
                <el-input
                  v-model="adddialogForm.phone"
                  placeholder="请输入成员电话"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="成员邮箱" prop="mail">
                <el-input
                  v-model="adddialogForm.mail"
                  placeholder="请输入成员邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="职位" prop="position">
                <el-input
                  v-model="adddialogForm.position"
                  placeholder="请输入职位"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="企业微信ID" prop="wechat">
                <el-input
                  v-model="adddialogForm.wechat"
                  placeholder="请输入企业微信ID"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="所属组织">
                <el-input
                  style="width:135px;cursor: pointer;"
                  class="isclick"
                  placeholder="请选择所属组织"
                  v-model="adddialogForm.departmentname"
                  :disabled="true"
                  @click.native="settingadd"
                ></el-input>
                <span
                  style="float:right;"
                  class="inputbuttton"
                  @click="settingadd"
                  >设置</span
                >
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="拥有角色">
                <el-input
                  style="width:135px"
                  class="isclick"
                  placeholder="请选择拥有角色"
                  v-model="adddialogForm.rolesname"
                  :disabled="true"
                  @click.native="settingroleadd"
                ></el-input>
                <span
                  style="float:right;"
                  class="inputbuttton"
                  @click="settingroleadd"
                  >设置</span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="是否在职" prop="status">
                <el-radio-group v-model="adddialogForm.status">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
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
    <div class="mydialog mydialognew">
      <!-- 编辑成员信息 -->
      <el-dialog
        title="编辑成员信息"
        class=""
        :visible.sync="editdialogVisible"
        width="630px"
        :close-on-click-modal="false"
        :before-close="edithandleClose"
      >
        <el-form
          ref="editdialogForm"
          :model="editdialogForm"
          label-width="90px"
          :rules="editrules"
        >
          <el-row>
            <el-col span="12">
              <el-form-item label="成员ID" prop="loginId">
                <el-input
                  v-model="editdialogForm.loginId"
                  placeholder="请输入成员ID"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="成员姓名" prop="name">
                <el-input
                  v-model="editdialogForm.name"
                  auto-complete="new-password"
                  placeholder="请输入成员姓名"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="editdialogForm.password"
                  type="password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="确认密码" prop="confPassword">
                <el-input
                  v-model="editdialogForm.confPassword"
                  type="password"
                  placeholder="请输入确认密码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="成员电话" prop="phone">
                <el-input
                  v-model="editdialogForm.phone"
                  placeholder="请输入成员电话"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="成员邮箱" prop="mail">
                <el-input
                  v-model="editdialogForm.mail"
                  placeholder="请输入成员邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="职位" prop="position">
                <el-input
                  v-model="editdialogForm.position"
                  placeholder="请输入职位"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="企业微信ID" prop="wechat">
                <el-input
                  v-model="editdialogForm.wechat"
                  placeholder="请输入企业微信ID"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="所属组织">
                <el-input
                  style="width:135px;"
                  class="isclick"
                  placeholder="请选择所属组织"
                  v-model="editdialogForm.departmentName"
                  :disabled="true"
                  @click.native="settingedit"
                ></el-input>
                <span
                  style="float:right;"
                  class="inputbuttton"
                  @click="settingedit"
                  >设置</span
                >
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="拥有角色">
                <el-input
                  style="width:135px"
                  class="isclick"
                  placeholder="请选择拥有角色"
                  v-model="editdialogForm.roleNams"
                  :disabled="true"
                  @click.native="settingroleedit"
                ></el-input>
                <span
                  style="float:right;"
                  class="inputbuttton"
                  @click="settingroleedit"
                  >设置</span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="是否在职" prop="status">
                <el-radio-group v-model="editdialogForm.status">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editcancel('editdialogForm')">取消</el-button>
          <el-button type="primary" @click="editsave('editdialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div class="mydialog mydialognew mydialogorg">
      <!-- 添加所属组织 -->
      <el-dialog
        title="所属组织"
        class=""
        :visible.sync="addpositiondialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="addpositionhandleClose"
      >
        <div style="text-align:center">
          <el-radio-group
            v-model="addpositiondialogForm.departmentId"
            @change="addpotchangeHandler"
          >
            <el-radio
              v-for="item in whatdepartmentdata"
              :label="item.id"
              :key="item.id"
              >{{ item.lable }}</el-radio
            >
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addpositioncancel">取消</el-button>
          <el-button type="primary" @click="addpositionsave">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="mydialog mydialognew">
      <!-- 添加所属组织 -->
      <el-dialog
        title="所属组织"
        class=""
        :visible.sync="editpositiondialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="editpositionhandleClose"
      >
        <div style="text-align: center;">
          <el-radio-group
            v-model="editpositiondialogForm.departmentId"
            @change="editpotchangeHandler"
          >
            <el-radio
              v-for="item in whatdepartmentdata"
              :label="item.id"
              :key="item.id"
              >{{ item.lable }}</el-radio
            >
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editpositioncancel">取消</el-button>
          <el-button type="primary" @click="editpositionsave">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="mydialog mydialognew mydialogrole">
      <!-- 添加拥有角色 -->
      <el-dialog
        title="拥有角色"
        class=""
        :visible.sync="addroledialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="addrolehandleClose"
      >
        <div>
          <el-table
            ref="multipleTable"
            :data="roletableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="addroleselsChange"
          >
            <el-table-column type="selection" width="55" prop="id">
            </el-table-column>
            <el-table-column label="角色名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="角色描述">
              <template slot-scope="scope">{{ scope.row.desc }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addrolecancel">取消</el-button>
          <el-button type="primary" @click="addrolesave">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="mydialog mydialognew mydialogrole">
      <!-- 添加拥有角色(编辑) -->
      <el-dialog
        title="拥有角色"
        class=""
        :visible.sync="editroledialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :before-close="editrolehandleClose"
      >
        <div>
          <el-table
            ref="multipleTable"
            :data="roletableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="editroleselsChange"
          >
            <el-table-column type="selection" width="55" prop="id">
            </el-table-column>
            <el-table-column label="角色名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="角色描述">
              <template slot-scope="scope">{{ scope.row.desc }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editrolecancel">取消</el-button>
          <el-button type="primary" @click="editrolesave">确定</el-button>
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
import { setTimeout } from "timers";
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
      addtempdepartmentname: "",
      loading: true,
      adddialogVisible: false,
      editdialogVisible: false,
      sels: [],
      whatdepartmentdata: [],
      roletableData: [],
      addrolesels: [],
      addrolename: "",
      addpositiondialogForm: {
        departmentId: ""
      },
      editrolesels: [],
      editrolename: "",
      editpositiondialogForm: {
        departmentId: ""
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      alldeletecontent: "",
      isShowDialogalldelete: false,
      addpositiondialogVisible: false,
      addroledialogVisible: false,
      editpositiondialogVisible: false,
      editroledialogVisible: false,
      //搜索
      ruleform: {
        name: "",
        phone: "",
        status: ""
      },
      //团队列表
      getteamlist: [],
      //添加团队成员
      adddialogForm: {
        loginId: "",
        name: "",
        password: "",
        confPassword: "",
        mail: "",
        loginId: "",
        status: "",
        position: "",
        departmentId: "",
        departmentname: "",
        roles: [],
        rolesname: ""
      },
      addrules: {
        loginId: [{ required: true, message: "请输入成员ID", trigger: "blur" }],
        name: [{ required: true, message: "请输入成员姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" }
        ]
      },
      editdialogForm: {},
      editrules: {
        loginId: [{ required: true, message: "请输入成员ID", trigger: "blur" }],
        name: [{ required: true, message: "请输入成员姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTeamList();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    this.getCompanylist();
    this.getRolelist();
  },
  methods: {
    //封装的让table表格的复选框默认选中的函数
    first(rows) {
      this.$nextTick(() => {
        console.log(rows);
        rows.forEach(row => {
          console.log(row);
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      });
    },
    //清除的
    cleartablecheck() {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
      });
    },
    addroleselsChange(sels) {
      this.addrolename = sels.map(sels => sels.name).toString();
      this.addrolesels = sels.map(sels => sels.id);
    },
    editroleselsChange(sels) {
      this.editrolename = sels.map(sels => sels.name).toString();
      this.editrolesels = sels.map(sels => sels.id);
    },
    addpotchangeHandler(value) {
      let temparray = this.whatdepartmentdata;
      let filter2 = temparray.filter(function(temparray) {
        //对porducts数组对象过滤如果porduct.type === "fruit"就return出去,再用一个变量接住
        return temparray.id === value;
      });
      this.addtempdepartmentname = filter2[0].lable;
      this.addpositiondialogForm.departmentId = value;
    },
    editpotchangeHandler(value) {
      let temparray = this.whatdepartmentdata;
      let filter2 = temparray.filter(function(temparray) {
        //对porducts数组对象过滤如果porduct.type === "fruit"就return出去,再用一个变量接住
        return temparray.id === value;
      });
      this.edittempdepartmentname = filter2[0].lable;
      this.editpositiondialogForm.departmentId = value;
    },
    addpositionsave() {
      if (this.addtempdepartmentname != "") {
        this.adddialogForm.departmentname = this.addtempdepartmentname;
        this.adddialogForm.departmentId = this.addpositiondialogForm.departmentId;
      }
      this.addpositiondialogVisible = false;
    },
    editpositionsave() {
      if (this.edittempdepartmentname != "") {
        this.editdialogForm.departmentName = this.edittempdepartmentname;
        this.editdialogForm.departmentId = this.editpositiondialogForm.departmentId;
      }
      this.editpositiondialogVisible = false;
    },
    addrolesave() {
      this.adddialogForm.rolesname = this.addrolename;
      this.adddialogForm.roles = this.addrolesels;
      this.addroledialogVisible = false;
    },
    editrolesave() {
      this.editdialogForm.roleNams = this.editrolename;
      this.editdialogForm.roles = this.editrolesels;
      this.editroledialogVisible = false;
    },
    settingadd() {
      if (this.adddialogForm.departmentId == "") {
        this.addpositiondialogForm.departmentId = "";
      } else {
        this.addpositiondialogForm.departmentId = this.adddialogForm.departmentId;
      }
      this.addpositiondialogVisible = true;
    },
    settingedit() {
      if (this.editdialogForm.departmentId ==null) {
        this.editpositiondialogForm.departmentId = "";
      } else {
        this.editpositiondialogForm.departmentId = this.editdialogForm.departmentId;
      }
      this.editpositiondialogVisible = true;
    },
    settingroleadd() {
      if (this.adddialogForm.roles.length == 0) {
        this.addrolesels = [];
      } else {
        let temparray = this.adddialogForm.roles;
        let tempaddrole = this.roletableData;
        for (let i = 0; i < temparray.length; i++) {
          let tempstr = temparray[i];
          for (let j = 0; j < tempaddrole.length; j++) {
            if (tempstr == tempaddrole[j].id) {
              this.$refs.multipleTable.toggleRowSelection(tempaddrole[j], true);
            }
          }
        }
        this.addrolesels = this.adddialogForm.roles;
      }
      this.addroledialogVisible = true;
    },
    settingroleedit() {
      if (this.editdialogForm.roles==null||this.editdialogForm.roles=="") {
        this.editrolesels = [];
      } else {
        let temparray = this.editdialogForm.roles.split(',');
        let tempaddrole = this.roletableData;
        for (let i = 0; i < temparray.length; i++) {
          let tempstr = temparray[i];
          for (let j = 0; j < tempaddrole.length; j++) {
            if (tempstr == tempaddrole[j].id) {
              this.$refs.multipleTable.toggleRowSelection(tempaddrole[j], true);
            }
          }
        }
        this.editrolesels = this.editdialogForm.roles;
      }
      this.editroledialogVisible = true;
    },
    //获取所属角色
    getRolelist(params) {
      this.$http.team
        .getUserCompanyRole({})
        .then(
          res => {
            if (res.data.ret == "0") {
              this.roletableData = res.data.content;
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
    // 获取所属部门的数据
    getCompanylist(params) {
      this.$http.team
        .whatOrganization({})
        .then(
          res => {
            if (res.data.ret == "0") {
              this.whatdepartmentdata = res.data.content.children;
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
    addpositionhandleClose() {
      if (this.adddialogForm.departmentId == "") {
        this.adddialogForm.departmentId = "";
        this.adddialogForm.departmentname = "";
      } else {
        this.addtempdepartmentname = this.adddialogForm.departmentname;
      }
      this.addpositiondialogVisible = false;
    },
    editpositionhandleClose() {
      if (this.editdialogForm.departmentId == null) {
        this.editdialogForm.departmentId = "";
        this.editdialogForm.departmentName = "";
      } else {
        this.edittempdepartmentname = this.editdialogForm.departmentName;
      }
      this.editpositiondialogVisible = false;
    },
    addrolehandleClose() {
      this.cleartablecheck();
      this.addroledialogVisible = false;
    },
    editrolehandleClose() {
      this.cleartablecheck();
      this.editroledialogVisible = false;
    },
    addrolecancel() {
      this.cleartablecheck();
      this.addroledialogVisible = false;
    },
    editrolecancel() {
      this.cleartablecheck();
      this.editroledialogVisible = false;
    },
    addpositioncancel() {
      if (this.adddialogForm.departmentId == "") {
        this.adddialogForm.departmentId = "";
        this.adddialogForm.departmentname = "";
      }
      this.addpositiondialogVisible = false;
    },
    editpositioncancel() {
      if (this.editdialogForm.departmentId == "") {
        this.editdialogForm.departmentId = "";
        this.editdialogForm.departmentName = "";
      }
      this.editpositiondialogVisible = false;
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
    // 选中某一项的时候触发
    selsChange(sels) {
      this.sels = sels.map(sels => sels.id);
      console.log(this.sels);
    },
    //添加团队成员
    addmumber() {
      this.adddialogVisible = true;
    },
    changeIsShowDialogalldelete(val) {
      this.sels = [];
      this.isShowDialogalldelete = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    operationalldelete(type) {
      if (type == "confirm") {
        this.daleteprojectallfiles();
        //点击确认要执行的代码
      } else if (type == "cancel") {
        this.sels = [];
        this.isShowDialogalldelete = false;
        //点击取消要执行的代码
      }
    },
    //删除文件
    handleDelete(index, item) {
      this.sels = [];
      this.sels.push(item.id);
      this.isShowDialogalldelete = true;
      this.alldeletecontent = "确定要删除吗？";
    },
    daleteprojectallfiles() {
      let temobj = this.sels;
      // console.log(this.sels);
      this.$http.team
        .deleteTeamMumber(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialogalldelete = false;
              this.$message({
                message: "删除文件成功",
                type: "success"
              });
              this.sels = [];
              this.getTeamList();
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
    addhandleClose() {
      this.$refs["adddialogForm"].resetFields();
      this.adddialogForm.rolesname = "";
      this.adddialogForm.departmentname = "";
      this.adddialogVisible = false;
    },
    edithandleClose() {
      this.$refs["editdialogForm"].resetFields();
      this.editdialogForm.roleNams = "";
      this.editdialogForm.departmentName = "";
      this.editdialogVisible = false;
      this.editdialogForm = {};
    },
    // 删除按钮批量删除数据
    onDeldata() {
      this.sels.map(item => item.id);
      this.isShowDialogalldelete = true;
      this.alldeletecontent = "确定要删除吗？";
    },
    addcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["adddialogForm"].resetFields();
          this.adddialogForm.rolesname = "";
          this.adddialogForm.departmentname = "";
          this.adddialogVisible = false;
        } else {
          this.$refs["adddialogForm"].resetFields();
          this.resetForm(formName);
          this.adddialogForm.rolesname = "";
          this.adddialogForm.departmentname = "";
          this.adddialogVisible = false;
        }
      });
    },
    editcancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["editdialogForm"].resetFields();
          this.editdialogForm.roleNams = "";
          this.editdialogForm.departmentName = "";
          this.editdialogVisible = false;
          this.editdialogForm = {};
        } else {
          this.$refs["editdialogForm"].resetFields();
          this.resetForm(formName);
          this.editdialogForm.roleNams = "";
          this.editdialogForm.departmentName = "";
          this.editdialogVisible = false;
          this.editdialogForm = {};
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.adddialogForm;
          tempobjnew.roles = tempobjnew.roles.toString();
          this.$http.team
            .addTeamMumber(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  let tempcontent = res.data.content.records;
                  this.resetForm(formName);
                  this.adddialogVisible = false;
                  this.adddialogForm = {
                    loginId: "",
                    name: "",
                    password: "",
                    confPassword: "",
                    mail: "",
                    loginId: "",
                    status: "",
                    position: "",
                    departmentId: "",
                    departmentname: "",
                    roles: [],
                    rolesname: ""
                  };
                  this.getTeamList();
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
    //获取编辑数据
    edittable(data) {
      //console.log(data);
      this.getEditData(data.id);
      //this.editdialogForm = data;
      // console.log(this.editdialogForm.departmentName);
      // if(this.editdialogForm.departmentId!=null){
      //   console.log(1111);
      // }
      this.editdialogVisible = true;
    },
    editsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobjnew = this.editdialogForm;
          this.$http.team
            .editTeamMumber(tempobjnew)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.editdialogForm = {};
                  this.resetForm(formName);
                  this.editdialogVisible = false;
                  this.editdialogForm.roleNams = "";
                  this.editdialogForm.departmentName = "";
                  this.getTeamList();
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
    getEditData(data){
      let temobj={id:data};
      this.$http.team
        .getEditData(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
            this.editdialogForm = res.data.content;
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
        .getTeamList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content.records;
              this.pageNum = res.data.content.pageNum;
              this.pageSize = res.data.content.pageSize;
              this.totalPage = res.data.content.totalPage;
              this.totalRecord = res.data.content.totalRecord;
              this.getteamlist = tempcontent;
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
    openEditRadio(v) {
      this.ruleform.status = parseInt(v);
    },
    //重置表单
    resetForm(formName) {
      this.ruleform = {
        name: "",
        phone: "",
        status: ""
      };
    },
    //获取团队列表
    getTeamList() {
      let usercompanyid = this.$store.state.user.userCompanyId;
      // let pid = content.id;
      let tempagesize = this.pageSize;
      let temppagenum = this.pageNum;
      let temobj = { pageSize: tempagesize, pageNum: temppagenum };
      temobj.id = usercompanyid;
      this.$http.team
        .getTeamList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content.records;
              this.pageNum = res.data.content.pageNum;
              this.pageSize = res.data.content.pageSize;
              this.totalPage = res.data.content.totalPage;
              this.totalRecord = res.data.content.totalRecord;
              this.getteamlist = tempcontent;
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
      //this.getlistdata();
      this.getTeamList();
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
.member {
  margin-bottom: 20px;
}
.member .member-titler {
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  margin: 15px 0;
  padding: 0 20px;
}
.member .member-titler /deep/ .el-input {
  font-size: 12px;
}
.member .member-titler /deep/ .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.member .member-titler /deep/ .member-btns {
  padding-top: 9px;
  text-align: right;
  line-height: 1;
  vertical-align: middle;
}
.member .member-titler /deep/ .member-btns > .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.member .member-titler /deep/ .member-btns > .el-button:first-child {
  background: #7b7de5;
  color: #ffffff;
}
.member .member-btns > .el-button {
  background: #7b7de5;
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  padding: 8px 15px;
  border: 1px solid #7b7de5;
}
.member .member-btns.member-btnsnew > .el-button:last-child {
  background: #fff;
  color: #878ea1;
  border: 1px solid #e5e9f6;
}
/* 表格样式部分 */
.member /deep/ .has-gutter tr,
.member /deep/ .has-gutter th {
  background: #f6f6f6;
  padding: 8px 0;
}
.member /deep/ .el-table__row td {
  font-size: 12px;
  padding: 8px 0;
}
.member /deep/ .el-table thead {
  font-size: 13px;
  color: #3b404f;
}
.member /deep/ th,
.member /deep/ td {
  text-align: center;
}
.member .page {
  padding: 15px 20px 15px 0;
  background-color: #ffffff;
}
.member .page .el-pagination {
  text-align: right;
}
.member .page /deep/ .el-pagination__jump {
  margin-left: 0;
}
.member
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
.member-btns /deep/ .el-icon-user.el-icon-teamsetting {
  background: url(../../assets/images/team/teamsetting.png) no-repeat;
  background-size: 100% 100%;
}
.list_page /deep/ .el-input--mini .el-input__inner {
  height: 20px;
  line-height: 20px;
  border: none !important;
}
.mydialog.mydialognew /deep/ .el-dialog .el-dialog__body {
  padding-right: 40px;
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
  cursor: pointer;
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
.tableopt {
  display: none;
}
.tablenew .el-table__row:hover .tableopt {
  display: inline-block;
}
.tablenew .spannamenew {
  display: inline-block;
  margin-left: 15px;
  width: 50px;
}
/* .tablenew .el-table__row:hover .spannamenew {
  margin-right: -31px;
} */
.tablenew /deep/ .el-table .cell {
  text-align: left;
}
.member .member-btns > .el-button.is-disabled {
  opacity: 0.5;
}
.tablenew /deep/ tbody .el-table__row {
  cursor: pointer;
}
.bg-purple .el-radio-group {
  margin-left: 8px;
}
.bg-purple .el-radio-group .el-radio {
  margin-right: 15px;
}
.tablenew /deep/ .el-table thead tr th:first-child .cell,
.tablenew /deep/ .el-table tbody tr td:first-child .cell {
  text-overflow: initial !important;
}
.inputbuttton {
  padding: 9px 10px;
  margin-top: 2px;
  color: #606266;
  display: inline-block;
  float: right;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  /* background: #7b7de5;
  border: 1px solid #e5e9f6;
  color: #fff; */
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  margin-top: 3px;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  font-size: 14px;
  border-radius: 4px;
}
.inputbuttton:hover {
  color: #606266;
  /* background: #7b7de5;
  border: 1px solid #e5e9f6;
  color: #fff; */
}
.el-radio {
  margin-right: 15px;
}
.el-radio__label {
  padding-left: 10px;
}
.mydialogrole /deep/ .el-dialog .el-dialog__body {
  padding-right: 25px !important;
}
.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__header-wrapper{
  border: 1px solid #EBEEF5!important;
}
.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__body-wrapper .el-table__row td:first-child{
  border-left: 1px solid #EBEEF5;
}
.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__body-wrapper .el-table__row td:first-child{
  border-bottom: 1px solid #EBEEF5;
}
.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__body-wrapper .el-table__row:last-child td{
  border-bottom: none;
}
.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__header-wrapper .el-table__header th.is-leaf:last-child,.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__body-wrapper .el-table__row td:last-child{
  border-right: 1px solid #EBEEF5;
}
.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__header-wrapper .el-table__header th.is-leaf:first-child+th.is-leaf,.mydialogrole /deep/ .el-dialog__wrapper .el-dialog__body .el-table__body-wrapper .el-table__row td:first-child+td{
  text-align: left;
}
.mydialogorg /deep/ .el-dialog .el-dialog__body{
  padding: 20px 20px;
}
.mydialog /deep/ .isclick.el-input.is-disabled .el-input__inner{
  cursor: pointer!important;
}
</style>
