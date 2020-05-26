<template>
  <div class="project" v-loading="loading" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
    <div class="containerTitle">
      <div class="btns">
        <el-button size="mini" round @click="order">
          按项目名称排序
          <i
            v-bind:class="[sortstatus=='upper'?'el-icon-defalut el-icon-up':'el-icon-defalut el-icon-down']"
          ></i>
          <!-- <i class="el-icon-upload el-icon--right"></i> -->
        </el-button>
        <el-button size="mini" round @click="addProject">
          添加项目
          <i class="el-icon-defalut el-icon-add"></i>
        </el-button>
        <el-button size="mini" round>
          过滤筛选
          <i class="el-icon-defalut el-icon-filter"></i>
        </el-button>
      </div>
      <div class="projectName">{{projectType}}</div>
    </div>
    <div class="projectCarts" >
      <el-row :gutter="12" v-model="records">
        <template v-if="records.length!==0">
          <el-col :span="8" v-for="(item,index) in records" :key="index">
            <div class="cart" @click="cartPage(item.id,item.name,item.creatorName)">
              <div class="cart-title">
                <div>
                  <i
                    class="el-icon-star-on"
                    v-bind:class="{classadd:item.star=='1'}"
                    @click.stop="addAsterisk(item)"
                  ></i>
                  <span class="projectname">{{item.name}}</span>
                </div>
                <div v-on:click.stop="more">
                  <el-dropdown placement="bottom">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu>
                      <el-dropdown-item @click.native="editProject(item.id)">编辑</el-dropdown-item>
                      <el-dropdown-item @click.native="deleteProject(item.id)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
                class="progressnew"
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
       <div v-if="loadingnew" style="padding-bottom: 5px;line-height: 20px;text-align: center;"><p style="padding-bottom: 5px;line-height: 20px;text-align: center;">加载中...</p></div>
       <div v-if="noMore" style="padding-bottom: 5px;line-height: 20px;text-align: center;"><p style="padding-bottom: 5px;line-height: 20px;text-align: center;">没有更多了</p></div>
    </div>
    <!-- 添加项目弹出层 -->
    <el-dialog
      title="创建项目"
      width="580px"
      custom-class="addCart"
      :visible.sync="addProjectStyl"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" placeholder="请输入要创建的项目名称"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" :label-width="formLabelWidth" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                size="mini"
                format="yyyy-MM-dd HH:mm"
                value-format="timestamp"
                placeholder="请选择开始时间"
                :picker-options="pickerBeginDateBefore"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间"
              class="form-itemendtime"
              :label-width="formLabelWidth"
              prop="endTime"
            >
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                size="mini"
                format="yyyy-MM-dd HH:mm"
                value-format="timestamp"
                placeholder="请选择结束时间"
                :picker-options="pickerOptionsEnd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mgb">项目成员</div>
        <div class="projectMsg">
          <el-input placeholder="通过姓名或邮箱查找成员" v-model="filterText"></el-input>
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
          <!-- <div class="productVideo">
            <div class="personFind">
              如果您要找的人不在已有列表中,请点击
              <span>邀请</span>
            </div>
            <el-progress :text-inside="true" :stroke-width="10" :percentage="personNums"></el-progress>
            <div class="pNumbers">
              <div>
                成员数量
                <span>1/10</span>
              </div>
              <div class="addCart" @click="addNums">
                <i class="el-icon-circle-plus-outline"></i>
                增加成员上限
              </div>
            </div>
          </div> -->
        </div>
        <el-form-item label="描述信息" prop="desc">
          <!-- <div class="mgtb"></div> -->
          <el-input type="textarea" :rows="3" placeholder="请输入项目描述信息" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addProjectCancel('form')">取消</el-button>
        <el-button type="primary" @click="addProjectnew('form')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑项目-->
    <el-dialog
      title="编辑项目"
      width="580px"
      custom-class="addCart"
      :visible.sync="editproject"
      :before-close="editProjectClose"
      :close-on-click-modal="false"
    >
      <el-form :model="editprojectform" ref="editprojectform" :rules="editprojectrules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editprojectform.name" placeholder="请输入要创建的项目名称"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" :label-width="formLabelWidth" prop="startTime">
              <el-date-picker
                v-model="editprojectform.startTime"
                type="datetime"
                size="mini"
                format="yyyy-MM-dd HH:mm"
                value-format="timestamp"
                placeholder="请选择开始时间"
                :picker-options="editpickerBeginDateBefore"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间"
              class="form-itemendtime"
              :label-width="formLabelWidth"
              prop="endTime"
            >
              <el-date-picker
                v-model="editprojectform.endTime"
                type="datetime"
                size="mini"
                format="yyyy-MM-dd HH:mm"
                value-format="timestamp"
                placeholder="请选择结束时间"
                :picker-options="editpickerOptionsEnd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mgb">项目成员</div>
        <div class="projectMsg">
          <el-input placeholder="通过姓名或邮箱查找成员" v-model="filterText"></el-input>
          <el-tree
            class="filter-tree"
            :data="treedata"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            @check-change="editgetChecked"
            :default-expand-all="false"
            :default-checked-keys="defaultcheckeddata"
            :filter-node-method="filterNode"
            ref="tree"
          ></el-tree>
          <!-- <div class="productVideo">
            <div class="personFind">
              如果您要找的人不在已有列表中,请点击
              <span>邀请</span>
            </div>
            <el-progress :text-inside="true" :stroke-width="10" :percentage="personNums"></el-progress>
            <div class="pNumbers">
              <div>
                成员数量
                <span>1/10</span>
              </div>
              <div class="addCart" @click="addNums">
                <i class="el-icon-circle-plus-outline"></i>
                增加成员上限
              </div>
            </div>
          </div> -->
        </div>
        <el-form-item label="描述信息" prop="desc">
          <!-- <div class="mgtb"></div> -->
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述信息"
            v-model="editprojectform.desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editProjectCancel('editprojectform')">取消</el-button>
        <el-button type="primary" @click="editProjectSave('editprojectform')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 删除项目 -->
    <el-dialog
      title="删除项目"
      width="400px"
      custom-class="addCart"
      :visible.sync="deleteproject"
      :close-on-click-modal="false"
      v-model="deleteprojectid"
    >
      <div>
        <p>确定要删除项目么？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteproject = false">取消</el-button>
        <el-button type="primary" @click="deleteprojectsave(deleteprojectid)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { sortByKey } from "@/libs/util.js";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      count: 12,
      allnumber:0,
      loadingnew: false,
      // 树的输入框的字
      filterText: "",
      // 排序的状态
      sortstatus: "upper",
      treedata: [],
      // treedata: [{
      //     id: 1,
      //     label: '一级 1',
      //     children: [{
      //       id: 4,
      //       label: '二级 1-1',
      //       children: [{
      //         id: 9,
      //         label: '三级 1-1-1'
      //       }, {
      //         id: 10,
      //         label: '三级 1-1-2'
      //       }]
      //     }]
      //   }, {
      //     id: 2,
      //     label: '一级 2',
      //     children: [{
      //       id: 5,
      //       label: '二级 2-1'
      //     }, {
      //       id: 6,
      //       label: '二级 2-2'
      //     }]
      //   }, {
      //     id: 3,
      //     label: '一级 3',
      //     children: [{
      //       id: 7,
      //       label: '二级 3-1'
      //     }, {
      //       id: 8,
      //       label: '二级 3-2'
      //     }]
      //   }],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 添加项目
      addProjectStyl: false,
      // 编辑项目
      editproject: false,
      editprojectid: "",
      loading: true,
      formLabelWidth: "80px",
      projectType: "管理项目",
      // 添加项目
      form: {
        name: "",
        desc: "",
        memberIds: [],
        manager: 1,
        companyId: "", //
        categroyId: null, //
        startTime: "",
        endTime: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入要创建的项目名称", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请输入项目描述信息", trigger: "blur" }
        ]
      },
      // 编辑项目
      editprojectform: {
        name: "",
        desc: "",
        memberIds: [],
        manager: 1,
        companyId: "", //
        categroyId: null, //
        startTime: "",
        endTime: ""
      },
      editprojectrules: {
        name: [
          { required: true, message: "请输入要创建的项目名称", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请输入项目描述信息", trigger: "blur" }
        ]
      },
      // 删除项目
      deleteproject: false,
      deleteprojectid:'',
      pagesize: 12,
      pagenum: 1,
      indexi:"1",
      companyid: "1",
      // 编辑项目时默认选中
      defaultcheckeddata:'',
      records: [],
      checked: true,
      personNums: 50,
      customColor: "#7B7DE5",
      typesMsg: [
        { name: "Late", nums: 5, spans: 4 },
        { name: "Today", nums: 3, spans: 5 },
        { name: "Today", nums: 4, spans: 5 },
        { name: "Upcoming", nums: 8, spans: 6 }
      ],
      checkList: ["选中且禁用", "复选框 A"],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.form.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.form.startTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      editpickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.editprojectform.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      editpickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.editprojectform.startTime;
          // let beginDateVal = this.editprojectform.endTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      }
    };
  },
  computed: {
    //使用计算属性获取vuex中的值
    ...mapState(["userCompanyId"]),
    noMore () {
      return this.count >= this.allnumber;
    },
    disabled () {
      console.log(this.loadingnew);
      console.log(this.noMore);
      //return false;
      //console.log(this.loadingnew || this.noMore);
        return this.loadingnew || this.noMore
    },
  },
  created() {
    // 获取项目列表
    this.getProjectlist();
    // 获取项目类型
    this.projectType = this.$route.meta.fatherTitle;
  },
  methods: {
    ...mapActions("user", ["userProjectId","aginProjectMenu","userProjectName","userProjectOwner"]),
    load () {
      // console.log(this.count)
      // console.log(this.allnumber)
        this.loadingnew = true
        setTimeout(() => {
          this.count+= 12;
          // this.pagesize+= 12;
          this.pagenum+=1;
          this.getloadingProjectlist();
          this.loadingnew = false
        }, 2000)
        // this.records=[];
      },
    //公司成员的树
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
      this.form.memberIds = temparraynew;
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
      this.editprojectform.memberIds =[];
      this.editprojectform.memberIds = temparraynew;
    },
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
              // let tempindexi=this.indexi++;
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
    // 创建项目取消
    handleClose() {
      this.$refs["form"].resetFields();
      this.addProjectStyl = false;
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addProjectCancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.addProjectStyl = false;
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
    //loading 获取项目列表
    getloadingProjectlist() {
      let temobj = {
        pageSize: this.pagesize,
        pageNum: this.pagenum,
        entity: {
          companyId: this.companyid,
          orderBy: 0 //0正序，1反序
        }
      };
      this.$http.project
        .getManageProjectlist(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let temparray = res.data.content.records;
              if (temparray.length != "0") {
                this.records.push(...temparray);
                this.allnumber=res.data.content.totalRecord;
              }else{

              }
              // this.$message({
              //   message: "登录成功",
              //   type: "success"
              // });
              // this.$Message.success("登录成功");
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
    // 获取项目列表
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
        .getManageProjectlist(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let temparray = res.data.content.records;
              if (temparray.length != "0") {
                this.records = temparray;
                this.allnumber=res.data.content.totalRecord;
                this.loading = false;
              }else{
                this.loading = false;
              }
              // this.$message({
              //   message: "登录成功",
              //   type: "success"
              // });
              // this.$Message.success("登录成功");
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
    // 添加项目
    addProject() {
      this.addProjectStyl = !this.addProjectStyl;
      let tempcompanyid = this.$store.state.user.userCompanyId;
      // let tempstartTime=
      this.form.startTime=new Date().getTime();
      //this.form.startTime=new Date(new Date().toLocaleDateString()).getTime();
      this.form.endTime=new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
      this.getCompanylist({ id: tempcompanyid });
    },
    // 添加项目保存
    addProjectnew(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.companyId = this.$store.state.user.userCompanyId;
          this.$http.project
            .newProject(this.form)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.resetForm("form");
                  this.addProjectStyl = false;
                  //告诉父组件重新请求数据
                  let tempindexi=new Date();
                  let temp = { id: tempindexi};
                  this.aginProjectMenu(temp);
                  this.pagenum=1;

                  this.getProjectlist();
                  //console.log(this.disabled);
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
        } else {
          return false;
        }
      });
    },
    defaultchecked(data) {
      // console.log(data);
      this.defaultcheckeddata ='';
      this.defaultcheckeddata = data;
      // if (data != "") {
      //   for (var i = 0; i < data.length; i++) {
      //     this.defaultcheckeddata.push(data[i].id); //循环data的数据，把对应要展开的节点id放入展开的数组中
      //   }
      // }
    },
    // 按钮编辑
    editProject(id) {
      this.editproject = true;
      let tempcompanyid = this.$store.state.user.userCompanyId;
      this.getCompanylist({ id: tempcompanyid });
      this.editprojectid = id;
      let temobj = { id: id };
      this.$http.project.editProject(temobj).then(
        res => {
          if (res.data.ret == "0") {
            // console.log(res.data);
            this.editprojectform = res.data.content;
            let temptreecheckeddata=res.data.content.memberIds;
            this.defaultchecked(temptreecheckeddata);
            // this.getProjectlist();
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
      );
    },
    editProjectClose() {
      this.$refs["editprojectform"].resetFields();
      this.editproject = false;
    },
    // 编辑项目弹框 按钮取消
    editProjectCancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.editproject = false;
      });
    },
    //编辑项目弹框 按钮确定
    editProjectSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temp = formName;
          let temobj = this.editprojectform;
          temobj.id = this.editprojectid;
          this.$http.project
            .updataProject(temobj)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.editproject = false;
                  // this.pagenum=1;
                  this.getProjectlist();
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
    //按钮删除
    deleteProject(id) {
      this.deleteproject = true;
      this.deleteprojectid = id;
    },
    // 删除项目
    deleteprojectsave(id) {
      let temobj = { id: id };
      this.$http.project
        .deleteProject(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              // this.tasklist = res.data.content;
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.deleteproject = false;
              let tempindexi=new Date();
              let temp = { id: tempindexi};
              this.aginProjectMenu(temp);
              this.pagenum=1;
              // this.disabled=false;
              //this.noMore=false;
              this.getProjectlist();
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
    cartPage(id,name,owner) {
      this.$router.push({
        path: "/project/manageProject/cartDetail",
        query: {
          id: id
        }
      });
      let temp = { id: id };
      let temp2={id:name};
      let temp3={id:owner};
      this.userProjectId(temp);
      this.userProjectName(temp2);
      this.userProjectOwner(temp3);
      // this.$router.push("/project/manageProject/cartDetail");
    },
    more() {
      console.log(1111);
    },
    // 增加成员上限
    addNums() {},
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
    }
  }
};
</script>
<style scoped>
.project /deep/ .el-main{
  overflow: initial!important;
}
.project .containerTitle {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 18px 0;
}
.project .containerTitle .btns .el-button {
  background: #7b7de5;
  color: #ffffff;
  font-weight: initial!important;
}
.project .containerTitle .projectName {
  color: #878ea1;
}
/* 项目卡片部分 */
.project .projectCarts{
  /* margin-bottom:5px;
  min-height: 600px;
  height: auto;
  max-height: 600px;
  overflow: auto;
  overflow-x:hidden; */
}
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
  border-radius: 4px 4px 0px 0px;
}
.project .projectCarts .cart .cart-title .el-icon-star-on {
  vertical-align: middle;
  margin-top: -4px;
  cursor: pointer;
}
.project .projectCarts .cart .cart-title .el-icon-star-on:before {
  /* color: #7b7de5; */
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
  background-color: #58A1FF;
  /* background-color: #04bfe0; */
  border-radius: 2px;
}
.project /deep/ .el-dialog__body {
  padding: 20px;
}
.project /deep/ .el-dialog__body .el-form .projectMsg {
  min-height: 150px;
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
  width: 190px;
}
.project /deep/ .el-dialog__body .el-form .el-textarea > .el-textarea__inner {
  /* background: #f6f6f6; */
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
.project /deep/ .form-itemendtime > .el-form-item__label {
  padding: 0 8px 0 0;
}
/* .project /deep/ .el-dialog__body .el-form .el-input__inner{
  border: 1px solid #DCDFE6;
  color: #DCDFE6;
} 
.project /deep/ .el-dialog__body .el-form .el-form-item.is-success .el-input__inner,.project /deep/ .el-dialog__body .el-form  .el-form-item.is-success .el-input__inner:focus,.project /deep/ .el-dialog__body .el-form .el-form-item.is-success .el-textarea__inner,.project /deep/ .el-dialog__body .el-form  .el-form-item.is-success .el-textarea__inner:focus{
  border: 1px solid #409EFF;
} */
.project .projectCarts .cart .cart-title .el-icon-star-on.classadd:before {
  color: #7b7de5;
}

.el-icon-more:focus {
  outline: 0；;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 10px 15px;
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
  background: url("./../assets/images/up.png") no-repeat;
  background-size: 16.5px 11px;
}
.el-icon-defalut.el-icon-down {
  width: 16.5px;
  height: 11px;
  background: url("./../assets/images/down.png") no-repeat;
  background-size: 16.5px 11px;
}
.el-icon-defalut.el-icon-add {
  background: url("./../assets/images/add.png") no-repeat;
  background-size: 14px 14px;
}
.el-icon-defalut.el-icon-filter {
  width: 12px;
  height: 10.3px;
  margin-top: -2px;
  background: url("./../assets/images/filter.png") no-repeat;
  background-size: 12px 10.3px;
}
/*自定义弹框footer样式*/
.project /deep/.el-dialog .el-dialog__footer {
  border: 1px solid #e5e9f6;
  padding: 16px 20px 16px;
}
.project /deep/.el-dialog .el-dialog__footer .dialog-footer .el-button {
  font-size: 14px;
  color: #878ea1;
  padding: 10px 20px;
}
.project
  /deep/.el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button:first-child
  + .el-button {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
}
.project
  /deep/.el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button--primary {
  background: #7b7de5;
  border: 1px solid #e5e9f6;
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

</style>
