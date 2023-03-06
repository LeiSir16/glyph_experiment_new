import Vue from "vue";
import VueRouter from "vue-router";

// 路由懒加载
const userPage = () => import('@/pages/userPage.vue')
const mainPage = () => import('@/pages/mainPage.vue')
Vue.use(VueRouter)
export default new VueRouter({
    base: '/glyph_experiment_new/',
    routes: [
        // 当路径为/时重定向到用户信息界面
        {
            path: '/',
            redirect: '/user'
            // redirect: '/main-page'
        },
        {
            name: 'user',
            path: '/user',
            component: userPage
        },
        {
            name: 'mainPage',
            path: '/main-page',
            component: mainPage
        }
    ]
})