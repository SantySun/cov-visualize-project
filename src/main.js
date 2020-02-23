import Vue from 'vue'
import App from './App.vue'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Vuex from 'vuex'
Vue.use(Vuex)


import VueAxios from 'vue-axios';
import axios from 'axios';

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

import chinaTotal from "./components/chinatotal.component.vue";
import chinaDayList from "./components/chinadaylist.component.vue";
import chinaDayAddList from "./components/chinaadd.component.vue";
import provinceMap from "./components/chinamap.component.vue";
import dailyNewAdd from "./components/dailynewadd.component.vue";
import dailydeadrate from "./components/dailydeadrate.component.vue";
import dailyhealrate from "./components/dailyhealrate.component.vue";

const routes = [
  {
    name: 'home',
    path: '/',
    component: chinaTotal
  },
  {
    name: 'day-list',
    path: '/day-list/',
    component: chinaDayList
  },
  {
    name: 'add-list',
    path: '/add-list/',
    component: chinaDayAddList
  },
  {
    name: 'province-map',
    path: '/province-map/',
    component: provinceMap
  },
  {
    name: 'daily-new-add',
    path: '/daily-new-add/',
    component: dailyNewAdd
  },
  {
    name: 'daily-dead-rate',
    path: '/daily-dead-rate/',
    component: dailydeadrate
  },
  {
    name: 'daily-heal-rate',
    path: '/daily-heal-rate/',
    component: dailyhealrate
  },

];


const router = new VueRouter({ mode: 'hash', routes: routes });

new Vue(Vue.util.extend({ router }, App)).$mount('#app');