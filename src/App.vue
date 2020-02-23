// App.vue

<template>
  <div class="w3-top">
    <div
      class="navbar justify-content-center w3-row w3-padding w3-black"
      style="list-style-type:none;"
    >
      <li class="w3-col s1">
        <router-link to="/" class="w3-button w3-block w3-black">最新数据</router-link>
      </li>

      <li class="w3-col s1">
        <router-link to="/day-list" class="w3-button w3-block w3-black">历史数据</router-link>
      </li>

      <li class="w3-col s1">
        <router-link to="/add-list" class="w3-button w3-block w3-black">每日新增</router-link>
      </li>

      <li class="w3-col s1">
        <router-link to="/province-map" class="w3-button w3-block w3-black">疫情地图</router-link>
      </li>

      <li class="w3-col s1">
        <router-link to="/daily-new-add" class="w3-button w3-block w3-black">新增对比</router-link>
      </li>

      <li class="w3-col s1">
        <router-link to="/daily-dead-rate" class="w3-button w3-block w3-black">死亡对比</router-link>
      </li>

      <li class="w3-col s1">
        <router-link to="/daily-heal-rate" class="w3-button w3-block w3-black">治愈对比</router-link>
      </li>
    </div>

    <br />

    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

<script>
export default {};
</script>
