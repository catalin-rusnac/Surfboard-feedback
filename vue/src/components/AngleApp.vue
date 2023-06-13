<template>
  <div id="app">
    <div>
      <h1>Device Orientation</h1>
      <button v-if="!hasPermission" @click="getOrientationPermission">Enable Device Orientation</button>
      <div v-else>
        <p>Angle: {{ formatNumber(angle) }}</p>
        <label for="angleLimit">Angle limit:</label>
        <input id="angleLimit" type="number" v-model.number="thresholdAngle" min="0" max="50" step="1" />
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
      audioContext: null,
      oscillator: null,
      soundEnabled: false,
      thresholdAngle: 20,
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
        // handle regular non iOS 13+ devices
        this.hasPermission = true;
      }
    },

    updateOrientation(event) {
      this.angle = event.beta;
      document.body.style.backgroundColor = this.toColor(this.angle);

      if(!this.oscillator) {
        return;
      }

      if (!this.soundEnabled) {
        this.oscillator.frequency.value = 0; // silence the sound
      } else {
        this.oscillator.frequency.value = this.toFreq(this.angle);

        if (this.angle > this.thresholdAngle) {
          // Add a blink effect when angle is above threshold.
          document.body.classList.add('blink');
        } else {
          document.body.classList.remove('blink');
        }
      }
    },

    formatNumber(number) {
      return number !== null ? number.toFixed(1) : 'N/A';
    },

    toColor(angle) {
      // Define colors
      let maxAngle = this.thresholdAngle + 10
      let color = 'red';
      if (angle >= this.thresholdAngle - 5 && angle < this.thresholdAngle) {
        color = 'yellow';
      } else if (angle >= this.thresholdAngle && angle < maxAngle) {
        color = 'green';
      }
      return color;
    },

    toFreq(angle) {
      let frequency = 0;
      const maxAngle = this.thresholdAngle + 10
      if (angle > this.thresholdAngle && angle < maxAngle) {
        frequency = 440;
      } else {
        frequency = 200 + ((angle / this.thresholdAngle) * (380 - 200));
        if (angle>maxAngle || angle<0) {
          frequency = 0;
        }
      }

      return frequency;
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

<style scoped>
@keyframes blink {
  0% {opacity: 1;}
  50% {opacity: 0.5;}
  100% {opacity: 1;}
}

.blink {
  animation: blink 1s linear infinite;
}
</style>
