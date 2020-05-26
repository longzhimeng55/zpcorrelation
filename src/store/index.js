import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate"

import user from './module/user.js'
import app from './module/app.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        user,
        app
    },
    plugins: [createPersistedState()]
});
export default store;
// export default new Vuex.Store({
//     state: {

//     },
//     getters: {

//     },
//     mutations: {

//     },
//     actions: {

//     },
//     modules: {
//         user,
//         app
//     },
//     plugins: [createPersistedState()]
// })