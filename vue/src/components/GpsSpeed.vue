<template>
  <div>
    <h1>GPS Information</h1>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <p>Speed: {{ speed }} m/s</p>
  </div>
</template>

<script>
export default {
  name: 'GPSApp',
  data() {
    return {
      latitude: null,
      longitude: null,
      speed: null
    }
  },
  created() {
    if ("geolocation" in navigator) {
      navigator.permissions.query({name:'geolocation'}).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          this.watchId = navigator.geolocation.watchPosition(this.updatePosition, this.handleLocationError, {
            enableHighAccuracy: true
          });
        } else if (result.state === 'denied') {
          alert('Location permission was denied. Some features may not work.');
        }
        result.onchange = () => {
          if(result.state === 'granted') {
            this.watchId = navigator.geolocation.watchPosition(this.updatePosition, null, {
              enableHighAccuracy: true
            });
          }
        };
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  },
  beforeUnmount() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  },
  methods: {
    updatePosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.speed = position.coords.speed;
    },
    handleLocationError(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
  }
}
</script>
