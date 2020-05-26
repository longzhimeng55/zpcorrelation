/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '../common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const user = {
    // post提交
    //修改用户的密码
    changePassword(params) {
        //`${base.bd}/user/login`
        return axios.post(`/team/user/edit`, params);
    },
    uploadUserimage(params) {
        //`${base.bd}/user/login`
        return axios.post(`/team/image/upload`, params);
    },
    //获取推送消息
    getUserMsg(params) {
        //`${base.bd}/user/login`
        return axios.post(`/team/sysnotice/query`, params);
    },
}

export default user;