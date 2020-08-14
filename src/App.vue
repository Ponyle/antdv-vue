<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style: none;
    outline: none;
  }
  .flex{
    display: flex;
  }
  .a-c{
    align-items: center;
  }
  .j-s{
    justify-content: space-between;
  }
  .j-c{
    justify-content: center;
  }
</style>
