<template>
    <el-container class="content">
        <el-aside class="left-content">
            <el-menu :default-active="activeIndex" class="el-menu-vertical" router background-color="#fbfaf8">
                <el-menu-item index="/category/male">
                    <i class="el-icon-location"></i>
                    <span slot="title">男生</span>
                </el-menu-item>
                <el-menu-item index="/category/female">
                    <i class="el-icon-menu"></i>
                    <span slot="title">女生</span>
                </el-menu-item>
                <el-menu-item index="/category/press">
                    <i class="el-icon-document"></i>
                    <span slot="title">出版物</span>
                </el-menu-item>
                <el-menu-item index="/category/picture">
                    <i class="el-icon-setting"></i>
                    <span slot="title">图片漫画</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="right-content">
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: "/category/male"
            }
        },
        watch: {
            '$route': function () {
                this.activeIndex = this.$route.path;
            }
        },
        mounted() {
            this.activeIndex = this.$route.path;
        }
    }
</script>
