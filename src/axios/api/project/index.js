/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const project = {
    // post提交
    //获取获取项目菜单
    getProjectMenu(params) {
        return axios.post(`/team/menu/getProject`, params);
    },
    //获取当前公司下的所以成员
    getCompanylist(params) {
        return axios.post(`/team/company/getMembers`, params);
    },
    //获取当前用户星标项目
    getStarProjectlist(params) {
        return axios.post(`/team/project/getStar`, params);
    },
    //获取当前用户管理项目
    getManageProjectlist(params) {
        return axios.post(`/team/project/getAll`, params);
    },
    //获取当前用户归档项目
    getFileProjectlist(params) {
        return axios.post(`/team/project/getStore`, params);
    },
    //获取当前用户回收站项目
    getRecycleProjectlist(params) {
        return axios.post(`/team/project/getRecycle`, params);
    },
    //获取当前项目的进度
    getProjectProgress(params) {
        return axios.post(`/team/project/getTaskProcess`, params);
    },
    //新建项目
    newProject(params) {
        return axios.post(`/team/project/add`, params);
    },
    //修改项目
    editProject(params) {
        return axios.post(`/team/project/getById`, params);
    },
    //更新项目
    updataProject(params) {
        return axios.post(`/team/project/edit`, params);
    },
    //删除项目
    deleteProject(params) {
        return axios.post(`/team/project/del`, params);
    },
    //按照项目名称排序
    // accProjectnameSort(params) {
    //     return axios.post(`/team/project/del`, params);
    // },
    //按照项目名称排序
    addAsterisk(params) {
        //1:打星，0：取消
        return axios.post(`/team/project/star`, params);
    },
    //获取项目成员
    getProjectMember(params) {
        //1:打星，0：取消
        return axios.post(`/team/project/getMemberStat`, params);
    },
    //项目报告
    getReport(params) {
        //1:打星，0：取消
        return axios.post(`/team/project/getReport`, params);
    },
    //成员项目报告
    getMemberReport(params) {
        //1:打星，0：取消
        return axios.post(`/team/project/getMemberReport`, params);
    },
}

export default project;