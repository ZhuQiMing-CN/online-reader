<template>
    <el-container class="content">
        <el-row style="width: 100%">
            <p class="shelf-info">我的书架共有 <span>{{bookShelfs.length}}</span> 本在看的书籍：</p>
            <el-col :span="12" v-for="item in bookShelfs" class="booklist" :key="item.id">
                <div class="book-left">
                    <img :src="'http://statics.zhuishushenqi.com' + item.cover" :alt="item.title" class="img cursor" @click="getBookinfo(item)">
                    <div class="right">
                        <p class="name cursor" @click="getBookinfo(item)">{{item.title}}</p>
                        <p class="info">作者：{{item.author}}</p>
                        <p class="info">小说来源：{{item.readsource}}</p>
                        <p class="info">上次阅读：{{item.readtitle}}</p>
                        <p class="info">最新章节：{{item.lastChapter}}</p>
                    </div>
                </div>
                <div class="book-right mt30">
                    <el-button type="danger" size="mini" @click="delBooks(item)">移出书架</el-button>
                </div>
            </el-col>
            <div v-if="bookShelfs.length == 0">
                <img src="../../assets/img/null.jpg" width="60%">
            </div>
        </el-row>
    </el-container>
</template>

<script>
    import {mapMutations} from "vuex"

    export default {
        data() {
            return {
                bookShelfs: []
            }
        },
        methods: {
            ...mapMutations([
                "setBookShelf"
            ]),
            // 查看书本详情
            getBookinfo(item){
                this.$router.push("/bookinfo/" + item.id);
            },
            // 移除书架
            delBooks(val){
                let delbook = this.bookShelfs.findIndex(item => item.id === val.id)
                this.bookShelfs.splice(delbook,1)
                this.setBookShelf(this.bookShelfs);
            }
        },
        mounted() {
            this.bookShelfs = this.$store.state.bookShelf;
        }
    }
</script>

<style scoped>
    .shelf-info {
        width: 1060px;
        text-align: left;
        padding: 0px 10px 10px;
        border-bottom: 1px solid #2c3e50;
    }

    .shelf-info span {
        color: #d82626;
        font-weight: 700;
    }
    .booklist {
        padding: 10px;
        font-size: 14px;
        position: relative;
    }
    .book-right{
        position: absolute;
        right: 10px;
        top: 0px;
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

    .info {
        height: 26px;
        line-height: 26px;
        overflow: hidden;
    }
</style>
