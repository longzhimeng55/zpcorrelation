/**
 * api接口的统一出口
 */
// 登录相关接口
import login from '@/axios/api/login/index.js';
// 用户内容相关接口
import user from '@/axios/api/user/index.js';
// 项目相关接口
import project from '@/axios/api/project/index.js';
// 菜单相关接口
import menu from '@/axios/api/menu/index.js';
// 任务相关接口
import task from '@/axios/api/task/index.js';
// 概览相关接口
import overview from '@/axios/api/overview/index.js';
// 操作日志相关接口
import logs from '@/axios/api/logs/index.js';
// 文件相关接口
import files from '@/axios/api/files/index.js';
// 里程碑菜单相关接口
import milestone from '@/axios/api/milestone/index.js';
// 团队菜单相关接口
import team from '@/axios/api/team/index.js';
// 日程菜单相关接口
import schedule from '@/axios/api/schedule/index.js';
// 导出接口
export default {
    login,
    user,
    project,
    menu,
    task,
    overview,
    logs,
    files,
    milestone,
    team,
    schedule,
    // ……
}