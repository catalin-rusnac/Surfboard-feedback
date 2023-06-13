<template>
  <div id="app">
    <div>
      <h1>Device Orientation</h1>
      <button v-if="!hasPermission" @click="getOrientationPermission">Enable Device Orientation</button>
      <div v-else>
        <p>Angle: {{ formatNumber(angle) }}</p>
        <label for="angleLimit">Angle limit:</label>
        <input id="angleLimit" type="number" v-model.number="minAngle"/>
        <button @click="toggleSound">{{ soundEnabled ? 'Disable Sound' : 'Enable Sound' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AngleApp',
  data() {
    return {
      angle: null,
      minAngle: 20,
      audioContext: null,
      oscillator: null,
      soundEnabled: false,
      hasPermission: false
    }
  },
  created() {
    window.addEventListener('deviceorientation', this.updateOrientation);
    if(this.soundEnabled) {
      this.startSound();
    }
  },
  beforeUnmount() {
    window.removeEventListener('deviceorientation', this.updateOrientation);
    if(this.oscillator) {
      this.oscillator.stop();
    }
    if(this.audioContext) {
      this.audioContext.close();
    }
  },
  methods: {
    getOrientationPermission() {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              this.hasPermission = true;
            }
          })
          .catch(console.error);
      } else {
        this.hasPermission = true;
      }
    },

    updateOrientation(event) {
  this.angle = event.beta;

  let alertFrequency = 880;
  let minFrequency = 200;
  let maxFrequency = 400;
  let minAngleAlertStart = 30;

  let backgroundColor = 'red'; // default color

  if(!this.oscillator || !this.soundEnabled) {
    return;
  }

  if (this.angle <= this.minAngle) {
    this.oscillator.frequency.value = alertFrequency; // beep at 880Hz
    backgroundColor = 'red'; // angle less than or equal to minAngle
  } else if (this.angle <= minAngleAlertStart) {
    let percent = (minAngleAlertStart - this.angle) / (minAngleAlertStart - this.minAngle); // calculate how much percent angle is closer to 20
    this.oscillator.frequency.value = minFrequency + ((maxFrequency - minFrequency) * percent); // scale frequency from 200Hz to 400Hz
    backgroundColor = 'yellow'; // angle between minAngle and minAngleAlertStart
  } else if (this.angle > minAngleAlertStart) {
    this.oscillator.frequency.value = 0;
    backgroundColor = 'green'; // angle more than minAngleAlertStart
  }

  document.body.style.backgroundColor = backgroundColor;
},


    formatNumber(number) {
      return number !== null ? number.toFixed(1) : 'N/A';
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled;

      if (!this.soundEnabled && this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      } else if(this.soundEnabled && !this.oscillator) {
        this.startSound();
      }
    },

    startSound() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.connect(this.audioContext.destination);
      this.oscillator.start();
    }
  }
}
</script>
