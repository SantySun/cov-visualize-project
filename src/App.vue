<template>
  <div id="app">
    <chinaTotal msg="Welcome to Your Vue.js App" />
    <chinaDayList msg="Welcome to Your Vue.js App" />
    <chinaDayAddList msg="Welcome to Your Vue.js App" />

    <provinceMap msg="Welcome to Your Vue.js App" />
    <div>数据来源：腾讯</div>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import chinaTotal from "./components/chinatotal.component.vue";
import chinaDayList from "./components/chinadaylist.component.vue";
import chinaDayAddList from "./components/chinaadd.component.vue";
import provinceMap from "./components/chinamap.component.vue";
export default {
  name: "App",
  components: {
    chinaTotal,
    chinaDayList,
    chinaDayAddList,
    provinceMap
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
