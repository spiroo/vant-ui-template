import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
  path: '/',
  name: 'index',
  component: () => import('@/views/home/index'),
  meta: {
    keepAlive: false
  }
}];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes
});

export default router;