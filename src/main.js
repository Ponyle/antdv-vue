import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './route/index'
import legePlug from './plugin/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(Antd);
Vue.use(VueRouter)
Vue.use(legePlug)
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
