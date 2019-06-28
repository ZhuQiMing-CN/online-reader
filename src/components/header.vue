<template>
    <el-container>
        <el-header>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router
                     background-color="#545c64"
                     text-color="#fff" active-text-color="#ffd04b">
                <div class="logo">This is a Logo</div>
                <el-menu-item index="/index">首页</el-menu-item>
                <el-menu-item index="/category/male">热门分类</el-menu-item>
                <el-menu-item index="/ranking/rmale">排行榜</el-menu-item>
                <el-menu-item index="/bookshelf">我的书架</el-menu-item>
                <el-autocomplete v-model="query" :fetch-suggestions="querySearch" placeholder="请输入书本名或者作者名"
                                 @select="querySelect" @keyup.enter.native="querySelect({value:query})" size="small"
                                 clearable class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="querySelect({value:query})"></el-button>
                </el-autocomplete>
            </el-menu>
        </el-header>
        <router-view></router-view>
        <el-footer>
            <p>本站提供的内容均来源于网络,纯属共享学习之用,若有侵权,请与管理员邮箱联系！</p>
        </el-footer>
        <BackTop :defaultProps="60" :date="1000" color="#000"></BackTop>
    </el-container>
</template>
<script>
    import {Searchauto, Searchhotwords} from "../axios/api"
    import BackTop from "vue-backtop"

    export default {
        components: {
            BackTop
        },
        data() {
            return {
                activeIndex: "/category/male",
                query: "",
                hotwords: [],
                restaurants: [],
                timeout: null
            }
        },
        methods: {
            // 获取搜索热词
            getHotwords() {
                var parmas = {};
                Searchhotwords(parmas).then(res => {
                    if (res.ok == true) {
                        this.hotwords = res.searchHotWords;
                    }
                })
            },
            querySearch(queryString, cb) {
                var results = [];
                if (this.query == "") {
                    this.restaurants = this.hotwords;
                    for (let i of  this.restaurants) {
                        i.value = i.word;
                    }
                    results = this.restaurants;
                } else {
                    // 搜索自动补充
                    var parmas = {
                        query: this.query
                    }
                    Searchauto(parmas).then(res => {
                        if (res.ok == true) {
                            this.restaurants = res.keywords;
                            for (let i of  this.restaurants) {
                                results.push({
                                    value: i
                                })
                            }
                            if (results.length === 0) {
                                results = [{value: '暂无数据'}]
                            }
                        }
                    })
                }
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            // 模糊搜索
            querySelect(item) {
                if (item.value == "暂无数据" || item.value == "") {
                    this.query = "";
                    return
                }
                this.$router.push({path: '/search', query: {val: item.value}});
            }
        },
        mounted() {
            this.activeIndex = this.$route.path;
            this.getHotwords();
        }
    }
</script>

<style scoped>
    .logo {
        width: 120px;
        height: 60px;
        line-height: 60px;
        float: left;
        margin: 0px 60px;
    }

    .input-with-select {
        width: 280px;
        padding: 14px 0px;
        position: absolute;
    }
</style>
