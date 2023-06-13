<template>
  <div>
    <div v-if="!hasPermission">
    <CButton
      class="btn"
      :class="{ 'btn-primary': !hasPermission, 'btn-success': hasPermission }"
      @click="getOrientationPermission"
    >
      {{ hasPermission ? 'Device Orientation Enabled' : 'Enable Device Orientation' }}
    </CButton>
      </div>
    <div v-if="hasPermission" style="display: flex; flex-direction: row; align-items: center;">
      <CButton
          style="width: 20%;"
        class="btn mt-3"
        :class="{ 'btn-success': soundEnabled, 'btn-danger': !soundEnabled }"
        @click="toggleSound"
      >
        {{ soundEnabled ? 'Sound ON' : 'Sound OFF' }}
      </CButton>
      <CFormFloating class="mt-3" style="width: 20%;">
      <CFormInput
        type="text"
        :style="{ backgroundColor: 'transparent', border: 'none' }"

        :value="formatNumber(angle)"
        disabled
        floatingLabel="Angle"
      />
      </CFormFloating>

      <CFormFloating class="mt-3" style="width: 30%;">
        <CFormInput
          :style="{ backgroundColor: 'transparent', border: 'none' }"
          :model-value="minAngle"
          @update:model-value="v => minAngle = v"
          id="angleLimit"
          type="number"
          floatingLabel="Red below"
        />
      </CFormFloating>
      <CFormFloating class="mt-3" style="width: 30%;">
        <CFormInput
          :style="{ backgroundColor: 'transparent', border: 'none' }"
          :model-value="minAngleAlertStart"
          @update:model-value="v => minAngleAlertStart = v"
          id="angleLimitAlertStart"
          type="number"
          floatingLabel="Yellow below"
        />
      </CFormFloating>
    </div>
  </div>
</template>


<script>
import {CButton, CFormFloating, CFormInput} from '@coreui/vue'

export default {
  components:{
    CFormInput,
    CFormFloating,
    CButton
  },

  name: 'AngleApp',
  data() {
    return {
      angle: null,
      minAngle: 20,
      minAngleAlertStart: 50,
      freq: null,
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
  watch: {
    freq(newValue) {
      if(this.oscillator && this.soundEnabled) {
        this.oscillator.frequency.value = newValue;
      }
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
  let maxFrequency = 600;

  let backgroundColor = 'red'; // default color

  if (this.angle <= this.minAngle) {
    this.freq = alertFrequency; // beep at 880Hz
    backgroundColor = 'red'; // angle less than or equal to minAngle
  } else if (this.angle <= this.minAngleAlertStart) {
    let totalYellowRange = this.minAngleAlertStart - this.minAngle;
    let percent = (this.minAngleAlertStart - this.angle) / totalYellowRange;
    this.freq = minFrequency + ((maxFrequency - minFrequency) * percent);

    if (percent >= 0.9) {
      let redPercent = (percent - 0.9) * 10;
      backgroundColor = `rgb(${255}, ${255 * (1 - redPercent)}, 0)`;
    } else {
      backgroundColor = 'yellow'; // angle between minAngle and this.minAngleAlertStart
    }
  } else if (this.angle > this.minAngleAlertStart) {
    this.freq = 0;
    backgroundColor = 'green'; // angle more than minAngleAlertStart
  }
  document.body.style.backgroundColor = backgroundColor;
},

    formatNumber(number) {
      return number !== null ? number.toFixed(1) : 'N/A';
    },

    toggleSound() {
      if (this.soundEnabled && this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
        this.soundEnabled = false;
      } else if(!this.soundEnabled && !this.oscillator && this.hasPermission) {
        this.startSound();
        this.soundEnabled = true;
      }
    },


    startSound() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.frequency.value = 0;
      this.oscillator.connect(this.audioContext.destination);
      this.oscillator.start();
    }
  }
}
</script>
