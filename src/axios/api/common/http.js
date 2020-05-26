// import Vue from 'vue'
import axios from 'axios';
import router from '@/router';
import { Toast } from 'vant';
import { Loading, Message } from 'element-ui';
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
    Toast({
        message: msg,
        duration: 1300,
        forbidClick: true
    });
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
        router.replace({
            path: '/login',
            // query: {
            //     redirect: router.currentRoute.fullPath
            // }
        });
    }
    /**
     * 请求失败后的错误统一处理
     * @param {Number} status 请求失败的状态码
     */
const errorHandle = (status, other) => {
        // 状态码判断
        switch (status) {
            // 401: 未登录状态，跳转登录页
            case 401:
                toLogin();
                break;
                // 403 token过期
                // 清除token并跳转登录页
            case 403:
                tip('登录过期，请重新登录');
                localStorage.removeItem('team_username');
                setTimeout(() => {
                    toLogin();
                }, 1000);
                break;
                // 404请求不存在
            case 404:
                tip('请求的资源不存在');
                break;
            default:
                console.log(status);
        }
    }
    //axios.defaults.baseURL = "/rest/";
    // 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 300 // 请求超时时间
});
var instance = axios.create({});
//let loadingInstance = Loading.service({});
//loadingInstance.close();
//请求拦截 设置统一header
//instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.interceptors.request.use(
    config => {
        // if (localStorage.xd_token) {
        //     config.headers.Authorization = localStorage.xd_token;
        // }
        //loadingInstance = Loading.service({ text: "加载中..." });
        return config;
    },
    error => {
        //loadingInstance.close();
        return Promise.reject(error);
    }
);
//响应拦截
// instance.interceptors.response.use(
// // 请求成功
// res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
// // 请求失败
// error => {
//     const { response } = error;
//     if (response) {
//         //console.log(response.status);
//         // 请求已发出，但是不在2xx的范围
//         errorHandle(response.status, response.data.message);
//         return Promise.reject(response);
//     } else {
//         // 处理断网的情况
//         // eg:请求超时或断网时，更新state的network状态
//         // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
//         // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
//         //store.commit('changeNetwork', false);
//     }
// });

instance.interceptors.response.use(response => {
    // console.log(response);
    if (response.data.status === "401") {
        Toast({
            mask: true,
            message: '登录过期，请重新登录',
            duration: 1200,
            forbidClick: true
        });
        localStorage.removeItem("xd_token");
        // 跳转登录页面，
        setTimeout(() => {
            router.replace({
                path: '/login',
                // query: {
                //     redirect: router.currentRoute.fullPath
                // }
            });
        }, 1000);
        //loadingInstance.close();
        loadingInstance = Loading.service({ text: "加载中..." });
    } else {
        //loadingInstance.close();
        return response;
    }
}, error => {
    //loadingInstance.close();
    return Promise.reject(error);
});
export default instance;