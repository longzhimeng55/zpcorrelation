/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const overview = {
    // post提交
    //获取概览中的相关内容
    getOverviewList(params) {
        return axios.post(`/team/project/getDesc`, params);
    },
}

export default overview;