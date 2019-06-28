<template>
    <el-container class="content">
        <div class="index-search">
            <el-autocomplete v-model="query" :fetch-suggestions="querySearchAsync" placeholder="请输入书本名或者作者名"
                             @select="handleSelect" @keyup.enter.native="handleSelect({value:query})" size="medium"
                             clearable class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="handleSelect({value:query})"></el-button>
            </el-autocomplete>
            <div ref="Echart" style="width: 750px;height: 580px"></div>
        </div>
    </el-container>
</template>
<script>
    import {Searchauto, Searchhotwords} from "../axios/api"

    var echarts = require('echarts');
    require('echarts-wordcloud');

    export default {
        data() {
            return {
                query: "",
                hotwords: [],
                restaurants: [],
                timeout: null,
                echartData: [],
            }
        },
        methods: {
            // 获取搜索热词
            getHotwords() {
                var parmas = {};
                Searchhotwords(parmas).then(res => {
                    if (res.ok == true) {
                        this.hotwords = res.searchHotWords;
                        for (let i of  this.hotwords) {
                            this.echartData.push({
                                value: i.times,
                                name: i.word
                            })
                        }
                        this.drawLine();
                    }
                })
            },
            querySearchAsync(queryString, cb) {
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
            handleSelect(item) {
                console.log(item)
                if (item.value == "暂无数据" || item.value == "") {
                    this.query = "";
                    return
                }
                this.$router.push({path: '/search', query: {val: item.value}});
            },
            // 生成词云
            drawLine() {
                let myChart = echarts.init(this.$refs.Echart);
                myChart.setOption({
                    tooltip: {
                        show: false
                    },
                    series: [{
                        type: 'wordCloud',
                        gridSize: 8,
                        shape: "star",
                        sizeRange: [10, 80],
                        rotationRange: [0, 0],
                        textStyle: {
                            normal: {
                                color: function () {
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160)
                                    ].join(',') + ')';
                                }
                            },
                            emphasis: {
                                shadowBlur: 8,
                                shadowColor: '#555'
                            }
                        },
                        left: 'center',
                        top: 'center',
                        right: null,
                        bottom: null,
                        data: this.echartData
                    }]
                });
                myChart.on('click', function (params) {
                    window.location.href = "/search?val=" + params.name;
                });
            }
        },
        mounted() {
            this.getHotwords();
        }
    }
</script>

<style scoped>
    .index-search {
        margin: 40px auto 0px;
    }

    .input-with-select {
        width: 450px;
    }
</style>
