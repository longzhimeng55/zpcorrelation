/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const milestone = {
    // post提交
    //获取里程碑的内容
    getMilestoneList(params) {
        return axios.post(`/team/project/getMilestone`, params);
    },
    //完成和重做任务
    isTaskFinish(params) {
        return axios.post(`/team/task/finish`, params);
    },
}
export default milestone;