// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import lodash from 'lodash'
Vue.config.productionTip = false
Vue.prototype._ = lodash // 在原型上绑定lodash
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
