import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';
import '../node_modules/nprogress/nprogress.css';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';

import axios from 'axios';
import NProgress from 'nprogress';
import persistentState from 'vue-persistent-state';

import App from './App.vue';
import Top from './components/Top.vue';
import New from './components/New.vue';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

// Initialize routes
const routes = [
  {
    path: '/',
    redirect: {
      name: 'Top',
    },
  },
  {
    name: 'Top',
    path: '/top/:pageNum?',
    component: Top,
  },
  {
    name: 'New',
    path: '/new',
    component: New,
  },
];

// Initialize the router
const router = new VueRouter({ mode: 'history', routes });

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

// Initialize the local storage.
const initialState = {
  topPosts: [],
  topPostIds: [],
  newPosts: [],
  newPostIds: [],
};
Vue.use(persistentState, initialState);

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app');
