<template>
<div class="mydialog">
    <el-dialog
            :title="titleText"
            :visible.sync="showDialog"
            :close-on-click-modal="false"
            width="30%"
         >
        <span>{{content}}</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="childOperation('cancel')">{{cancelText}}</el-button>
    <el-button type="primary" @click="childOperation('confirm')">{{confirmText}}</el-button>
  </span>
    </el-dialog>
    </div>
</template>
 
<script>
    export default {
        name: "confirmDialog",
        props:{
            isShowDialogalldelete: {
                type:Boolean,
                default:true
            },
            content:{
                type:String,
                default:'这是一段信息'
            },
            titleText:{
                type:String,
                default:'提示'
            },
            cancelText:{
                type:String,
                default:'取 消'
            },
            confirmText:{
                type:String,
                default:'确 认'
            }
        },
        data() {
            return {
               showDialog:this.isShowDialogalldelete
            };
        },
        created(){
            console.log(this.isShowDialogalldelete);
        },
        methods: {
            childOperation(value) {
                console.log(value);
                this.$emit('child-operation',value);
            }
        },
        watch: {
            isShowDialogalldelete(val) {
                this.showDialog = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
            },
            showDialog(val){
                this.$emit("on-result-changealldelete",val);//③组件内对myResult变更后向外部发送事件通知
            }
        },
    }
</script>
 
<style scoped>
.mydialog /deep/ .el-dialog__header {
  padding: 12px 20px 10px 10px;
  height: 24px;
}
.mydialog /deep/ .el-dialog__title {
  color: #878ea1;
  font-size: 15px;
  line-height: 24px;
}
.mydialog /deep/ .el-dialog__headerbtn {
  top: 14px;
}
.mydialog /deep/ .el-dialog .el-dialog__body {
  padding: 36px 20px;
  text-align: center;
}
.mydialog /deep/ .dialog-footer {
  text-align: center;
}
.mydialog /deep/ .el-dialog .el-dialog__footer .dialog-footer .el-button {
  font-size: 14px;
  color: #878ea1;
  padding: 10px 20px;
 text-align: center;
}
.mydialog /deep/ .el-button:focus,
.mydialog /deep/ .el-button:hover {
  color: #409eff;
  border-color: inherit;
  background-color: inherit;
  border: 1px solid #e5e9f6;
}
.mydialog
  /deep/
  .el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button:first-child
  + .el-button {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
}
.mydialog
  /deep/
  .el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button--primary {
  background: #7b7de5;
  border: 1px solid #e5e9f6;
}
.mydialog /deep/ .el-dialog .el-dialog__footer {
  border: 1px solid #e5e9f6;
  padding: 16px 20px 16px;
  text-align: center;
}
.mydialog /deep/ .el-input__inner{
    height: 30px;
}
</style>

 
