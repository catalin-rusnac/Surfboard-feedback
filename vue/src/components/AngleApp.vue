<template>
  <div id="app">
    <div>
      <h1>Device Orientation</h1>
      <p :style="{ color: toColor(alpha) }">Alpha: {{ formatNumber(alpha) }}</p>
      <p :style="{ color: toColor(beta) }">Beta: {{ formatNumber(beta) }}</p>
      <p :style="{ color: toColor(gamma) }">Gamma: {{ formatNumber(gamma) }}</p>
      <input type="number" v-model.number="thresholdBeta" min="0" max="50" step="1" />
      <button @click="toggleSound">{{ soundEnabled ? 'Disable Sound' : 'Enable Sound' }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AngleApp',
  data() {
    return {
      alpha: null,
      beta: null,
      gamma: null,
      audioContext: null,
      oscillator: null,
      soundEnabled: false,
      thresholdBeta: 20
    }
  },
  created() {
  this.getOrientationPermission();
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
              window.addEventListener('deviceorientation', this.updateOrientation);
            }
          })
          .catch(console.error);
      } else {
        // handle regular non iOS 13+ devices
      }
    },

    updateOrientation(event) {
      this.alpha = event.alpha;
      this.beta = event.beta;
      this.gamma = event.gamma;

      if(!this.oscillator) {
        return;
      }

      // Adjust frequency based on beta value.
      if (!this.soundEnabled) {
        this.oscillator.frequency.value = 0; // silence the sound
      } else if (this.beta < 0 || this.beta > this.thresholdBeta) {
        this.oscillator.frequency.value = 880;
      } else {
        let frequency = 300 + ((this.beta / this.thresholdBeta) * (660 - 300));
        this.oscillator.frequency.value = frequency;
      }
    },

    formatNumber(number) {
      return number !== null ? number.toFixed(1) : 'N/A';
    },

    toColor(number) {
      // Use number to create a color. This will create a color from black to green.
      // Replace this with your own logic if needed.
      const value = Math.abs(number % 360);
      return `hsl(${value}, 100%, 50%)`;
    },

    toggleSound() {
  this.soundEnabled = !this.soundEnabled;

  if (!this.soundEnabled && this.oscillator) {
    this.oscillator.stop();
    this.oscillator.disconnect();
    this.oscillator = null;
  }
  else if(this.soundEnabled && !this.oscillator) {
    this.startSound();
  }
},

startSound() {
  // Create a new AudioContext each time
  this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  this.oscillator = this.audioContext.createOscillator();
  this.oscillator.connect(this.audioContext.destination);
  this.oscillator.start();
}

}
}
</script>
