/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '../common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const login = {
    // post提交
    //登录
    login(params) {
        //`${base.bd}/user/login`
        return axios.post(`/team/user/login`, params);
    },
    //退出
    // loginOut(params) {
    //     return axios.post(`/user/logout`, qs.stringify(params));
    // },
    //退出
    loginOut() {
        return axios.post(`/team/user/logout`);
    },
    // 获取用户所有公司的信息
    getCompanylist() {
        return axios.post(`/team/company/get`);
    }
}

export default login