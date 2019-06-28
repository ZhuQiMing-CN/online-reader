import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    bookShelf: [],    // 书架信息
};

const mutations = {
    setBookShelf(state, val) {
        state.bookShelf = val;
    },
};

export default new Vuex.Store({
    state,
    mutations
})
