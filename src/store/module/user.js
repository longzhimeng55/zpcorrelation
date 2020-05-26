export default {
    namespaced: true,
    // 存储数据的状态
    state: {
        userName: '',
        userImage: '',
        userCompanyId: '',
        //用户项目id
        projectId: '',
        //用户项目名称
        ProjectName: '',
        //用户项目所有者
        projectOwner: '',
        //是不是重新请求菜单数据
        isagain: '',
        //选中菜单中哪个菜单
        menucontent: '',
        // token: getToken(),
        // access: '',
    },
    // 获取vuex数据（state）的统一接口
    getters: {
        initInfo(state, getters) {
            return state.userName
        },
        getUserImage(state, getters) {
            return state.userImage
        },
        getUserCompanyId(state, getters) {
            return state.userCompanyId
        },
        //获取用户项目id
        getUserProjectId(state, getters) {
            return state.projectId
        },
        //用户项目名称
        getUserProjectName(state, getters) {
            return state.ProjectName
        },
        //用户项目所有者
        getUserProjectOwner(state, getters) {
            return state.ProjectOwner
        },
        //重新请求菜单
        getaginProjectMenu(state, getters) {
            return state.isagain
        },
        //选中菜单中哪个菜单
        getProjectMenuindex(state, getters) {
            return state.menucontent
        },
    },
    // 存vuex数据（state）的统一接口
    mutations: {
        // setUserId(state, id) {
        //     state.userId = id
        // },
        setUserName(state, name) {
            state.userName = name;
        },
        //设置用户头像
        setUserImage(state, image) {
            state.userImage = image;
        },
        setUserCompanyId(state, id) {
            state.userCompanyId = id;
        },
        //设置用户项目id
        setUserProjectId(state, id) {
            state.projectId = id;
        },
        //用户项目名称
        setUserProjectName(state, id) {
            state.projectName = id;
        },
        //用户项目所有者
        setUserProjectOwner(state, id) {
            state.projectOwner = id;
        },
        //重新请求菜单
        setaginProjectMenu(state, id) {
            state.isagain = id;
        },
        //选中菜单中哪个菜单
        setProjectMenuindex(state, id) {
            state.menucontent = id
        },
        // setAccess(state, access) {
        //     state.access = access
        // },
        // setToken(state, token) {
        //     state.token = token
        //     setToken(token)
        // },
    },
    // vuex内的异步操作接口
    actions: {
        //写入
        // getInfo({ commit, state }) {
        //     commit('updateInitInfo', 'getInfo')
        // }
        handleLogin({ commit, state }, loginmessage) {
            commit('setUserName', loginmessage.name)
        },
        //用户头像
        userImage({ commit, state }, selectmessage) {
            commit('setUserImage', selectmessage.img)
        },
        userCompanyId({ commit, state }, selectmessage) {
            commit('setUserCompanyId', selectmessage.id)
        },
        //用户项目id
        userProjectId({ commit, state }, selectmessage) {
            commit('setUserProjectId', selectmessage.id)
        },
        //用户项目名称
        userProjectName({ commit, state }, selectmessage) {
            commit('setUserProjectName', selectmessage.id)
        },
        //用户项目所有者
        userProjectOwner({ commit, state }, selectmessage) {
            commit('setUserProjectOwner', selectmessage.id)
        },
        //重新请求菜单
        aginProjectMenu({ commit, state }, selectmessage) {
            commit('setaginProjectMenu', selectmessage.id)
        },
        //选中菜单中的那个菜单
        checkProjectMenu({ commit, state }, selectmessage) {
            commit('setProjectMenuindex', selectmessage.id)
        },
    },
}