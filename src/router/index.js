import Vue from 'vue'
import VueRouter from 'vue-router'

// 按模块管理引用路由
// import login from './login'

Vue.use(VueRouter)
const routes = [
    // 空地址跳转至home页面
    {
        path: '',
        name: 'login',
        redirect: '/login',
        meta: {
            title: '登录页'
        },
        component: resolve => require(['@/views/login/login.vue'], resolve)
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录页'
        },
        component: resolve => require(['@/views/login/login.vue'], resolve)
    },
    {
        path: '/project',
        name: 'project',
        meta: {
            title: '项目'
        },
        redirect: '/project/manageProject',
        component: resolve => require(['@/views/Projects.vue'], resolve),
        children: [{
                path: '/project/starProject',
                name: 'starProject',
                meta: {
                    title: '星标项目',
                    fatherTitle: '星标项目'
                },
                component: resolve => require(['@/views/project/StarProject.vue'], resolve),
            },
            {
                path: '/project/manageProject',
                name: 'ManageProject',
                meta: {
                    title: '管理项目',
                    fatherTitle: '管理项目'
                },
                redirect: '/project/manageProject/cart',
                component: resolve => require(['@/views/project/ManageProject.vue'], resolve),
                children: [{
                        path: '/project/manageProject/cart',
                        name: 'cart',
                        meta: {
                            title: '项目卡片',
                            fatherTitle: '管理项目'
                        },
                        component: resolve => require(['@/components/Cart.vue'], resolve),
                    },
                    {
                        path: '/project/manageProject/cartDetail',
                        name: 'cartDetail',
                        meta: {
                            title: '卡片详情',
                            fatherTitle: '管理项目'
                        },
                        redirect: '/project/manageProject/cartDetail/',
                        component: resolve => require(['@/components/CartDetail.vue'], resolve),
                        children: [{
                                path: '/project/manageProject/cartDetail/overview',
                                name: 'overview',
                                meta: {
                                    title: '概览',
                                    fatherTitle: '管理项目'
                                },
                                component: resolve => require(['@/views/task/Overview.vue'], resolve),
                            },
                            {
                                path: '/',
                                name: 'task',
                                meta: {
                                    title: '任务',
                                    fatherTitle: '管理项目'
                                },
                                component: resolve => require(['@/views/task/Task.vue'], resolve),
                            },
                            {
                                path: '/project/manageProject/cartDetail/milepost',
                                name: 'milepost',
                                meta: {
                                    title: '里程碑',
                                    fatherTitle: '管理项目'
                                },
                                component: resolve => require(['@/views/task/Milepost.vue'], resolve),
                            },
                            {
                                path: '/project/manageProject/cartDetail/file',
                                name: 'file',
                                meta: {
                                    title: '文件',
                                    fatherTitle: '管理项目'
                                },
                                component: resolve => require(['@/views/task/File.vue'], resolve),
                            },
                            {
                                path: '/project/manageProject/cartDetail/projectMembers',
                                name: 'projectMembers',
                                meta: {
                                    title: '项目成员',
                                    fatherTitle: '管理项目'
                                },
                                component: resolve => require(['@/views/task/ProjectMembers.vue'], resolve),
                            },
                            {
                                path: '/project/manageProject/cartDetail/actionLog',
                                name: 'actionLog',
                                meta: {
                                    title: '操作日志',
                                    fatherTitle: '管理项目'
                                },
                                component: resolve => require(['@/views/task/ActionLog.vue'], resolve),
                            }

                        ]
                    },
                ]
            },
            {
                path: '/project/fileProject',
                name: 'FileProject',
                meta: {
                    title: '归档项目',
                    fatherTitle: '归档项目'
                },
                component: resolve => require(['@/views/project/FileProject.vue'], resolve),
            },
            {
                path: '/project/recycleProject',
                name: 'RecycleProject',
                meta: {
                    title: '回收站',
                    fatherTitle: '回收站'
                },
                component: resolve => require(['@/views/project/RecycleProject.vue'], resolve),
            }
        ]
    },
    {
        path: '/knowledagebase',
        name: 'knowledageBase',
        component: resolve => require(['@/views/KnowledageBase.vue'], resolve)
    },
    {
        path: '/schedule',
        name: 'schedule',
        component: resolve => require(['@/views/Schedule.vue'], resolve)
    },
    {
        path: '/team',
        name: 'team',
        redirect: '/team/member',
        component: resolve => require(['@/views/Team.vue'], resolve),
        children: [{
                path: '/team/teamorganization',
                name: 'organization',
                component: resolve => require(['@/views/teams/organization.vue'], resolve),
            },
            {
                path: '/team/member',
                name: 'members',
                component: resolve => require(['@/views/teams/Members.vue'], resolve),
            },
            {
                path: '/team/role',
                name: 'role',
                component: resolve => require(['@/views/teams/Role.vue'], resolve),
            },
            {
                path: '/team/systemNoti',
                name: 'systemNoti',
                component: resolve => require(['@/views/teams/SystemNoti.vue'], resolve),
            },
            {
                path: '/team/operationLogs',
                name: 'operationLogs',
                component: resolve => require(['@/views/teams/OperationLogs.vue'], resolve),
            }
        ]
    },
    {
        path: '/404',
        name: 'nofind',
        component: resolve => require(['@/views/common/404.vue'], resolve),
        meta: {
            title: '找不到页面'
        }
    }
]
const router = new VueRouter({
    //mode: 'history',
    routes
})
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.replace(targetPath);
    }
});
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (router.app.$cookies.get("status") !== "logined") {
            next({
                path: '/login',
                query: { redirect: to.fullPath } // 把要跳转的地址作为参数传到下一步
            })
        } else {
            next()
        }
    } else {
        if (to.query && to.query.redirect) {
            if (router.app.$cookies.get("status") === "logined") {
                next({ path: to.query.redirect })
            } else {
                next()
            }
        } else {
            next() // 确保一定要调用 next()
        }
    }
})
export default router;