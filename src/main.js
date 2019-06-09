import Vue from 'vue'
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/es';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import lodash from 'lodash'

Vue.use(ElementUI, {locale});
Vue.use(lodash);

Vue.config.productionTip = false;

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
