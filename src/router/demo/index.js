    export default [{
        path: '',
        name: 'demohome',
        component: () =>
            import ('@/views/login/login.vue'),
        meta: {
            title: '登录页'
        }
    }]