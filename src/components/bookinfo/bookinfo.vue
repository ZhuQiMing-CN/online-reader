<template>
    <div class="content">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumbs">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/category/male' }">{{bookLink.cat}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{bookLink.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="infoCon">
            <img :src="staticsLink" :alt="bookLink.title" class="img">
            <div class="right">
                <div class="float-left">
                    <p class="name">{{bookLink.title}}</p>
                    <p class="info">作者：{{bookLink.author}}</p>
                    <p class="info">类型：{{bookLink.majorCate}} | 字数：{{(bookLink.wordCount /
                        10000).toFixed(0)}}万字</p>
                    <p class="info">最后更新：{{bookLink.updated}}</p>
                    <p class="info">最新章节：{{lastChapter}}</p>
                    <p class="info">当前小说源：{{sourceName}}</p>
                </div>
                <div class="float-right mt20">
                    <el-button type="primary" size="medium" @click="addBooks()">加入书架</el-button>
                    <el-button type="primary" size="medium" @click="readBooks()">开始阅读</el-button>
                    <el-button type="primary" size="medium" @click="dialogSources = true">更换小说源</el-button>
                </div>
                <p class="intro clear-both">{{bookLink.longIntro}}</p>
            </div>
            <div style="clear: both"></div>
        </div>
        <div class="infoCon mt10">
            <el-row>
                <el-col :span="8">
                    <p>追书人数</p>
                    <p class="popularity-p">{{bookLink.latelyFollower}}</p>
                </el-col>
                <el-col :span="8">
                    <p>读者存留率</p>
                    <p class="popularity-p">{{bookLink.retentionRatio}}%</p>
                </el-col>
                <el-col :span="8">
                    <p>日更新字数</p>
                    <p class="popularity-p">{{bookLink.serializeWordCount}}字</p>
                </el-col>
            </el-row>
        </div>
        <div class="infoCon mt10">
            <p class="catalog-p">目录<span class="text-danger">（红色字体的为VIP章节）</span></p>
            <div class="p10">
                <li class="chapter-li" v-for="item in catalogList" @click="chapterMatter(item)">
                    <span :class="{'text-danger':item.isVip}">{{item.title}}</span>
                    <!--<el-badge value="vip" class="item" :hidden="item.isVip == false">
                        {{item.title}}
                    </el-badge>-->
                </li>
            </div>
            <div style="clear: both"></div>
        </div>
        <!--更换小说源-->
        <el-dialog title="更换小说源" :visible.sync="dialogSources" width="480px" class="dialogForm"
                   @close="dialogSources = false">
            <el-form ref="formSources" :model="formSources" label-width="80px" size="small">
                <el-form-item label="小说源" prop="sources">
                    <el-radio-group v-model="formSources.sources" v-for="item in sourcesData"
                                    @change="changeSources(item)" :key="item.id">
                        <el-radio :label="item.name"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="最新章节">
                    <el-input v-model="formSources.lastChapter" disabled></el-input>
                </el-form-item>
                <el-form-item label="注意事项">
                    <span>不同的小说源的章节可能会不一样，选择其他的小说源后需要重新选择章节阅读！</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogSources = false">取 消</el-button>
                <el-button size="small" type="primary" @click="dialogSources = false;affirmSources('formSources')">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {Bookinfo, Bookcatalog, Booksources} from "../../axios/api"
    import {mapMutations} from "vuex"

    export default {
        data() {
            return {
                bookLink: [],
                catalogList: [],
                sourceId: "",
                sourceName: "",
                lastChapter: "",
                staticsLink: "",
                dialogSources: false,
                formSources: {
                    sources: "",
                    lastChapter: ""
                },
                sourcesData: [],
                formSourcesData: []
            }
        },
        methods: {
            ...mapMutations([
                "setBookShelf"
            ]),
            // 获取小说信息
            getBookinfo() {
                var parmas = this.bookId;
                Bookinfo(parmas).then(res => {
                    this.bookLink = res;
                    this.staticsLink = "http://statics.zhuishushenqi.com" + res.cover;
                })
            },
            // 获取小说正版源于盗版源(混合)
            getBookSources() {
                let bookShelfs = this.$store.state.bookShelf;
                this.mybookData = bookShelfs.filter(item => item.id === this.$route.params.bookId);
                var parmas = {
                    view: "summary",
                    book: this.bookId
                };
                Booksources(parmas).then(res => {
                    if (bookShelfs.findIndex(item => item.id === this.$route.params.bookId) == "-1") {
                        this.sourceId = res[0]._id;
                        this.sourceName = res[0].name;
                        this.formSources.sources = res[0].name;
                        this.lastChapter = res[0].lastChapter;
                        this.formSources.lastChapter = res[0].lastChapter;
                    } else {
                        this.sourceId = this.mybookData[0].sourceId;
                        this.sourceName = this.mybookData[0].readsource;
                        this.formSources.sources = this.mybookData[0].readsource;
                        this.lastChapter = this.mybookData[0].lastChapter;
                        this.formSources.lastChapter = this.mybookData[0].lastChapter;

                    }
                    this.sourcesData = res;
                    this.getCatalog();
                })
            },
            // 获取小说章节(根据小说源id)
            getCatalog() {
                var parmas = this.sourceId;
                Bookcatalog(parmas).then(res => {
                    this.catalogList = res.chapters;
                })
            },
            // 点击小说章节阅读
            chapterMatter(item) {
                let bookShelfs = this.$store.state.bookShelf;
                if (bookShelfs.findIndex(item => item.id === this.$route.params.bookId) == "-1") {
                    let readRecord = {
                        id: this.bookLink._id,
                        title: this.bookLink.title,
                        cover: this.bookLink.cover,
                        author: this.bookLink.author,
                        readlink: item.link,
                        readtitle: item.title,
                        sourceId: this.sourceId,
                        readsource: this.sourceName,
                        lastChapter: this.lastChapter
                    }
                    bookShelfs.push(readRecord);
                    this.setBookShelf(bookShelfs);
                } else {
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].sourceId = this.sourceId;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].readlink = item.link;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].readtitle = item.title;
                    this.setBookShelf(bookShelfs);
                }
                this.$router.push("/bookchapter/" + this.bookId);
            },
            // 加入书架
            addBooks() {
                let bookShelfs = this.$store.state.bookShelf;
                if (bookShelfs.findIndex(item => item.id === this.$route.params.bookId) == "-1") {
                    let readRecord = {
                        id: this.bookLink._id,
                        title: this.bookLink.title,
                        cover: this.bookLink.cover,
                        author: this.bookLink.author,
                        readlink: this.catalogList[0].link,
                        readtitle: this.catalogList[0].title,
                        sourceId: this.sourceId,
                        readsource: this.sourceName,
                        lastChapter: this.lastChapter
                    }
                    bookShelfs.push(readRecord);
                    this.setBookShelf(bookShelfs);
                } else {
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].sourceId = this.sourceId;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].readsource = this.sourceName;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].lastChapter = this.lastChapter;
                    this.setBookShelf(bookShelfs);
                    this.$message({
                        message: "此本书已经加入书架咯~",
                        type: "warning",
                        duration: 1000
                    });
                }
            },
            // 开始阅读
            readBooks() {
                let bookShelfs = this.$store.state.bookShelf;
                if (bookShelfs.findIndex(item => item.id === this.$route.params.bookId) == "-1") {
                    let readRecord = {
                        id: this.bookLink._id,
                        title: this.bookLink.title,
                        cover: this.bookLink.cover,
                        author: this.bookLink.author,
                        readlink: this.catalogList[0].link,
                        readtitle: this.catalogList[0].title,
                        sourceId: this.sourceId,
                        readsource: this.sourceName,
                        lastChapter: this.lastChapter
                    }
                    bookShelfs.push(readRecord)
                    this.setBookShelf(bookShelfs)
                }
                this.$router.push("/bookchapter/" + this.bookId);
            },
            // 选择其他的小说源
            changeSources(item) {
                this.sourceId = item._id;
                this.sourceName = item.name;
                this.lastChapter = item.lastChapter;
                this.formSources.lastChapter = item.lastChapter;
            },
            // 确定选择小说源
            affirmSources() {
                this.getCatalog();
                // 书架状态管理
                let bookShelfs = this.$store.state.bookShelf;
                if (bookShelfs.findIndex(item => item.id === this.$route.params.bookId) == "-1") {
                    let readRecord = {
                        id: this.bookLink._id,
                        title: this.bookLink.title,
                        cover: this.bookLink.cover,
                        author: this.bookLink.author,
                        readlink: this.catalogList[0].link,
                        readtitle: this.catalogList[0].title,
                        sourceId: this.sourceId,
                        readsource: this.sourceName,
                        lastChapter: this.lastChapter
                    }
                    bookShelfs.push(readRecord);
                    this.setBookShelf(bookShelfs);
                } else {
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].sourceId = this.sourceId;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].readsource = this.sourceName;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].lastChapter = this.lastChapter;
                    bookShelfs[bookShelfs.findIndex(item => item.id === this.$route.params.bookId)].readlink = "";
                    this.setBookShelf(bookShelfs);
                }
            }
        },
        mounted() {
            this.bookId = this.$route.params.bookId;
            this.getBookinfo();
            this.getBookSources();
        }
    }
