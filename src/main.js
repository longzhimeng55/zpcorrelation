import Vue from 'vue'
import App from './App.vue'
import promise from 'es6-promise';
promise.polyfill();
//import iView from 'iview';
//import 'iview/dist/styles/iview.css'; // 使用 CSS
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store';
import instance from './axios/api/common/index.js' // 导入api接口
//import instance from './axios/api/common/http.js' // 导入api接口
import htmlToPdf from './utils/htmlToPdf.js' //导出pdf
import Print from './utils/print.js'
import FullCalendar from 'vue-fullcalendar'
Vue.use(FullCalendar)
Vue.use(htmlToPdf);
Vue.use(Print);
// 引入echarts
import echarts from 'echarts'
import '../static/css/global.css'
import 'fullcalendar/dist/fullcalendar.css'
// 添加IE兼容
import '@babel/polyfill';
//import 'babel-polyfill'
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = instance; // 将api挂载到vue的原型上
Vue.config.productionTip = false;

// 设置title
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.team_username ? true : false;
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.path == "/login") {
        next();
    } else {
        isLogin ? next() : next("/login");
    }
    // next()
});
// Vue.use(iView)
Vue.use(ElementUI)
new Vue({
    render: h => h(App),
    router,
    store,
    components: { App },
}).$mount('#app')