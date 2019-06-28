<template>
    <el-container class="content">
        <el-row>
            <p class="search-info">与 <span>{{query}}</span> 相关的搜索结果：</p>
            <el-col :span="8" v-for="item in searchData" class="booklist" :key="item.id">
                <div>
                    <img :src="'http://statics.zhuishushenqi.com' + item.cover" :alt="item.title" class="img cursor"
                         @click="getBookinfo(item)">
                    <div class="right">
                        <p class="name cursor" @click="getBookinfo(item)">{{item.title}}</p>
                        <p class="author">{{item.author + " | " + item.cat}}</p>
                        <p class="desc">{{item.shortIntro}}</p>
                        <p class="popularity">
                            <span style="color: #d82626">{{item.latelyFollower}}</span>人气 |
                            <span style="color: #d82626">{{item.retentionRatio}}</span>读者存留
                        </p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-container>
</template>
<script>
    import {Searchfuzzy} from "../../axios/api"

    export default {
        data() {
            return {
                query: "",
                searchData: [],
            }
        },
        methods: {
            // 获取搜索结果列表
            getSearchlist() {
                var parmas = {
                    query: this.query
                }
                Searchfuzzy(parmas).then(res => {
                    if (res.ok == true) {
                        this.searchData = res.books;
                    }
                })
            },
            // 查看书本详情
            getBookinfo(item) {
                this.$router.push("/bookinfo/" + item._id);
            }
        },
        watch: {
            '$route': function () {
                this.query = this.$route.query.val;
                this.getSearchlist();
            }
        },
        mounted() {
            this.query = this.$route.query.val;
            this.getSearchlist();
        }
    }
</script>
<style scoped>
    .search-info {
        width: 1060px;
        text-align: left;
        padding: 0px 10px 10px;
        border-bottom: 1px solid #2c3e50;
    }

    .search-info span {
        color: #d82626;
        font-weight: 700;
    }

    .booklist {
        padding: 10px;
        font-size: 14px;
    }

    .img {
        float: left;
        width: 90px;
        height: 120px;
        border: 1px solid #ebebeb;
        box-shadow: 2px 4px 6px #bbb;
    }

    .right {
        height: 120px;
        margin-left: 105px;
    }

    .right p {
        margin: 0px;
        text-align: left;
    }

    .name {
        height: 22px;
        line-height: 22px;
        font-weight: 700;
    }

    .author {
        height: 28px;
        line-height: 28px;
    }

    .desc {
        height: 40px;
        text-overflow: ellipsis;
        overflow: hidden
    }

    .popularity {
        height: 28px;
        line-height: 28px;
        margin-top: 10px !important
    }
</style>
