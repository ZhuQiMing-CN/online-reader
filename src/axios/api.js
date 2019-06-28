import axios from 'axios';

//axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 获取所有分类
export const Category = params => {
  return axios.get('/api/cats/lv2/statistics', {params: params}).then(res => res.data);
};
// 获取分类下小类别
export const Categorylist = params => {
  return axios.get('/api/cats/lv2', {params: params}).then(res => res.data);
};
// 根据分类获取小说列表
export const Categorylistbook = params => {
  return axios.get('/api/book/by-categories', {params: params}).then(res => res.data);
};
// 获取排行榜类型
export const Rankcategory = params => {
  return axios.get('/api/ranking/gender', {params: params}).then(res => res.data);
};
// 获取排行榜小说
export const Ranklistbook = params => {
  return axios.get('/api/ranking/' + params).then(res => res.data);
};
// 获取小说信息
export const Bookinfo = params => {
  return axios.get('/api/book/' + params,).then(res => res.data);
};
// 获取小说正版源于盗版源(混合)
export const Booksources = params => {
    return axios.get('/api/atoc', {params: params}).then(res => res.data);
};
// 获取小说章节(根据小说源id)
export const Bookcatalog = params => {
  return axios.get('/api/atoc/' + params + '?view=chapters').then(res => res.data);
};
// 获取小说章节内容
export const Bookchapter = params => {
  return axios.get('/chapter/' + encodeURIComponent(params)).then(res => res.data);
};
// 获取小说最新章节
export const Bookupdated = params => {
    return axios.get('/book', {params: params}).then(res => res.data);
};
// 搜索自动补充
export const Searchauto = params => {
    return axios.get('/api/book/auto-complete', {params: params}).then(res => res.data);
};
// 模糊搜索
export const Searchfuzzy = params => {
    return axios.get('/api/book/fuzzy-search', {params: params}).then(res => res.data);
};
// 获取搜索热词
export const Searchhotwords = params => {
    return axios.get('/api/book/search-hotwords', {params: params}).then(res => res.data);
};
