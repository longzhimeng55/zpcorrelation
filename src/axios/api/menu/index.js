/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const menu = {
    // post提交
    //获取当前用户所有的项目列表
    getProjectlist(params) {
        return axios.post(`/team/project/get`, params);
    },
    //新建项目
    newProject(params) {
        return axios.post(`/team/project/add`, params);
    },
    //修改项目
    editProject(params) {
        return axios.post(`/team/project/update`, params);
    },
    //删除项目
    deleteProject(params) {
        return axios.post(`/team/project/del`, params);
    },
}

export default menu;