<template>
  <AngleApp/>
  <GPSApp/>
</template>

<script>
import AngleApp from './components/AngleApp.vue'
import GPSApp from './components/GpsSpeed.vue'

export default {
  name: 'App',
  components: {
    AngleApp,
    GPSApp
  },
  mounted() {
  document.title = "SurfSiren";
},
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90vh;
}

</style>
