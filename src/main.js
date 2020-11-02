import Vue from "vue";
import VueTouch from "vue-touch";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";
import store from "./store";
import VueGtag from 'vue-gtag';
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.prototype.$http = axios;
Vue.use(VueTouch);
Vue.use(VueGtag, {config: {id: 'UA-177240655-1'}});

new Vue({
  store: store,
  render: (h) => h(App),
}).$mount("#app");