</script>

<style scoped>
    .infoCon {
        border: 1px solid rgb(204, 204, 204);
    }

    .breadcrumbs {
        padding: 10px;
    }

    .img {
        float: left;
        width: 155px;
        margin: 10px;
        border: 1px solid #ebebeb;
        box-shadow: 2px 4px 6px #bbb;
    }

    .right {
        width: 880px;
        float: left;
        margin: 10px;
        text-align: left;
    }

    .right p {
        margin: 0px;
    }

    .name {
        height: 28px;
        line-height: 22px;
        font-size: 20px;
        font-weight: 700;
    }

    .info {
        height: 28px;
        line-height: 28px;
    }

    .intro {
        font-size: 14px;
        height: 48px;
        line-height: 24px;
        overflow: hidden;
        padding-top: 10px;
        border-top: 1px dashed rgb(204, 204, 204);
    }

    .popularity-p {
        font-size: 18px;
        font-weight: 700;
        font-style: normal;
        color: #d82626;
    }

    .chapter-li {
        width: 25%;
        float: left;
        height: 35px;
        line-height: 35px;
        list-style: none;
        text-align: left;
        overflow: hidden;
        cursor: pointer;
        border-bottom: 1px dotted rgb(204, 204, 204);
    }

    .catalog-p {
        padding: 8px;
        font-weight: 700;
        margin: 0px 0px 1em;
        background-color: #ccc;
    }

    .item {
        margin-top: 10px;
    }

    .text-danger {
        color: red;
    }
</style>
