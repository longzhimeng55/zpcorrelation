<template>
  <div class="file" v-loading="loading">
    <div class="fileTitle">
      <span class="allfiles" @click="getallfiles">全部文件</span>
      <div class="filesbreadcrumb">
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          v-if="filesbreadcrumb.length != 0"
        >
          <el-breadcrumb-item></el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in filesbreadcrumb"
            :key="item.index"
            @click.native="filesBreadcrumb(item, index)"
            >{{ item.name }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <el-button
        size="mini"
        round
        icon="el-icon-folder-add"
        @click="addfilesfolder"
        class="addfilesfolder"
        >新建文件夹</el-button
      >
      <el-upload
        class="upload-demo upload-demofiles"
        action
        multiple
        ref="upload"
        :auto-upload="true"
        :http-request="uploadSuccess"
        style="margin-left:10px"
      >
        <el-button
          class="upDown"
          size="mini"
          round
          icon="el-icon-top el-icon-uploadnew"
          >上传</el-button
        >
      </el-upload>
      <el-button
        class="upDown upDownnew"
        size="mini"
        round
        icon="el-icon-top el-icon-filesload"
        style="margin-left:0px"
        
        >下载</el-button>
      <el-button
        class="upDown"
        size="mini"
        round
        icon="el-icon-bottom el-icon-delete"
        style="margin-left:10px"
        @click="onDeldata" :disabled="this.sels.length === 0"
        >删除</el-button
      >
    </div>
    <div>
      <el-table :data="getfileslist" @selection-change="selsChange">
        <el-table-column
          type="selection"
          width="55"
          prop="id"
        ></el-table-column>
        <el-table-column label="文件名称" width="400">
          <template slot-scope="scope">
            <img
              class="photoName"
              src="../../assets/images/file/imagesdefault.png"
              alt
              v-if="scope.row.type == 1&&(scope.row.fileType=='jpg'||scope.row.fileType=='jpeg'||scope.row.fileType=='png')"
            />
            <img
              class="photoName"
              src="../../assets/images/file/filesfolder.png"
              alt
              v-if="scope.row.type == 2"
            />
            <img
              class="photoName"
              src="../../assets/images/file/rar.png"
              alt
              v-if="scope.row.type == 1&&(scope.row.fileType == 'zip'||scope.row.fileType == 'rar'||scope.row.fileType == 'gz')"
            />
            <span
              :class="[
                scope.row.type == 2 ? 'filesname filesnamenew' : 'filesname'
              ]"
              @click="inmore(scope.row)"
              >{{ scope.row.name }}</span
            >

            <div class="filesopt">
              <i
                v-if="scope.row.type == 1"
                title="下载"
                class="seem seemIcon el-icon-download"
                @click="downLoadFile(scope.$index, scope.row)"
              ></i>
              <!-- <i class="seemIcon el-icon-refresh-right"></i> -->
              <el-dropdown class="dropdownfiles" placement="bottom-start">
                <el-button type="primary">
                  <i class="seemIcon el-icon-edit-outline" title="编辑"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="adddesc(scope.row)"
                    >添加描述</el-dropdown-item
                  >
                  <el-upload
                    v-if="scope.row.type == 1"
                    class="upload-demo upload-demofiles upload-demofilsnew"
                    action
                    multiple
                    :data="scope.row"
                    ref="upload"
                    :http-request="againuploadSuccess"
                    style="margin-left: 0px;margin-right: 0px"
                  >
                    <el-dropdown-item id="filesid" :diy-filesid="scope.row.id"
                      >重新上传</el-dropdown-item
                    >
                  </el-upload>
                  <el-dropdown-item @click.native="rename(scope.row)"
                    >重命名</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <i
                class="seemIcon el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                title="删除"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小">
          <template slot-scope="scope">
            <span>{{
              scope.row.size
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建者"></el-table-column>
        <el-table-column prop="desc" label="描述说明"></el-table-column>
        <el-table-column sortable label="修改时间">
          <template slot-scope="scope">
            <span>{{
              scope.row.updateTime | formatDate
            }}</span>
          </template>
        </el-table-column>
      </el-table>
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
    <div class="mydialog">
      <el-dialog
        title="提示"
        class=""
        :visible.sync="renamedialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="renamehandleClose"
      >
        <el-form
          ref="renamedialogForm"
          :model="renamedialogForm"
          label-width="80px"
          :rules="renamerules"
        >
          <el-form-item label="重命名" prop="name">
            <el-input v-model="renamedialogForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="renamecancel('renamedialogForm')">取消</el-button>
          <el-button type="primary" @click="renamesave('renamedialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!--添加描述-->
    <div class="mydialog">
      <el-dialog
        title="提示"
        class=""
        :visible.sync="adddescdialogVisible"
        width="500px"
        :close-on-click-modal="false"
        :before-close="adddeschandleClose"
      >
        <el-form
          ref="adddescdialogForm"
          :model="adddescdialogForm"
          label-width="0px"
          :rules="adddescrules"
        >
          <el-form-item label="" prop="desc">
            <el-input
              type="textarea"
              v-model="adddescdialogForm.desc"
              placeholder="请输入说明描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adddesccancel('adddescdialogForm')"
            >取消</el-button
          >
          <el-button type="primary" @click="adddescsave('adddescdialogForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/libs/date.js";
import confirmDialog from "@/components/ConfirmDialog.vue"; //组件放在的位置 根据实际修改
import confirmDialogalldelete from "@/components/ConfirmDialogAlldelete.vue"; //组件放在的位置 根据实际修改
// import reName from "@/components/files/rename.vue";
import adddesc from "@/components/files/adddesc.vue";
export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  data() {
    return {
      isShowDialog: false,
      isShowDialogalldelete:false,
      index: 0,
      loading: true,
      isnewfiles:false,
      //删除文件的id
      filesid: "",
      content: "",
      alldeletecontent:"",
      uploadfilesid: "",
      sels: [], //选中的值显示
      selsdownload:[],//选中下载的值的显示
      //文件面包屑
      filesbreadcrumb: [],
      //弹窗
      renamedialogVisible: false,
      adddescdialogVisible: false,
      againuploaddialogVisible: false,
      //重新命名
      renamedialogForm: {},
      //添加描述
      adddescdialogForm: {},
      //重新命名校验
      renamerules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      adddescrules: {
        desc: [{ required: true, message: "请输入说明描述", trigger: "blur" }]
      },
      width: "400px",
      title: "编辑",
      getfileslist: [],
      filefolderindex: ""
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    this.getFilesList();
  },
  methods: {
    //获取当前年月日
    getNowFormatDateymd() {
      let date = new Date();
      let seperator1 = "";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if(month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if(strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
		},
    //获取当前时分秒
    getNowFormatDatehms() {
      let date = new Date();
      let seperator2 = "";
      let h=date.getHours(); 
      let m=date.getMinutes();
      let s=date.getSeconds(); 
      if(h >= 0 && h <= 9) {
        h = "0" + h;
      }
      if(m >= 0 && m <= 9) {
        m = "0" + m;
      }
      if(s >= 0 && s <= 9) {
        s = "0" + s;
      }
      let currentdate = h + seperator2 + m + seperator2 + s;
      return currentdate;
		},
    //获取全部文件
    getallfiles() {
      let projectid = this.$store.state.user.projectId;
      // let pid = content.id;
      let temobj = { projectId: projectid, pId: 0 };
      this.$http.files
        .getFilesList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.filesbreadcrumb = [];
              let tempcontent = res.data.content;
              console.log(tempcontent.length)
              if(tempcontent.length!=0){
                for (var i=0;i<tempcontent.length;i++) {
                  if (tempcontent[i].name=="新建文件夹") {
                    this.isnewfiles=true;
                    break;
                  }else{
                    this.isnewfiles=false;
                  }
                }
              }
              this.getfileslist = tempcontent;
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
    //点击文件名称的面包屑
    filesBreadcrumb(content, index) {
      let indexnew = index + 1;
      this.filesbreadcrumb = this.filesbreadcrumb.slice(0, indexnew);
      // if (content.type == 2) {
      //   if(content.filesnewid==undefined){
      //     let tenmobj = {name: content.name,id: content.id,type:content.type,filesnewid:content.id};
      //     this.filesbreadcrumb.push(tenmobj);
      //   }
      //文件夹pId
      this.filefolderindex = content.id;
      let projectid = this.$store.state.user.projectId;
      let pid = content.id;
      let temobj = { projectId: projectid, pId: pid };
      this.$http.files
        .getFilesList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content;
              console.log(tempcontent.length)
              if(tempcontent.length!=0){
                for (var i=0;i<tempcontent.length;i++) {
                  if (tempcontent[i].name=="新建文件夹") {
                    this.isnewfiles=true;
                    break;
                  }else{
                    this.isnewfiles=false;
                  }
                }
              }
              this.getfileslist = tempcontent;
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
    //进入文件夹中
    inmore(content) {
      if (content.type == 2) {
        if (content.filesnewid == undefined) {
          let tenmobj = {
            name: content.name,
            id: content.id,
            type: content.type,
            filesnewid: content.id
          };
          this.filesbreadcrumb.push(tenmobj);
        }
        //文件夹pId
        this.filefolderindex = content.id;
        let projectid = this.$store.state.user.projectId;
        let pid = content.id;
        let temobj = { projectId: projectid, pId: pid };
        this.$http.files
          .getFilesList(temobj)
          .then(
            res => {
              if (res.data.ret == "0") {
                let tempcontent = res.data.content;
                console.log(tempcontent.length)
                if(tempcontent.length!=0){
                for (var i=0;i<tempcontent.length;i++) {
                  if (tempcontent[i].name=="新建文件夹") {
                    this.isnewfiles=true;
                    break;
                  }else{
                    this.isnewfiles=false;
                  }
                }
              }
                this.getfileslist = tempcontent;
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
    beforeUpload(file) {
      console.log(file);
    },
    //重命名
    rename(row) {
      this.renamedialogVisible = true;
      this.renamedialogForm = row;
    },
    //添加描述
    adddesc(row) {
      this.adddescdialogForm = row;
      this.adddescdialogVisible = true;
    },
    //重命名右上角取消
    renamehandleClose() {
      this.$refs["renamedialogForm"].resetFields();
      this.renamedialogVisible = false;
    },
    //重命名右上角取消
    adddeschandleClose() {
      this.$refs["adddescdialogForm"].resetFields();
      this.adddescdialogVisible = false;
    },
    // 添加看板取消
    adddesccancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.adddescdialogVisible = false;
      });
    },
    renamecancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.renamedialogVisible = false;
      });
    },
    renamesave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temparray = this.renamedialogForm;
          this.$http.files
            .editProjectFiles(temparray)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.renamedialogVisible = false;
                  this.getFilesList();
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
    adddescsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temparray = this.adddescdialogForm;
          this.$http.files
            .editProjectFiles(temparray)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.adddescdialogVisible = false;
                  this.getFilesList();
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
    //重置表单元素
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加任务的自定义上传
    uploadSuccess(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      let tempobj = {};
      // console.log(file.file);
      tempobj.name = file.file.name;
      tempobj.projectId = this.$store.state.user.projectId;
      tempobj.type = file.file.type;
      this.$http.files
        .uploadFiles(formData)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempobjnew = res.data.content;
              tempobjnew.projectId = this.$store.state.user.projectId;
              tempobjnew.name = tempobj.name;
              tempobjnew.pId = null;
              this.createProjectFiles(tempobjnew);
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
    againuploadSuccess(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      let tempobj = {};
      // console.log(file.file);
      tempobj.name = file.file.name;
      tempobj.projectId = this.$store.state.user.projectId;
      tempobj.type = file.file.type;
      this.$http.files
        .uploadFiles(formData)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempobjnew = res.data.content;
              tempobjnew.projectId = this.$store.state.user.projectId;
              tempobjnew.name = tempobj.name;
              tempobjnew.id = this.uploadfilesid;
              this.uploadProjectFiles(tempobjnew);
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
    // //新建文件夹
    addfilesfolder() {
     let temobj={};
      // console.log(1111);
      if(this.isnewfiles==false){
        temobj = {
          projectId: this.$store.state.user.projectId,
          name: "新建文件夹",
          pId: 0
        };
      }else{
         temobj = {
          projectId: this.$store.state.user.projectId,
          name: "新建文件夹_"+this.getNowFormatDateymd()+'_'+this.getNowFormatDatehms(),
          pId: 0
        };
      }
      if (this.filefolderindex != "") {
        temobj.pId = this.filefolderindex;
      }
      this.$http.files
        .addProjectCatalog(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.index++;
              if(this.isnewfiles==false){
                this.getfileslist.push({
                id: "",
                type: 2,
                name: "新建文件夹",
                size: "",
                creatorName: "",
                desc: "",
                index: this.getNowFormatDateymd()+this.getNowFormatDatehms()
              });
              }else{
                this.getfileslist.push({
                  id: "",
                  type: 2,
                  name: "新建文件夹_"+this.getNowFormatDateymd()+'_'+this.getNowFormatDatehms(),
                  size: "",
                  creatorName: "",
                  desc: "",
                  index: this.getNowFormatDateymd()+this.getNowFormatDatehms()
                });
              }
              this.isShowDialog = false;
              this.$message({
                message: "添加目录成功",
                type: "success"
              });
              let tempobj = {};
              if (this.filefolderindex != "") {
                temobj.pId = this.filefolderindex;
              } else {
                temobj.pId = "";
              }
              this.getFilesList(tempobj);
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
    operation(type) {
      if (type == "confirm") {
        this.daleteprojectfiles();
        //点击确认要执行的代码
      } else if (type == "cancel") {
        this.isShowDialog = false;
        //点击取消要执行的代码
      }
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
    changeIsShowDialog(val) {
      console.log(val);
      this.isShowDialog = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    changeIsShowDialogalldelete(val) {
      console.log(val);
      this.isShowDialogalldelete = val; //监听变化时触发的函数修改父组件的是否显示状态
    },
    //上传
    upload() {
      this.dialogreport = true;
    },
    //下载
    downLoadFile(index, row) {
      // 取当前路径
      let that = this;
      let filename = row.name;
      let params = { fileId: row.id };
      this.$http.files.downloadfiles(params).then(
        function(response) {
          console.log(response);
          that.content = response.data;
          const blob = new Blob([that.content]);
          if (window.navigator.msSaveOrOpenBlob) {
            // 兼容IE10
            navigator.msSaveBlob(blob, filename);
          } else {
            //  chrome/firefox
            let aTag = document.createElement("a");
            aTag.download = filename;
            aTag.href = URL.createObjectURL(blob);
            aTag.click();
            URL.revokeObjectURL(aTag.href);
          }
        },
        function(response) {
          // 发生错误
          that.$Message.error("下载失败,请检查接口是否正常!");
        }
      );
    },
    //刷新
    //编辑文件
    //删除文件
    handleDelete(index, row) {
      this.filesid = row.id;
      this.isShowDialog = true;
      this.content = "确定要删除该文件吗？";
    },
    // 选中某一项的时候触发
    selsChange(sels) {
      console.log(sels);
      // if(sels.type==1){
      //   this.sels = sels.map(sels => sels.id);
      // }
      this.sels = sels.map(sels => sels.id);
      console.log(this.sels);
    },
    // 删除按钮批量删除数据
    onDeldata() {
      this.sels.map(item => item.id);
      this.isShowDialogalldelete = true;
      this.alldeletecontent = "确定要删除吗？";
      // this.$Modal.confirm({
      //   title: "提示",
      //   content: "确定要删除吗？与该公司相关信息都将会被删除,请慎重！",
      //   loading: this.loading,
      //   onOk: () => {
      //     this.daleteprojectfiles(ids);
      //   }
      // });
    },
    daleteprojectallfiles() {
      let temobj = this.sels;
      console.log(this.sels);
      this.$http.files
        .deleteProjectAllFiles(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialogalldelete = false;
              this.$message({
                message: "删除文件成功",
                type: "success"
              });
              this.sels=[];
              this.getFilesList();
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
    daleteprojectfiles(idnew) {
      let temobj = { id: this.filesid };
      this.$http.files
        .deleteProjectFiles(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.isShowDialog = false;
              this.$message({
                message: "删除文件成功",
                type: "success"
              });
              this.getFilesList();
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
    //创建项目文件
    createProjectFiles(params) {
      let temobj = params;
      console.log(this.filefolderindex);
      if (this.filefolderindex != "") {
        temobj.pId = this.filefolderindex;
      }
      this.$http.files
        .createProjectFiles(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.$message({
                message: "上传文件成功",
                type: "success"
              });
              this.getFilesList();
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
    uploadProjectFiles(params) {
      let filesid = document
        .getElementById("filesid")
        .getAttribute("diy-filesid");
      let temobj = params;
      temobj.id = filesid;
      this.$http.files
        .editProjectFiles(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.$message({
                message: "上传文件成功",
                type: "success"
              });
              this.getFilesList();
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
    getFilesList() {
      let projectid = this.$store.state.user.projectId;
      let temobj = { projectId: projectid };
      if (this.filefolderindex != "") {
        temobj.pId = this.filefolderindex;
      }
      this.$http.files
        .getFilesList(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let tempcontent = res.data.content;
              console.log(tempcontent.length)
              if(tempcontent.length!=0){
                for (var i=0;i<tempcontent.length;i++) {
                  if (tempcontent[i].name=="新建文件夹") {
                    this.isnewfiles=true;
                    break;
                  }else{
                    this.isnewfiles=false;
                  }
                }
              }else{
                this.isnewfiles=false;
              }
              this.getfileslist = tempcontent;
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
  components: { confirmDialog, adddesc,confirmDialogalldelete }
};
</script>
<style scoped>
.file {
  height: 100%;
}
.file .fileTitle {
  padding: 20px 0;
}
.file .fileTitle span {
  font-size: 14px;
  color:#878EA1;
  /* padding-right: 15px; */
}
.file .fileTitle .el-button {
  padding: 8px 15px;
}
.file .fileTitle .el-button.is-disabled {
 opacity: .5;
}
.file .fileTitle .upDown {
  background: #7b7de5;
  color: #ffffff;
}
.file .fileTitle .upDown.upDownnew {
  padding: 5px 15px;
}
.file /deep/ .el-table thead {
  font-size: 13px;
  opacity: initial !important;
}
.file /deep/ .photoName {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.file /deep/ .seem {
  padding-left: 16px;
}
.file /deep/ span.filesname {
  display: inline-block;
  margin-left: 15px;
  width: 250px;
  line-height: 20px;
  vertical-align: middle;
  overflow: hidden; 
  text-overflow:ellipsis; 
  white-space: nowrap;
}
.file /deep/ span.filesname.filesnamenew {
  cursor: pointer;
}
.file /deep/ span.filesname.filesnamenew:hover {
  /* color: #409eff; */
}
.file /deep/ .seemIcon {
  padding-right: 15px;
  font-size: 16px;
  cursor: pointer;
}
/* 表格样式部分 */
.file /deep/ .has-gutter tr,
.file /deep/ .has-gutter th {
  background: #f6f6f6;
  padding: 4px 0;
  line-height: 28px;
}
.file /deep/ .el-table__row td {
  font-size: 12px;
  padding: 8px 0;
  color: #606266;
}
.file /deep/ .el-table thead {
  font-size: 13px;
  color: #3b404f;
}
.file /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #ebebf3;
}
/*自定义上传图标*/
.fileTitle /deep/ .el-icon-top.el-icon-uploadnew {
  display: inline-block;
  vertical-align: middle;
  width: 12px;
  height: 12px;
  background: url(../../assets/images/file/upload.png) no-repeat;
  background-size: 100% 100%;
  margin-top: -3px;
}
.fileTitle /deep/ .el-icon-top:before {
  content: "";
}
.file /deep/ .el-table th > .cell {
  font-size: 15px;
  color: #3b404f;
  /* font-weight: initial; */
}
/*自定义上传*/
.upload-demofiles {
  margin-left: 10px;
  margin-right: 10px;
  display: inline-block;
}
.upload-demo.upload-demofiles .el-upload .el-button {
  padding: 7px 15px !important;
}
.upload-demo.upload-demofiles /deep/ .el-upload-list {
  display: none;
}
.dropdownfiles /deep/ .el-button {
  padding: 0px !important;
}
.dropdownfiles /deep/ .el-button--primary {
  color: initial;
  background: none !important;
  border: none !important;
}
.upload-demofiles.upload-demofilesnew {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.fileTitle /deep/ .el-icon-folder-add:before {
  content: "";
}
.fileTitle /deep/ .el-icon-folder-add {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
  background: url(../../assets/images/file/newmake.png) no-repeat;
  background-size: 75% 75%;
  margin-right: -2px;
}
.fileTitle /deep/ .el-icon-filesload {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  vertical-align: middle;
  background: url(../../assets/images/file/filesdownloadopen.png) no-repeat;
  background-size: 75% 75%;
  margin-right: -4px;
}
.filesopt /deep/ .el-icon-edit-outline:before,
.filesopt /deep/ .el-icon-delete:before,
.filesopt /deep/ .el-icon-download:before {
  content: "";
}
.filesopt /deep/ .el-icon-edit-outline {
  display: inline-block;
  /* width: 5px; */
  height: 15px;
  margin-right: 16px;
  vertical-align: middle;
  background: url(../../assets/images/file/editfiles.png) no-repeat;
  background-size: 100% 100%;
  margin-top: -2px;
}
.filesopt /deep/ .el-icon-delete {
  display: inline-block;
  /* width: 5px; */
  height: 15px;
  margin-right: 5px;
  vertical-align: middle;
  background: url(../../assets/images/file/deletefiles.png) no-repeat;
  background-size: 100% 100%;
  margin-top: -2px;
}
.filesopt /deep/ .el-icon-download {
  display: inline-block;
  /* width: 5px; */
  height: 15px;
  margin-right: 1px;
  vertical-align: middle;
  background: url(../../assets/images/file/filesdownload.png) no-repeat;
  background-size: 50% 100%;
  margin-top: -2px;
}
.mydialog /deep/ .el-dialog__body .el-form .el-textarea > .el-textarea__inner {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
}
.mydialog
  /deep/
  .el-dialog__body
  .el-form
  .el-textarea
  > .el-textarea__inner::-webkit-input-placeholder {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
}

.mydialog
  /deep/
  .el-dialog__body
  .el-form
  .el-textarea
  > .el-textarea__inner:-moz-placeholder {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
}

.mydialog
  /deep/
  .el-dialog__body
  .el-form
  .el-textarea
  > .el-textarea__inner::-moz-placeholder {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
}
.mydialog
  /deep/
  .el-dialog__body
  .el-form
  .el-textarea
  > .el-textarea__inner:-ms-input-placeholder {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
}
.fileTitle .allfiles {
  display: inline-block;
  vertical-align: middle;
  width: auto;
  /* height: 20px; */
  line-height: 1;
  cursor: pointer;
}
/*自定义文件面包屑*/
.filesbreadcrumb {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  margin-left: 3px;
  margin-right: 8px;
}
.filesbreadcrumb /deep/ .el-breadcrumb__item .el-breadcrumb__inner {
  cursor: pointer;
  color: #3B404F;
  font-weight: initial;
}
.fileTitle .allfiles:hover,
.filesbreadcrumb /deep/ .el-breadcrumb__inner:hover {
  /* color: #409eff; */
}
/*自定义按钮的样式*/
.filesopt {
  /* display: inline-block; */
  float: right;
}
.filesopt {
  display: none;
}

.el-table__row:hover .filesopt {
  display: inline-block;
}
.fileTitle /deep/ .el-button.addfilesfolder{
  padding: 4px 15px!important;
  line-height: 1;
  background: #fff;
}
.fileTitle /deep/ .el-button.addfilesfolder:focus,.fileTitle /deep/ .el-button.addfilesfolder:hover {
  color: #606266;
  border: 1px solid #DCDFE6;
}
.fileTitle /deep/ i.el-icon-folder-add {
  margin-top: 3px;
  line-height: 1;
}
.fileTitle /deep/ .addfilesfolder> span {
  vertical-align: middle;
  font-weight: initial!important;
}
</style>
