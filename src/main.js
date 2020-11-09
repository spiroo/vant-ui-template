import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入全局样式
import '@/index.less';

// 全局引入按需引入UI库 vant
import '@/plugins/vant';

// 移动端适配
import 'lib-flexible/flexible.js';

// filters
import './filters';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
