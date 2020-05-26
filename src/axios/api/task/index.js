/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const task = {
    // post提交
    //新增看板
    addBoard(params) {
        return axios.post(`/team/project/addList`, params);
    },
    //获取看板顺序
    getBoardlist(params) {
        return axios.post(`/team/project/getListAndTask`, params);
        // return axios.post(`/team/project/getList`, params);
    },
    // 拖动后看板内容的顺序
    orderBoardlist(params) {
        return axios.post(`/team/project/updateTaskListOrder`, params);
    },
    //拖动任务到各个容器中的顺序
    taskOrder(params) {
        return axios.post(`/team/task/editListOrder`, params);
    },
    // 编辑看板内容
    editBoardlist(params) {
        return axios.post(`/team/project/editList`, params);
    },
    //删除看板及看板下的所有内容
    deleteBoardlist(params) {
        return axios.post(`/team/project/deleteList`, params);
    },
    removeBoardList(params) {
        return axios.post(`/team/project/deleteList`, params);
    },
    // 获取任务
    getTaskList(params) {
        return axios.post(`/team/project/getListAndTask`, params);
    },
    // 获取项目中项目成员
    getProjectUser(params) {
        return axios.post(`/team/project/getMembers`, params);
    },
    // 添加任务
    addTask(params) {
        return axios.post(`/team/task/add`, params);
    },
    // 编辑看板列表中的任务卡片
    editTask(params) {
        return axios.post(`/team/task/getById`, params);
    },
    //删除看板下的任务
    deleteTask(params) {
        return axios.post(`/team/task/del`, params);
    },
    // 保存编辑之后的任务的数据
    editTaskSave(params) {
        return axios.post(`/team/task/edit`, params);
    },
    // 添加任务文件
    addTaskFile(params) {
        return axios.post(`/team/task/uploadFile`, params);
    },
    // 下载任务文件
    downloadTaskFile(params) {
        return axios.get(`/team/task/download`, {
            params: params,
            responseType: 'arraybuffer'
        });
    },
    //移动本列表所有任务
    removeListAlltask(params) {
        return axios.post(`/team/task/editLists`, params);
    },
    //单个任务的移动
    removeOnlyTask(params) {
        return axios.post(`/team/task/edit`, params);
    },
    //获取项目中所有的内容
    getTaskListnew(params) {
        return axios.post(`/team/project/getList`, params);
    },
}
export default task;