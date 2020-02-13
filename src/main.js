// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';
import ElementUI from 'element-ui';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/app.css';
import axios from "axios";

Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.config.productionTip = false

var loading
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 显示loading
    loading = Vue.prototype.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
    });
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    loading && loading.close();
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
    created: function () {
        // 在页面加载时读取localStorage里的状态信息
        localStorage.getItem("bookMsg") && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem("bookMsg"))));

        // 在页面刷新时将vuex里的信息保存到localStorage里
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("bookMsg", JSON.stringify(this.$store.state))
        })
    }
})
