/**
 * article模块接口列表
 */
import base from '../common/base.js'; // 导入接口域名列表
import axios from '@/axios/api/common/http.js'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const files = {
    // post提交
    //获取文件列表
    getFilesList(params) {
        return axios.post(`/team/project/getFile`, params);
    },
    //获取文件所占的容量
    getAllFilesSize(params) {
        return axios.post(`/team/project/getFileSize`, params);
    },
    //上传文件
    uploadFiles(params) {
        return axios.post(`/team/project/uploadFile`, params);
    },
    //创建项目文件
    createProjectFiles(params) {
        return axios.post(`/team/project/addFile`, params);
    },
    //下载文件
    downloadfiles(params) {
        return axios.get(`/team/project/download`, {
            params: params,
            responseType: 'arraybuffer'
        });
    },
    //删除项目文件
    deleteProjectFiles(params) {
        return axios.post(`/team/project/deleteFile`, params)
    },
    //批量删除项目文件
    deleteProjectAllFiles(params) {
        return axios.post(`/team/project/deleteFiles`, params)
    },
    //新建项目目录
    addProjectCatalog(params) {
        return axios.post(`/team/project/createDir`, params)
    },
    //编辑文件
    editProjectFiles(params) {
        return axios.post(`/team/project/updateFile`, params)
    },
}
export default files;