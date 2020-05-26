<template>
  <div class="task">
    <div class="taskDetailNum">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-row :gutter="24">
            <el-col :span="8" class="modelselect">
              <el-button
                class="btn actived"
                size="mini"
                round
                @click="addboard('taskform')"
              >
                添加新看板
                <i class="el-icon-circle-plus-outline"></i>
              </el-button>
            </el-col>
            <el-col class="parttenType" :span="4">
              <el-button class="btn" size="mini" round>
                <i class="el-icon-boardmodels"></i>
                看板模式
              </el-button>
            </el-col>
            <!-- <el-col class="parttenType" :span="8">
              <el-button class="btn" size="mini" round>
                <i class="el-icon-listmodels"></i>
                列表模式
              </el-button>
            </el-col> -->
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="taskSort">
      <draggable
        element="div"
        :options="dragOptions2"
        :move="onMove2"
        v-model="boardcontent"
        @start="startLink($event)"
        @end="endLink($event)"
      >
        <transition-group
          type="transition"
          :name="'flip-link'"
          class="transitionAdd"
          tag="div"
        >
          <div
            class="grid-content"
            v-for="item in boardcontent"
            :key="item.id"
            :id="item.id"
          >
            <div class="toBe">
              <span>{{ item.name }}</span>
              <el-dropdown
                class="more-content"
                trigger="click"
                placement="top-start"
              >
                <span>
                  <i class="el-icon-more" title="更多"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editboard(item)"
                    >编辑看板</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="addboard('taskform')"
                    >在此后添加看板</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="addCart(item.id)"
                    >添加任务</el-dropdown-item
                  >
                  <!-- <el-dropdown-item>设置本列表任务所有者</el-dropdown-item> -->
                  <el-dropdown-item
                    @click.native="removeAllTask(item.id, item.name)"
                    >移动本看板所有任务</el-dropdown-item
                  >
                  <!-- <el-dropdown-item>复制本列表所有任务</el-dropdown-item>
                      <el-dropdown-item @click.native="removeBoard(item.id)"
                        >移动本列表所有任务到回收站</el-dropdown-item
                      > -->
                  <el-dropdown-item @click.native="deleteBoard(item.id)"
                    >删除看板</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <draggable
              class="list-group"
              element="ul"
              v-model="item.taskList"
              :options="dragOptions"
              :move="onMove"
              @start="startActivity($event)"
              @end="endActivity($event, item.id)"
              @change="updateActivity($event, item.id)"
            >
              <transition-group
                type="transition"
                class="list-group"
                name="on"
                tag="ul"
              >
                <div
                  class="seemSty tobeDevelop"
                  v-for="itemnew in item.taskList"
                  v-show="item.taskList.length != 0"
                  :key="itemnew.id"
                  :id="itemnew.id"
                  @click="editrisk(itemnew.id)"
                  :fatherId="itemnew.id"
                >
                  <div :class="addclassStatus(itemnew.level)"></div>
                  <!-- 功能内容部分 -->
                  <div class="contents">
                    <div>
                      <el-dropdown
                        @command="handleCommand"
                        placement="bottom-start"
                        @mouseenter.native="
                          hovertaskstatus(itemnew.id, item.id)
                        "
                      >
                        <span class="el-dropdown-link">
                          <i
                            class="iconseem el-icon-task el-icon-taskusername"
                            title="任务名称"
                          ></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :command="item.id"
                            v-for="(item, index) in removelist"
                            :key="index"
                            >{{ item.name }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                      <span>{{ itemnew.name }}</span>
                    </div>
                    <div>
                      <i
                        class="iconseem el-icon-task el-icon-tasktime"
                        title="任务起止时间"
                      ></i>
                      <span>{{ itemnew.startTime | formatDate }}</span
                      >——
                      <span>{{ itemnew.endTime | formatDate }}</span>
                    </div>
                    <div class="fileslist">
                      <i
                        class="iconseem el-icon-task el-icon-taskfiles"
                        title="任务文件"
                      ></i>
                      <span
                        v-if="itemnew.files.length == 0"
                        class="filesspan"
                        style="color: #878ea1;"
                        >{{ "暂无任务文件信息" }}</span
                      >
                      <span
                        v-else
                        v-for="(itemnew2, indexitemnew2) in itemnew.files"
                        class="filesspan"
                        :key="'itemnew2' + indexitemnew2"
                        >{{ itemnew2.name }}</span
                      >
                      <!-- 功能说明.docx -->
                    </div>
                    <div class="projectWorkers">
                      <i
                        class="iconseem el-icon-task el-icon-taskusers"
                        title="任务相关人员"
                      ></i>
                      <span v-if="itemnew.executorName != null">{{
                        itemnew.executorName
                      }}</span>
                      <span v-else>{{ "暂无相关人员信息" }}</span>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
            <!-- 添加功能按钮 -->
            <div class="addCart" @click="addCart(item.id)">
              <i class="el-icon-circle-plus-outline"></i>
              添加新的任务卡
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <!--添加任务列表 -->
    <el-dialog
      title="创建看板"
      width="400px"
      class="addlistname"
      custom-class="addtasklist"
      :visible.sync="addboardlist"
      :before-close="addboardDialogClose"
      :close-on-click-modal="false"
    >
      <el-form :model="boardform" :rules="ruletask" ref="boardform">
        <el-form-item
          label="看板名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="boardform.name"
            placeholder="请输入看板名称"
            @keyup.enter.native="addboardsava('boardform')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addboardcancel('boardform')">取消</el-button>
        <el-button type="primary" @click="addboardsava('boardform')"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 添加卡片弹出层 -->
    <el-dialog
      title="创建任务"
      width="530px"
      custom-class="addCart"
      :visible.sync="addtask"
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
    >
      <el-form :model="taskform" ref="taskform" :rules="taskformrules">
        <el-form-item
          label="任务标题"
          :label-width="formLabelWidth"
          prop="name"
          class="taskinput"
        >
          <el-input
            v-model="taskform.name"
            placeholder="任务标题尽量简洁清晰"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="任务描述"
          :label-width="formLabelWidth"
          prop="remark"
          class="taskinput"
        >
          <el-input
            v-model="taskform.remark"
            placeholder="任务描述信息"
          ></el-input>
        </el-form-item>
        <div style="float:left;width:100%">
          <div class="mgb" style="float:left;margin-right: 14px;margin-top:9px;">项目成员</div>
          <!-- <div class="projectMsg">
          <el-input placeholder="通过姓名或邮箱查找成员"
                    v-model="filterText"></el-input>
          <el-tree class="filter-tree"
                   :data="treedata"
                   show-checkbox
                   node-key="id"
                   :props="defaultProps"
                   @check-change="getChecked"
                   :default-expand-all="false"
                   :filter-node-method="filterNode"
                   ref="tree"></el-tree>
          <div class="productVideo">
            <div class="personFind">
              如果您要找的人不在已有列表中,请点击
              <span>邀请</span>
            </div>
            <el-progress :text-inside="true"
                         :stroke-width="10"
                         :percentage="personNums"></el-progress>
            <div class="pNumbers">
              <div>
                成员数量
                <span>1/10</span>
              </div>
              <div class="addCart"
                   @click="addNums">
                <i class="el-icon-circle-plus-outline"></i>
                增加成员上限
              </div>
            </div>
          </div>
        </div> -->
          <div class="relateauth" style="float:left;" v-if="setroledata.length != 0">
            <div style="margin: 0px 0;"></div>
            <el-radio-group v-model="taskform.executor">
              <el-radio
                v-for="item in setroledata"
                :label="item.id"
                :key="item.id"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </div>
          <div class="relateauth" v-else>
              <p>暂无相关数据</p>
            </div>
        </div>
        <div class="seemStyle">
          <div class="title">
            <i
              class="seemicon"
              style="font-style:normal;font-size: 13px;margin-right:16px;color: #606266;"
              >添加文件</i
            >
            <el-upload
              class="upload-demo"
              action
              multiple
              ref="upload"
              :file-list="taskform.files"
              :auto-upload="true"
              :http-request="uploadSuccess"
              :on-change="handleChange"
              style="margin-left:-4px"
            >
              <el-button
                size="small"
                icon="el-icon-circle-plus-outline"
                type="primary"
                >添加参考文件</el-button
              >
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
          <div class="file">
            <div v-for="(item, index) in taskform.files" :key="index">
              <span :title="item.name"><i class="bg"></i>{{ item.name }}</span>
              <!-- <div  v-if="item.progressFlag">
                                <el-progress :percentage="item.progressPercent"></el-progress>
                            </div> -->
              <!-- <span v-else-if="item.successFlag">上传成功!</span> -->
              <!-- <span v-else>上传失败!</span> -->
              <!-- <span>{{item.size | fileSize}}</span>
                            <div v-if="item.progressFlag">
                                <span>[删除]</span>
                                <span>[下载]</span>
                            </div> -->
              <div>
                <!-- <span @click="removeFile(item,index)">[删除]</span> -->
                <span
                  title="下载"
                  @click="downLoadFile(item.id, item.name, index)"
                ></span>
              </div>
            </div>
          </div>
          <!-- <el-button icon="el-icon-circle-plus-outline" size="mini">添加参考文件</el-button> -->
        </div>
        <div class="seemStyle tasktime">
          <i
            class="seemicon"
            style="font-style:normal;font-size: 13px;color: #606266;"
            >截止时间</i
          >
          <el-row style="margin-left:4px">
            <el-col style="width:215px">
              <el-form-item
                label
                :label-width="formLabelWidth"
                prop="startTime"
              >
                <el-date-picker
                  v-model="taskform.startTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="pickerBeginDateBefore"
                  placeholder="请选择开始时间"
                ></el-date-picker>
                <span style="padding-left:6px;">至</span>
              </el-form-item>
            </el-col>
            <el-col style="width:180px">
              <el-form-item label :label-width="formLabelWidth" prop="endTime">
                <el-date-picker
                  v-model="taskform.endTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="pickerOptionsEnd"
                  placeholder="请选择结束时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="seemStyle">
          <i
            class="seemicon"
            style="font-style:normal;font-size: 13px;color: #606266;"
            >优先级</i
          >
          <span
            v-for="item in wpList"
            :key="item.name"
            :class="{ active: active == item.name }"
            class="sp sp1"
            style="margin-left:8px"
            @click="selected(item.name, item.value)"
            >{{ item.name }}</span
          >
        </div>
        <div class="seemStyle">
          <i
            class="seemicon"
            style="font-style:normal;font-size: 13px;color: #606266;"
            >挑战系数</i
          >
          <el-rate v-model="taskform.challLevel" :colors="colors"></el-rate>
          <span class="rt">默认三级,难度一般</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskcancel('taskform')">取消</el-button>
        <el-button type="primary" @click="createTask('taskform')"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑看板中任务卡片弹出层 -->
    <el-dialog
      title="编辑任务"
      width="530px"
      custom-class="addCart"
      class="edittaskdialog"
      :visible.sync="edittask"
      :before-close="editTaskDialogClose"
      :close-on-click-modal="false"
    >
      <div class="dialogdropdown">
        <el-dropdown :hide-on-click="false" placement="bottom">
          <span class="el-dropdown-link">
            <i class="el-icon-more" title="更多"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="deleteTask"
              >删除当前任务</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-form
        :model="edittaskboardcontent"
        ref="edittaskboardcontent"
        :rules="edittaskboardcontentformrules"
      >
        <el-form-item
          label="任务标题"
          :label-width="formLabelWidth"
          prop="name"
          class="taskinput"
        >
          <el-input
            v-model="edittaskboardcontent.name"
            placeholder="任务标题尽量简洁清晰"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="任务描述"
          :label-width="formLabelWidth"
          prop="remark"
          class="taskinput"
        >
          <el-input
            v-model="edittaskboardcontent.remark"
            placeholder="任务描述信息"
          ></el-input>
        </el-form-item>
        <div style="float:left;width:100%">
          <div class="mgb" style="float:left;margin-right: 14px;margin-top:9px;">项目成员</div>
          <!-- <div class="projectMsg">
          <el-input placeholder="通过姓名或邮箱查找成员"
                    v-model="filterText"></el-input>
          <el-tree class="filter-tree"
                   :data="treedata"
                   show-checkbox
                   node-key="id"
                   :props="defaultProps"
                   @check-change="getChecked"
                   :default-expand-all="false"
                   :filter-node-method="filterNode"
                   ref="tree"></el-tree>
          <div class="productVideo">
            <div class="personFind">
              如果您要找的人不在已有列表中,请点击
              <span>邀请</span>
            </div>
            <el-progress :text-inside="true"
                         :stroke-width="10"
                         :percentage="personNums"></el-progress>
            <div class="pNumbers">
              <div>
                成员数量
                <span>1/10</span>
              </div>
              <div class="addCart"
                   @click="addNums">
                <i class="el-icon-circle-plus-outline"></i>
                增加成员上限
              </div>
            </div>
          </div>
        </div> -->
          <div class="relateauth" style="float:left;" v-if="setroledata.length != 0">
            <div style="margin: 0px 0;"></div>
            <el-radio-group v-model="edittaskboardcontent.executor">
              <el-radio
                v-for="item in setroledata"
                :label="item.id"
                :key="item.id"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </div>
          <div class="relateauth" v-else>
              <p>暂无相关数据</p>
            </div>
        </div>
        <div class="seemStyle">
          <div class="title">
            <i
              class="seemicon"
              style="font-style:normal;font-size: 13px;color: #606266;margin-right:14px"
              >添加文件</i
            >
            <el-upload
              class="upload-demo"
              action
              multiple
              ref="upload"
              :file-list="edittaskfileList"
              :auto-upload="true"
              :http-request="edittaskuploadSuccess"
              :on-change="handleChange"
              style="margin-left:-4px"
            >
              <el-button
                size="small"
                icon="el-icon-circle-plus-outline"
                type="primary"
                >添加参考文件</el-button
              >
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
          <div class="file">
            <div v-for="(item, index) in edittaskfileList" :key="index">
              <span :title="item.name"><i class="bg"></i>{{ item.name }}</span>
              <!-- <div  v-if="item.progressFlag">
                                <el-progress :percentage="item.progressPercent"></el-progress>
                            </div> -->
              <!-- <span v-else-if="item.successFlag">上传成功!</span> -->
              <!-- <span v-else>上传失败!</span> -->
              <!-- <span>{{item.size | fileSize}}</span>
                            <div v-if="item.progressFlag">
                                <span>[删除]</span>
                                <span>[下载]</span>
                            </div> -->
              <div>
                <!-- <span @click="removeFile(item,index)">[删除]</span> -->
                <span
                  title="下载"
                  @click="downLoadFile(item.id, item.name, index)"
                ></span>
              </div>
            </div>
          </div>
          <!-- <el-button icon="el-icon-circle-plus-outline" size="mini">添加参考文件</el-button> -->
        </div>
        <div class="seemStyle tasktime">
          <i
            class="seemicon"
            style="font-style:normal;font-size: 13px;color: #606266;"
            >截止时间</i
          >
          <el-row style="margin-left:4px">
            <el-col style="width:213px">
              <el-form-item
                label
                :label-width="formLabelWidth"
                prop="startTime"
              >
                <el-date-picker
                  v-model="edittaskboardcontent.startTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="editpickerBeginDateBefore"
                  placeholder="请选择开始时间"
                ></el-date-picker>
                <span style="padding-left:6px;">至</span>
              </el-form-item>
            </el-col>
            <el-col style="width:180px">
              <el-form-item label :label-width="formLabelWidth" prop="endTime">
                <el-date-picker
                  v-model="edittaskboardcontent.endTime"
                  size="mini"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  align="center"
                  :picker-options="editpickerOptionsEnd"
                  placeholder="请选择结束时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="seemStyle">
          <i
            class="seemicon"
            style="font-style:normal;font-size: 13px;color: #606266;"
            >优先级</i
          >
          <span
            v-for="item in edittaskwpList"
            :key="item.name"
            :class="{ active: edittaskactive == item.name }"
            class="sp sp1"
            style="margin-left:8px"
            @click="edittaskselected(item.name, item.value)"
            >{{ item.name }}</span
          >
        </div>
        <div class="seemStyle">
          <i
            class="seemicon"
            style="font-style:normal;font-size: 13px;color: #606266;"
            >挑战系数</i
          >
          <el-rate
            v-model="edittaskboardcontent.challLevel"
            :colors="colors"
          ></el-rate>
          <span class="rt">默认三级,难度一般</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTaskCancel('edittaskboardcontent')"
          >取消</el-button
        >
        <el-button type="primary" @click="editTaskSave('edittaskboardcontent')"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑看板 -->
    <el-dialog
      title="编辑看板"
      width="500px"
      custom-class="addCart"
      :visible.sync="editboardmodal"
      :before-close="editboardDialogClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editboarddata"
        ref="editboarddata"
        :rules="editboarddatarules"
      >
        <el-form-item
          label="看板名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="editboarddata.name" placeholder="请输入看板名称" @keyup.enter.native="addboardsava('boardform')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editboardcancel('editboarddata')">取消</el-button>
        <el-button type="primary" @click="editboardsave('editboarddata')"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除列表 -->
    <el-dialog
      title="移到回收站"
      width="400px"
      custom-class="addCart"
      :visible.sync="removeboard"
      :close-on-click-modal="false"
      v-model="removeboardid"
    >
      <div class="remindermsg">
        <p>您确定要把列表下的所有任务移到回收站吗？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="removeboard = false">取消</el-button>
        <el-button type="primary" @click="removeboardsave(removeboardid)"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除列表 -->
    <el-dialog
      title="删除看板"
      width="500px"
      custom-class="addCart"
      :visible.sync="deleteboard"
      :close-on-click-modal="false"
      v-model="deleteboardid"
    >
      <div>
        <p>确定要删除看板么？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteboard = false">取消</el-button>
        <el-button type="primary" @click="deleteboardsave(deleteboardid)"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除任务 -->
    <el-dialog
      title="删除任务"
      width="400px"
      custom-class="addCart deleteoutline"
      :visible.sync="deletetask"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-model="deletetaskid"
    >
      <div>
        <p>确定要删除任务么？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deletetask = false">取消</el-button>
        <el-button type="primary" @click="deletetasksave(deletetaskid)"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!--移动看板任务-->
    <div class="mydialog">
      <!-- 编辑成员信息 -->
      <el-dialog
        title="移动看板所有任务"
        class=""
        :visible.sync="removealltaskdialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="removealltaskhandleClose"
      >
        <el-form
          ref="removealltaskdata"
          :model="removealltaskdata"
          label-width="80px"
          :rules="removealltaskdatarules"
        >
          <div class="removealltask">
            <p>将{{ this.removealltaskname }}所有任务移动至</p>
            <div>
              <el-form-item label="" class="removealltaskradio" prop="listId">
                <el-radio-group v-model="removealltaskdata.listId">
                  <el-radio
                    v-for="item in removelist"
                    :label="item.id"
                    :key="item.id"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="removealltaskcancel('removealltaskdata')"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="removealltasksave('removealltaskdata')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import Sortable from "sortablejs";
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
      // 树的输入框的字
      filterText: "",
      addtask: false,
      addboardlist: false,
      // 编辑看板
      editboardmodal: false,
      //移动看板所有任务
      removealltaskdialogVisible: false,
      removealltaskname: "",
      removealltaskid: "",
      indextaskid: "",
      removelist: [],
      removealltaskdata: {
        listId: ""
      },
      removealltaskdatarules: {
        listId: [
          { required: true, message: "请选择要移动的项", trigger: "blur" }
        ]
      },
      removealltaskdialogForm: [],
      // 编辑任务卡片
      edittask: false,
      editboarddata: {
        name: ""
      },
      editboarddatarules: {
        name: [{ required: true, message: "请输入看板名称", trigger: "blur" }]
      },
      // 删除列表
      deleteboard: false,
      deleteboardid: "",
      // 删除任务
      deletetask: false,
      deletetaskid: "",
      // 移动列表到回收站
      removeboard: false,
      removeboardid: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      treedata: [],
      formLabelWidth: "80px",
      personNums: 50,
      //星星的颜色
      colors: ["#64dbb7", "#7b7de5", "#ffae38", "#fb5f5a"],
      // 添加任务在看板的位置
      taskboardid: "",
      //任务列表中的任务可以拖动
      taskoptions: {
        group: "a",
        ghostClass: "ghost",
        forceFallback: true,
        scroll: true,
        bubbleScroll: true
      },
      // 添加任务
      taskform: {
        name: "",
        remark: "",
        startTime: "",
        endTime: "",
        challLevel: "",
        level: "", //优先级0:正常 1:紧急 2:非常紧急  可以为空
        categoryId: "", //任务类型  可以为空
        listId: "", //任务看板id  可以为空
        pId: "", //父任务id。可以为空
        executor: "", //任务执行人  可以为空
        isMilestone: "", //是否是里程碑  可以为空
        files: []
      },
      // 编辑看板下面的任务卡片
      edittaskboardcontent: {
        name: "",
        remark: "",
        startTime: "",
        endTime: "",
        challLevel: "",
        level: "", //优先级1:正常 2:紧急 3:非常紧急  可以为空
        categoryId: "", //任务类型  可以为空
        listId: "", //任务看板id  可以为空
        pId: "", //父任务id。可以为空
        executor: "", //任务执行人  可以为空
        isMilestone: "", //是否是里程碑  可以为空
        files: []
      },
      edittaskboardcontentformrules: {
        name: [{ required: true, message: "请输入任务标题", trigger: "blur" }],
        remark: [
          { required: true, message: "请输入任务描述信息", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ]
      },
      //文件列表
      addtaskfileList: [],
      // 编辑任务列表
      edittaskfileList: [],
      taskformrules: {
        name: [{ required: true, message: "请输入任务标题", trigger: "blur" }],
        remark: [
          { required: true, message: "请输入任务描述信息", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ]
      },
      // 看板列表
      boardcontent: [],
      // 编辑看板
      editboardlist: {
        name: ""
      },
      editlistrules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      // 任务列表
      tasklist: [],
      defaultcheckeddata: "",
      wpList: [
        {
          name: "无优先级",
          value: "0"
        },
        {
          name: "低优先级",
          value: "1"
        },
        {
          name: "中优先级",
          value: "2"
        },
        {
          name: "高优先级",
          value: "3"
        }
      ],
      active: "",
      edittaskwpList: [
        {
          name: "无优先级",
          value: "0"
        },
        {
          name: "低优先级",
          value: "1"
        },
        {
          name: "中优先级",
          value: "2"
        },
        {
          name: "高优先级",
          value: "3"
        }
      ],
      edittaskactive: "",
      boardform: {
        name: ""
      },
      ruletask: {
        name: [{ required: true, message: "请输入看板名称", trigger: "blur" }]
      },
      form: {
        title: "",
        describe: "",
        region: "",
        value1: null
      },
      list: [
        {
          title: "222",
          name: "3333",
          description: "888"
        },
        {
          title: "1111",
          name: "5555",
          description: "4444"
        }
      ],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.taskform.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.taskform.startTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      editpickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.edittaskboardcontent.endTime;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      editpickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.edittaskboardcontent.startTime;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      editable: true,
      isDragging: false,
      delayedDragging: false,
      isDragging2: false,
      delayedDragging2: false,
      oldLinkId: 0,
      newLinkId: 0,
      chooiseLinkId: 0,
      //拖动的内容
      draggedcontext: {},
      //已经存在的内容
      relatedContext: {},
      setroledata: [],
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true
    };
  },
  components: {
    draggable
  },
  computed: {
    //使用计算属性获取vuex中的值
    ...mapState(["userProjectId"]),
    dragOptions() {
      return {
        animation: 0,
        group: "description", //不同的group,拖拽层级不同
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    },
    dragOptions2() {
      return {
        animation: 0,
        group: "description2",
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    }
  },
  created() {
    this.getboardlist();
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
    /**
     * @name: cuichuanyou
     * @msg: 内层拖动
     */
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      //console.log(relatedContext, draggedContext);
      //已经存在的内容
      // this.relatedcontext
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    /**
     * @name: cuichuanyou
     * @msg: 外层拖动
     */
    onMove2({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      //console.log(relatedContext, draggedContext)
      return (
        (!relatedElement || !relatedElement.fixed2) && !draggedElement.fixed2
      );
    },
    /**
     * @name: cuichuanyou
     * @msg: 外层开始拖动
     */
    startLink(event) {
      this.isDragging2 = true;
    },
    /**
     * @name: cuichuanyou
     * @msg: 外层结束拖动
     */
    endLink(event) {
      this.isDragging2 = false;
      this.datadragEnd(event);
      //console.log(this.boardcontent)   // CurrentLinkId
    },
    /**
     * @name: cuichuanyou
     * @msg: 内层拖动开始
     */
    startActivity(event) {
      //console.log(event);
      this.isDragging = true;
    },
    /**
     * @name: cuichuanyou
     * @msg: 内层拖动结束
     */
    endActivity(event, id) {
      this.isDragging = false;
      let targetid = this.chooiseLinkId;
      let teamarray = [];
      let teamarray2 = this.boardcontent;
      //console.log(teamarray2);
      if (teamarray2.length != 0) {
        for (let i = 0; i < teamarray2.length; i++) {
          if (teamarray2[i].id == targetid) {
            teamarray = teamarray2[i].taskList;
          }
        }
        //console.log(teamarray);
      }
      if (teamarray.length != 0) {
        for (let j = 0; j < teamarray.length; j++) {
          teamarray[j].listId = targetid;
        }
      }
      //console.log(teamarray);
      this.datadraginlineEnd(event, teamarray);
      // }
      //console.log(event.item)
      // this.datadraginlineEnd (event);
      // console.log(event.newIndex)
      // console.log(event.oldIndex)
      //console.log(event.item.id)   //CurrentActivityId
      // if (this.chooiseLinkId == id) {
      //   //目标id
      //   console.log(id)
      // }else {
      //console.log(this.chooiseLinkId)
      // }
      this.newLinkId = 0;
      this.oldLinkId = 0;
    },
    updateActivity(event, id) {
      if (this.oldLinkId == 0) {
        this.oldLinkId = this.oldLinkId + 1;
      } else {
        this.newLinkId = this.newLinkId + 1;
      }
      if (this.oldLinkId != this.newLinkId) {
        this.chooiseLinkId = id;
      }
    },
    hovertaskstatus(id, idnew) {
      this.indextaskid = id;
      this.gettasklistnew(idnew);
    },
    removealltaskhandleClose() {
      this.$refs["removealltaskdata"].resetFields();
      this.removealltaskdata = { listId: "" };
      this.removealltaskdialogVisible = false;
    },
    //获取看板的所有列表
    gettasklistnew(id) {
      let parmasnew = { projectId: this.$store.state.user.projectId };
      this.$http.task
        .getTaskListnew(parmasnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              let temparray = res.data.content.filter(item => item.id !== id);
              //console.log(temparray);
              this.removelist = temparray;
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
    handleCommand(command) {
      console.log(command);
      let tempobj = { id: this.indextaskid, listId: command };
      this.removeOnlyTask(tempobj);
    },
    removeOnlyTask(tempobj) {
      this.$http.task
        .removeOnlyTask(tempobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.indextaskid = "";
              this.getboardlist();
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
    removeAllTask(id, name) {
      console.log(id);
      this.removealltaskname = name;
      this.removealltaskid = id;
      this.gettasklistnew(id);
      this.removealltaskdialogVisible = true;
    },
    removealltaskcancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.removealltaskdata = { listId: "" };
        this.removealltaskdialogVisible = false;
      });
    },
    removealltasksave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tempobj = { destListId: this.removealltaskdata.listId };
          tempobj.srcListId = this.removealltaskid;
          this.$http.task
            .removeListAlltask(tempobj)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.removealltaskdata = { listId: "" };
                  this.removealltaskdialogVisible = false;
                  this.removealltaskname = "";
                  this.removealltaskid = "";
                  this.getboardlist();
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
      // this.$refs[formName].validate(valid => {
      // this.resetForm(formName);

      // });
    },
    // 编辑任务卡片
    editrisk(parmas) {
      this.edittask = true;
      this.getCompanylist();
      this.editTask(parmas);
    },
    //编辑任务卡片
    editTask(parmas) {
      //console.log(parmas);
      let parmasnew = {
        id: parmas
      };
      this.$http.task
        .editTask(parmasnew)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.edittaskboardcontent = res.data.content;
              //这里项目执行者是单选的，以后可能还要改
              let temparray = [];
              temparray.push(res.data.content.executor);
              this.edittaskfileList = res.data.content.files;
              let tempvalue = res.data.content.level;
              let tempname = "";
              if (tempvalue == 0) {
                tempname = "无优先级";
              } else if (tempvalue == 1) {
                tempname = "低优先级";
              } else if (tempvalue == 2) {
                tempname = "中优先级";
              } else if (tempvalue == 3) {
                tempname = "高优先级";
              }
              this.defaultchecked(temparray);
              this.edittaskselected(tempname, tempvalue);
              this.getboardlist();
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
    editTaskDialogClose() {
      this.$refs["edittaskboardcontent"].resetFields();
      this.edittaskfileList = [];
      this.edittask = false;
    },
    // 选中成员
    defaultchecked(data) {
      // console.log(data);
      this.defaultcheckeddata = "";
      this.defaultcheckeddata = data;
    },
    //删除任务
    deleteTask() {
      this.deletetask = true;
      this.deletetaskid = this.edittaskboardcontent.id;
    },
    deletetasksave(id) {
      let tempobj = { id: id };
      this.$http.task
        .deleteTask(tempobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.$message({
                message: "删除任务成功",
                type: "success"
              });
              this.resetForm("edittaskboardcontent");
              //清除文件列表
              this.$refs.upload.clearFiles();
              // 不知道为什么,评分不能重置
              this.edittaskboardcontent.challLevel = "";
              this.edittaskfileList = [];
              this.edittask = false;
              this.deletetask = false;
              this.getboardlist();
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
    // 取消任务卡片弹框
    editTaskCancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.edittaskfileList = [];
        this.edittask = false;
      });
    },
    editTaskSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.edittaskboardcontent.listId = this.taskboardid;
          //console.log(this.edittaskboardcontent);
          let temparray = this.edittaskboardcontent;
          this.$http.task
            .editTaskSave(temparray)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "编辑任务成功",
                    type: "success"
                  });
                  this.resetForm("edittaskboardcontent");
                  //清除文件列表
                  this.$refs.upload.clearFiles();
                  // 不知道为什么,评分不能重置
                  this.edittaskboardcontent.challLevel = "";
                  this.edittaskfileList = [];
                  this.edittask = false;
                  this.getboardlist();
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
    //拖动任务列表
    dragtask(event) {
      event.stopPropagation();
      event.preventDefault();
    },
    //下载文件
    downLoadFile(data, name) {
      // 取当前路径
      let that = this;
      let uaId = data;
      let filename = name;
      let params = { fileId: uaId };
      this.$http.task.downloadTaskFile(params).then(
        function(response) {
          //console.log(response);
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
    // 优先级
    addclassStatus(i) {
      let inew = parseInt(i);
      switch (inew) {
        case 0:
          return "toBeTit statustype0";
        case 1:
          return "toBeTit statustype1";
        case 2:
          return "toBeTit statustype2";
        case 3:
          return "toBeTit statustype3";
      }
    },
    //拖动效果
    getdata(evt) {
      console.log(evt.draggedContext.element.id);
    },
    datadragEnd(evt) {
      evt.preventDefault();
      let tempcontent = [];
      for (let i = 0; i < this.boardcontent.length; i++) {
        let temobj = {};
        temobj.id = this.boardcontent[i].id;
        temobj.order = i + 1;
        tempcontent.push(temobj);
      }
      this.$http.task
        .orderBoardlist(tempcontent)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.boardcontent = res.data.content;
              this.getboardlist();
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
    datadraginlineEnd(evt, tempcontent) {
      evt.preventDefault();
      // let tempcontent = [];
      // for (let i = 0; i < this.boardcontent.length; i++) {
      //   let temobj = {};
      //   temobj.id = this.boardcontent[i].id;
      //   temobj.order = i + 1;
      //   let temp=this.boardcontent[i].taskList;
      //   // if(this.boardcontent[i].taskList.length!=0){
      //     let temarray=[];
      //     for (let j =0; j<temp.length;j++) {
      //           let temobjnew = {};
      //           temobjnew.id = temp[j].id;
      //           temobjnew.order = j + 1;
      //           temarray.push(temobjnew);
      //     }
      //     console.log(temarray);
      //     temobj.taskList=temarray;
      //     tempcontent.push(temobj);
      //   // }else{
      //   //   tempcontent.push(temobj);
      //   //   temobj.taskList=[];
      //   // }
      // }
      // console.log(tempcontent);
      this.$http.task
        .taskOrder(tempcontent)
        .then(
          res => {
            if (res.data.ret == "0") {
              this.boardcontent = res.data.content;
              this.getboardlist();
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
    //项目成员的树
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取选中的key值
    getChecked(data, checked, node) {
      let id;
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
        id = data.id;
      }
      this.taskform.executor = id;
    },
    // 增加成员上限
    addNums() {},
    // 获取项目成员树的数据
    getCompanylist() {
      let projectid = this.$route.query.id;
      if (projectid == undefined) {
        // 如果重新切换可能projectid找不到了
        projectid = this.$store.state.user.projectId;
      }
      let temobj = { projectId: projectid };
      this.$http.task
        .getProjectUser(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              // this.treedata = res.data.content;
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
    //移动本列表所用任务到回收站
    removeBoard(id) {
      this.removeboard = true;
      this.removeboardid = id;
    },
    removeboardsave(id) {
      let temobj = { id: id };
      // this.$http.task
      //   .removeBoardList(temobj)
      //   .then(
      //     res => {
      //       if (res.data.ret == "0") {
      //         // this.tasklist = res.data.content;
      //         this.$message({
      //           message: "删除成功",
      //           type: "success"
      //         });
      //         this.deleteboard = false;
      //         this.getboardlist();
      //       } else {
      //         this.$message({
      //           message: res.data.msg,
      //           type: "error"
      //         });
      //       }
      //     },
      //     error => {
      //       this.$message({
      //         message: "请求错误",
      //         type: "error"
      //       });
      //     }
      //   )
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    },
    //获取看板列表
    getboardlist() {
      let projectid = this.$route.query.id;
      if (projectid == undefined) {
        // 如果重新切换可能projectid找不到了
        projectid = this.$store.state.user.projectId;
      }
      let temobj = { projectId: projectid };
      this.$http.task
        .getBoardlist(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              let temboardcontent = res.data.content;
              this.boardcontent = res.data.content;
              //创建任务列表内容可以拖动
              for (let i = 0; i < temboardcontent.length; i++) {
                if (temboardcontent[i].taskList.length > 0) {
                  let temname = document.getElementById(temboardcontent[i].id);
                  Sortable.create(temname, this.taskoptions);
                  // let tembctaskList=temboardcontent[i].taskList;
                  // for(let j=0;j<tembctaskList.length;j++){
                  //     Sortable.create(things2, options)
                  // }
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
        .catch(function(error) {
          console.log(error);
        });
    },
    // 编辑任务列表
    editboard(item) {
      this.editboarddata = item;
      this.editboardmodal = true;
    },
    editboardDialogClose() {
      this.$refs["editboarddata"].resetFields();
      this.editboardmodal = false;
    },
    editboardcancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.editboardmodal = false;
      });
    },
    editboardsave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temp = this.editboarddata;
          let temobj = {
            projectId: temp.projectId,
            id: temp.id,
            name: temp.name,
            order: temp.order
          };
          this.$http.task
            .editBoardlist(temobj)
            .then(
              res => {
                if (res.data.ret == "0") {
                  // this.tasklist = res.data.content;
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.editboardmodal = false;
                  this.getboardlist();
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
    // 编辑任务的自定义上传
    edittaskuploadSuccess(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      let tempobj = {};
      // console.log(file.file);
      tempobj.name = file.file.name;
      tempobj.type = file.file.type;
      this.$http.task
        .addTaskFile(formData)
        .then(
          res => {
            if (res.data.ret == "0") {
              tempobj.url = res.data.content;
              this.$message({
                message: "上传文件成功",
                type: "success"
              });
              console.log(this.edittaskfileList);
              this.edittaskboardcontent.files.push(tempobj);
              console.log(this.edittaskboardcontent);
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
    // 添加任务的自定义上传
    uploadSuccess(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      let tempobj = {};
      // console.log(file.file);
      tempobj.name = file.file.name;
      tempobj.type = file.file.type;
      this.$http.task
        .addTaskFile(formData)
        .then(
          res => {
            if (res.data.ret == "0") {
              tempobj.url = res.data.content;
              this.$message({
                message: "上传文件成功",
                type: "success"
              });
              this.taskform.files.push(tempobj);
              console.log(this.taskform.files);
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
    //删除任务列表
    deleteBoard(id) {
      this.deleteboard = true;
      this.deleteboardid = id;
    },
    deleteboardsave(id) {
      let temobj = { id: id };
      this.$http.task
        .deleteBoardlist(temobj)
        .then(
          res => {
            if (res.data.ret == "0") {
              // this.tasklist = res.data.content;
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.deleteboard = false;
              this.getboardlist();
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
    addboard(formName) {
      this.addboardlist = true;
    },
    // 添加看板取消
    addboardDialogClose() {
      this.$refs["boardform"].resetFields();
      this.addboardlist = false;
    },
    // 添加看板取消
    addboardcancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        this.addboardlist = false;
      });
    },
    // 添加看板保存
    addboardsava(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temorder = this.boardcontent.length;
          if (this.boardcontent.length == undefined) {
            this.boardform.order = "1";
          } else {
            this.boardform.order = temorder + 1;
          }
          // if(this.boardcontent.order)
          let projectid = this.$route.query.id;
          if (projectid == undefined) {
            // 如果重新切换可能projectid找不到了
            projectid = this.$store.state.user.projectId;
          }
          this.boardform.projectId = projectid;
          this.$http.task
            .addBoard(this.boardform)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "添加看板成功",
                    type: "success"
                  });
                  this.resetForm("boardform");
                  this.addboardlist = false;
                  this.getboardlist();
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
    handleChange() {
      console.log("changed");
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    // 选择任务中优先级
    selected(name, value) {
      this.taskform.level = value;
      this.active = name;
    },
    edittaskselected(name, value) {
      console.log(1111);
      this.edittaskboardcontent.level = value;
      this.edittaskactive = name;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        attrs: {
          wrap: true
        },
        props: {
          value: this.activeNames
        }
      };
    },
    // 添加新的任务卡
    addCart(id) {
      this.taskboardid = id;
      this.addtask = !this.addtask;
      this.taskform.startTime=new Date().getTime();
      //this.taskform.startTime=new Date(new Date().toLocaleDateString()).getTime();
      this.taskform.endTime=new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
      this.getCompanylist();
      this.selected("无优先级", "");
    },
    // 创建任务x号
    handleDialogClose() {
      this.$refs["taskform"].resetFields();
      //清除文件列表
      this.$refs.upload.clearFiles();
      this.taskform.files=[];
      //清除选中的项目成员
      this.taskform.executor="";
      // 不知道为什么，评分不能重置
      this.taskform.challLevel = "";
      this.addtask = false;
    },
    // 创建任务取消
    taskcancel(formName) {
      this.$refs[formName].validate(valid => {
        this.resetForm(formName);
        //清除文件列表
        this.$refs.upload.clearFiles();
        this.taskform.files=[];
        //清除选中的项目成员
        this.taskform.executor="";
        // 不知道为什么，评分不能重置
        this.taskform.challLevel = "";
        this.addtask = false;
      });
    },
    // 创建任务
    createTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let projectid = this.$route.query.id;
          if (projectid == undefined) {
            // 如果重新切换可能projectid找不到了
            projectid = this.$store.state.user.projectId;
          }
          this.taskform.projectId = projectid;
          this.taskform.listId = this.taskboardid;
          this.$http.task
            .addTask(this.taskform)
            .then(
              res => {
                if (res.data.ret == "0") {
                  this.$message({
                    message: "添加任务成功",
                    type: "success"
                  });
                  this.resetForm("taskform");
                  this.checkedCities = [];
                  //清除文件列表
                  this.$refs.upload.clearFiles();
                  this.taskform.files=[];
                  //清除选中的项目成员
                  this.taskform.executor="";
                  // 不知道为什么,评分不能重置
                  this.taskform.challLevel = "";
                  this.addtask = false;
                  this.getboardlist();
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
    }
  },
  mounted() {
    //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
    isDragging2(newValue) {
      console.log(newValue);
      if (newValue) {
        this.delayedDragging2 = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging2 = false;
      });
    }
  }
};
</script>
<style scoped>
.task {
  height: auto;
}
.task .taskDetailNum {
  margin-top: 20px;
  line-height: 24px;
}
.task .taskDetailNum /deep/ .normalTask {
  text-align: center;
  background: #7b7de5;
  color: #ffffff;
}
.task .taskDetailNum /deep/ .delayTask {
  text-align: center;
  background: #fb5f5a;
  color: #ffffff;
}
.task .taskDetailNum /deep/ .btn.actived {
  text-align: center;
  background: #fb5f5a;
  color: #ffffff;
  padding: 10px 15px;
  background: #7b7de5;
}
.task .taskDetailNum /deep/ .parttenType {
  text-align: center;
}
/* 功能模块部分 */
.task .taskSort {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}
.task .transitionAdd {
  display: flex;
}
.task .taskSort .grid-content {
  height: 100%;
  width: 300px;
  margin-right: 20px;
}
.task .taskSort .grid-content:last-child {
  margin-right: 30px;
}
.task .taskSort .grid-content .toBe {
  width: 300px;
  display: flex;
  justify-content: space-between;
  color: #3b404f;
  font-weight: 500;
  cursor: pointer;
}
.task .taskSort .grid-content .toBe span {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  line-height: 20px;
  color: #3b404f;
}
.task .taskSort /deep/ .el-icon-more {
  font-size: 20px;
  cursor: pointer;
}
.task .taskSort /deep/ .el-icon-chat-dot-square {
  color: #868da1;
  padding: 0 5px 0 10px;
}
.task .taskSort /deep/ .el-icon-apple {
  padding-right: 10px;
}
.grid-content .seemSty {
  margin-top: 10px;
  background: #ffffff;
  box-shadow: 0 0 7px 0 rgba(130, 132, 223, 0.26);
  border-radius: 4px 4px 2px 2px;
  cursor: pointer;
}
.grid-content .toBeTit {
  height: 6px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.grid-content .toBeTit.statustype0 {
  background: #64dbb7;
}
.grid-content .toBeTit.statustype1 {
  background: #7b7de5;
}
.grid-content .toBeTit.statustype2 {
  background: #ffae38;
}
.grid-content .toBeTit.statustype3 {
  background: #fb5f5a;
}
/* 功能卡片内容部分 */
.grid-content .contents {
  padding: 15px 0 16px 15px;
  color: #3b404f;
}
.grid-content .contents > div {
  line-height: 25px;
}
.grid-content .contents > div:last-child {
  color: #878ea1;
}
.grid-content .contents .projectWorkers span {
  padding-right: 5px;
}
.grid-content .contents .iconseem {
  padding-right: 15px;
}
.grid-content .addCart {
  text-align: center;
  height: 35px;
  line-height: 35px;
  background: #ffffff;
  color: #878ea1;
  box-shadow: 0 0 7px 0 rgba(130, 132, 223, 0.26);
  border-radius: 4px;
  margin: 12px 0 10px 0;
  cursor: pointer;
}
/* 添加新卡片 */
.task /deep/.el-dialog .el-dialog__header .el-dialog__title {
  color: #878ea1;
  font-size: 15px;
}
.task /deep/.el-dialog .el-dialog__body {
  padding: 20px 20px 0px;
}
.task /deep/.el-dialog .el-dialog__body /deep/ .el-input {
  font-size: 12px;
}
.task /deep/.el-dialog .el-dialog__body /deep/ .el-form-item__label {
  font-size: 13px;
}
.task /deep/.el-dialog .el-dialog__body /deep/ .el-input > .el-input__inner {
  height: 35px;
  color: #3b404f;
}
.task /deep/.el-dialog .el-dialog__footer {
  border: 1px solid #e5e9f6;
  padding: 16px 20px 16px;
}
.task /deep/.el-dialog .el-dialog__footer .dialog-footer .el-button {
  font-size: 14px;
  color: #878ea1;
  padding: 10px 20px;
}
.task
  /deep/.el-dialog
  .el-dialog__footer
  .dialog-footer
  .el-button:first-child
  + .el-button {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
}
.task /deep/.el-dialog .el-dialog__footer .dialog-footer .el-button--primary {
  background: #7b7de5;
  border: 1px solid #e5e9f6;
}
.addCart .el-dialog__body .seemStyle {
  padding-left: 10px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #878ea1;
}
.addCart .el-dialog__body .seemStyle > .sp10 {
  padding-right: 15px;
}
.addCart .el-dialog__body .seemStyle > .seemicon {
  padding-right: 15px;
  padding-left: 7px;
  font-size: 16px;
}
.addCart .el-dialog__body .seemStyle > .el-icon-time {
  padding: 0 10px;
}
.addCart .el-dialog__body .seemStyle > .sp {
  display: inline-block;
  width: 65px;
  height: 23px;
  line-height: 23px;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 15px;
  text-align: center;
  cursor: pointer;
}
.addCart .el-dialog__body .seemStyle > .sp.active {
  background: #64dbb7;
  color: #ffffff;
}
.addCart .el-dialog__body .seemStyle > .sp + .sp.active {
  background: #7b7de5;
  color: #ffffff;
}
.addCart .el-dialog__body .seemStyle > .sp + .sp + .sp.active {
  background: #ffae38;
  color: #ffffff;
}
.addCart .el-dialog__body .seemStyle > .sp + .sp + .sp + .sp.active {
  background: #fb5f5a;
  color: #ffffff;
}
.addCart .el-dialog__body .seemStyle > .lf {
  padding-right: 15px;
}
.addCart .el-dialog__body .seemStyle > .el-rate {
  display: inline-block;
}
.addCart .el-dialog__body .seemStyle /deep/ .el-rate__item {
  margin-top: -4px;
}
.addCart .el-dialog__body .seemStyle > .rt {
  padding-left: 15px;
}
.addCart .el-dialog__body .seemStyle > .iconx {
  padding: 0 4px;
  font-size: 16px;
  cursor: pointer;
}
/*模式*/
.el-icon-boardmodels,
.el-icon-listmodels {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}
.el-icon-boardmodels {
  background: url("./../../assets/images/task/boardmodels.png") no-repeat;
  background-size: 65% 65%;
  margin-right: -4px;
  margin-top: 2px;
  margin-bottom: -2px;
  vertical-align: middle;
  margin-left: 3px;
}
/*列表模式*/
.el-icon-listmodels {
  background: url("./../../assets/images/task/listmodels.png") no-repeat;
  background-size: 100% 100%;
}
/*添加看板名称*/
.addlistname .dialog-footer {
  text-align: center;
}
.el-dropdown-menu {
  padding: 0px;
}
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background: #ecedfb;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3b404f;
}
.upload-demo {
  display: inline;
}
.el-upload__tip {
  margin-left: 39px;
}
.seemStyle /deep/ .el-upload-list {
  display: none;
  margin-left: 60px;
}
/*下载相关的*/
.file {
  width: auto;
  font-style: normal;
  font-size: 13px;
  color: rgb(96, 98, 102);
  line-height: 25px;
  padding-left: 66px;
  padding-right: 66px;
}
.file > div {
  line-height: 20px;
  padding: 4px 0px;
  height: 20px;
}
.file > div > span {
  /* width:270px; */
  width: 297px;
  font-style: normal;
  font-size: 13px;
  line-height: 25px;
  text-overflow: ellipsis; /*让截断的文字显示为点点。还有一个值是clip意截断不显示点点*/
  white-space: nowrap; /*让文字不换行*/
  overflow: hidden; /*超出要隐藏*/
  color: rgb(96, 98, 102);
  display: inline-block;
  float: left;
}
.file > div > div {
  float: left;
  cursor: pointer;
  display: inline-block;
  margin-left: 10px;
  padding-top: 2px;
}
.file > div > div span {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: url(../../assets/images/task/download.png) no-repeat;
  background-size: 15px 15px;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 8px 10px;
  font-size: 13px;
  border-radius: 4px;
}
.seemStyle /deep/ .el-date-editor.el-input,
.seemStyle /deep/ .el-date-editor.el-input__inner {
  width: 187px;
}
.el-button--primary {
  color: #606266;
  background-color: initial;
  border-color: #dcdfe6;
}
.tasktime {
  display: table;
}
.tasktime /deep/ .el-form-item__content {
  margin-left: 0px !important;
}
.tasktime /deep/ .el-row {
  height: auto;
  margin-top: -29px;
  vertical-align: middle;
  position: relative;
  left: 66px;
}
.tasktime /deep/ .el-form-item {
  margin-bottom: 5px;
}

.task .taskSort /deep/ > div > div > span {
  display: inline-block;
  width: 100%;
  height: auto;
  overflow: auto;
  float: left;
}
.task /deep/ .el-dialog__body .el-form .projectMsg {
  min-height: 150px;
  border: 1px solid #e5e9f6;
  border-radius: 4px;
  padding: 15px 30px 15px 15px;
  margin-bottom: 15px;
}
.task /deep/ .el-dialog__body .el-form .mgb {
  margin-bottom: 10px;
  margin-left: 15px;
  font-size: 13px;
  color: #606266;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.task
  /deep/
  .el-dialog__body
  .el-form
  .productVideo
  .videos
  .el-radio
  > .el-radio__label {
  display: none;
}
.task /deep/ .el-dialog__body .el-form .productVideo .videos {
  margin: 6px 0;
}
.task /deep/ .el-dialog__body .el-form .productVideo .videos > .sp1 {
  padding-right: 15px;
}
.task /deep/ .el-dialog__body .el-form .productVideo .videos > .sp2 {
  padding-right: 42px;
}
.task /deep/ .el-dialog__body .el-form .productVideo .videos > .sp3 {
  padding-right: 42px;
}
.task /deep/ .el-dialog__body .el-form .productVideo .checkboxes > div {
  margin-left: 26px;
  color: #878ea1;
  font-size: 12px;
  margin-top: 3px;
}
.task
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
.task /deep/ .el-dialog__body .el-form .productVideo .personFind {
  color: #878ea1;
  font-size: 12px;
}
.task /deep/ .el-dialog__body .el-form .productVideo .personFind > span {
  color: #8480ed;
  font-size: 13px;
}
.task /deep/ .el-dialog__body .el-form .productVideo .pNumbers {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  font-size: 11px;
  color: #878ea1;
}
.task
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
/*任务卡片外层的div*/
.grid-contentoutline {
  min-height: 1px;
  overflow: auto;
}
/*任务卡片中的几个图标*/
.iconseem.el-icon-task {
  display: inline-block;
  width: 8px;
  height: 15px;
  margin-right: 4px;
  vertical-align: middle;
}
/*用户名*/
.iconseem.el-icon-task.el-icon-taskusername {
  background: url("./../../assets/images/task/tasknamenew.png") no-repeat;
  background-size: 15px 15px;
}
/*时间*/
.iconseem.el-icon-task.el-icon-tasktime {
  background: url("./../../assets/images/task/tasktime.png") no-repeat;
  background-size: 15px 15px;
}
/*文件列表*/
.iconseem.el-icon-task.el-icon-taskfiles {
  background: url("./../../assets/images/task/taskfile.png") no-repeat;
  background-size: 15px 15px;
}
/*用户*/
.iconseem.el-icon-task.el-icon-taskusers {
  background: url("./../../assets/images/task/taskuser.png") no-repeat;
  background-size: 17px 14px;
}
/*点赞*/
.iconseem.el-icon-task.el-icon-taskgoods {
  background: url("./../../assets/images/task/taskgood.png") no-repeat;
  background-size: 15px 15px;
}
/*消息*/
.iconseem.el-icon-task.el-icon-taskmsgs {
  background: url("./../../assets/images/task/taskmsg.png") no-repeat;
  background-size: 15px 15px;
}
.remindermsg {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #878ea1;
  line-height: 24px;
  text-align: center;
  padding: 10px 67px;
}
.seemStyle /deep/ .el-upload-list__item i.el-icon-upload-success:before {
  content: "e720";
}
.seemStyle /deep/ .el-upload-list__item .el-icon-upload-success {
  color: #67c23a;
}
/*添加任务文件时鼠标移入文件列表显示x号屏蔽掉*/
.seemStyle /deep/ .el-upload-list__item:hover .el-icon-close {
  display: none;
}
.seemStyle /deep/ .el-upload-list__item i.el-icon-upload-success:before {
  content: "e720";
}
.fileslist .filesspan {
  display: inline-block;
  margin-left: 25px;
}
.fileslist .filesspan:nth-of-type(1) {
  display: inline-block;
  margin-left: 0px !important;
}
.dialogdropdown {
  position: absolute;
  top: 20px;
  right: 60px;
}
.dialogdropdown .el-icon-more {
  cursor: pointer;
}
.parttenType /deep/ .el-button--mini.is-round:hover,
.parttenType /deep/ .el-button:focus {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}
.taskDetailNum /deep/ .el-icon-circle-plus-outline {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url(../../assets/images/task/add.png) no-repeat;
  background-size: 80% 80%;
  margin-right: -4px;
  margin-bottom: -2px;
  vertical-align: middle;
  margin-left: 2px;
}
.taskDetailNum /deep/ .el-icon-circle-plus-outline:before {
  content: "";
}
.removealltask p {
  text-align: center;
}
.removealltaskradio .el-radio {
  line-height: 35px;
}
.edittaskdialog /deep/ .el-dialog__headerbtn {
  top: 14px!important;
}
.flip-link-move {
  transition: transform 0.5s;
}
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.task .taskDetailNum /deep/ .modelselect.el-col.el-col-8,
.task .taskDetailNum /deep/ .parttenType.el-col.el-col-5 {
  width: initial;
}
.modelselect {
  padding-right: 0px;
}
.task {
  min-width: 100%;
}
.relateauth {
  width: 401px;
  min-height: 0px;
  padding: 7px 10px;
  height: auto;
  max-height: 200px;
  overflow: auto;
  border: 1px solid #e5e9f6;
  margin-bottom: 10px;
}
.relateauth /deep/ .el-radio{
  line-height: 28px;
}
.task /deep/ .addCart .el-dialog__body{
  padding: 30px 20px;
}
</style>
