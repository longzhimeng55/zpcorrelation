/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const schedule = {
    // post提交
    //获取某个月的日程
    getByMonthSchedule(params) {
        return axios.post(`/team/schedule/getByMonth`, params);
    },
    //获取某个周的日程
    getByWeekSchedule(params) {
        return axios.post(`/team/schedule/getByWeek`, params);
    },
    //获取某日的日程
    getByDaySchedule(params) {
        return axios.post(`/team/schedule/getByDay`, params);
    },
    //添加日程
    addSchedule(params) {
        return axios.post(`/team/schedule/add`, params);
    },
    //修改日程
    editSchedule(params) {
        return axios.post(`/team/schedule/edit`, params);
    },
    //删除日程
    deleteSchedule(params) {
        return axios.post(`/team/schedule/delete`, params);
    },
}
export default schedule;