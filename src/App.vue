<template>
  <div class="container text-center">
    <nav
      class="navbar navbar-expand-sm bg-dark navbar-dark navbar-expand-md bg-success fixed-top shadow p-3 navbar-collapse navbar-center"
    >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse navbar-center" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link">最新数据</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/day-list" class="nav-link">历史数据</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/add-list" class="nav-link">每日新增</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/province-map" class="nav-link">疫情地图</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/daily-new-add" class="nav-link">新增对比</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/daily-dead-rate" class="nav-link">死亡对比</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/daily-heal-rate" class="nav-link">治愈对比</router-link>
          </li>
        </ul>
      </div>
    </nav>
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