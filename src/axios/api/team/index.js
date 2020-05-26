/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const team = {
    // post提交
    //获取团队列表
    getTeamList(params) {
        return axios.post(`/team/company/getMemberList`, params);
    },
    //添加团队成员
    addTeamMumber(params) {
        return axios.post(`/team/user/add`, params);
    },
    //修改团队成员
    editTeamMumber(params) {
        return axios.post(`/team/user/edit`, params);
    },
    //删除团队成员
    deleteTeamMumber(params) {
        return axios.post(`/team/user/delete`, params);
    },
    //获取团队通知
    getTeamNotice(params) {
        return axios.post(`/team/notice/query`, params);
    },
    //新增团队通知
    addTeamNotice(params) {
        return axios.post(`/team/notice/add`, params);
    },
    //编辑团队通知
    editTeamNotice(params) {
        return axios.post(`/team/notice/edit`, params);
    },
    //删除团队通知
    deleteTeamNotice(params) {
        return axios.post(`/team/notice/delete`, params);
    },
    //获取团队操作日志
    getTeamlogs(params) {
        return axios.post(`/team/project/getLogs`, params);
    },
    //角色菜单相关
    //获取角色列表
    getRoleList(params) {
        return axios.post(`/team/role/query`, params);
    },
    //添加角色
    addRole(params) {
        return axios.post(`/team/role/add`, params);
    },
    //获取编辑角色的数据
    geteditRole(params) {
        return axios.post(`/team/role/getPrivileges`, params);
    },
    //编辑角色
    editRole(params) {
        return axios.post(`/team/role/edit`, params);
    },
    //删除角色
    deleteRole(params) {
        return axios.post(`/team/role/delete`, params);
    },
    //获取权限
    getJurisdiction(params) {
        return axios.post(`/team/privilege/query`, params);
    },
    //获取团队组织
    //获取公司部门树形结构
    getOrganization(params) {
        return axios.post(`/team/company/getDepartments`, params);
    },
    //添加部门
    addOrganization(params) {
        return axios.post(`/team/department/add`, params);
    },
    //编辑部门
    editOrganization(params) {
        return axios.post(`/team/department/update`, params);
    },
    //删除部门
    deleteOrganization(params) {
        return axios.post(`/team/department/delete`, params);
    },
    //所属组织
    whatOrganization(params) {
        return axios.post(`/team/company/getDepartment`, params);
    },
    //获取用户权限列表
    getUserCompanyRole(params) {
        return axios.post(`/team/role/getUserCompanyRole`, params);
    },
    //编辑时获取用户的所属组织和权限列表
    getEditData(params) {
        return axios.post(`/team/company/getMemberById`, params);
    }
}
export default team;