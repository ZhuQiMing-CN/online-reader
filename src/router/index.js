import Vue from "vue"
import Router from "vue-router"

import index from "../components/index.vue"
import header from "../components/header.vue"

import category from "../components/category/category.vue"
import male from "../components/category/male/male.vue"
import female from "../components/category/female/female.vue"
import press from "../components/category/press/press.vue"
import picture from "../components/category/picture/picture.vue"

import ranking from "../components/ranking/ranking.vue"
import rmale from "../components/ranking/male/RankingMale.vue"
import rfemale from "../components/ranking/female/RankingFemale.vue"
import rpress from "../components/ranking/press/RankingPress.vue"
import rpicture from "../components/ranking/picture/RankingPicture.vue"

import bookinfo from "../components/bookinfo/bookinfo.vue"
import bookchapter from "../components/bookchapter/bookchapter.vue"
import bookshelf from "../components/bookshelf/bookshelf.vue"

import search from "../components/search/search.vue"

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "",
            redirect: "/index"
        },
        {
            path: "/",
            component: header,
            children: [
                {
                    path: "index",
                    component: index
                },
                {
                    path: "category",
                    component: category,
                    children: [
                        {
                            path: "male",
                            component: male
                        },
                        {
                            path: "female",
                            component: female
                        },
                        {
                            path: "press",
                            component: press
                        },
                        {
                            path: "picture",
                            component: picture
                        }
                    ]
                },
                {
                    path: "ranking",
                    component: ranking,
                    children: [
                        {
                            path: "rmale",
                            component: rmale
                        },
                        {
                            path: "rfemale",
                            component: rfemale
                        },
                        {
                            path: "rpress",
                            component: rpress
                        },
                        {
                            path: "rpicture",
                            component: rpicture
                        }
                    ]
                },
                {
                    path: "bookinfo/:bookId",
                    component: bookinfo
                },
                {
                    path: "bookchapter/:bookId",
                    component: bookchapter
                },
                {
                    path: "bookshelf",
                    component: bookshelf
                },
                {
                    path: "search",
                    component: search
                },
            ]
        },
        {
            path: "*",
            redirect: "/index"
        },
    ],
    mode: "history"
})
