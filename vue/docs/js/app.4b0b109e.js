(function(){"use strict";var t={698:function(t,e,o){var n=o(963),i=o(252);function a(t,e,o,n,a,r){const s=(0,i.up)("AngleApp"),l=(0,i.up)("GPSApp");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.Wm)(s),(0,i.Wm)(l)],64)}var r=o(577);const s={id:"app"},l=(0,i._)("h1",null,"Device Orientation",-1);function u(t,e,o,a,u,d){return(0,i.wg)(),(0,i.iD)("div",s,[(0,i._)("div",null,[l,(0,i._)("p",{style:(0,r.j5)({color:d.toColor(u.alpha)})},"Alpha: "+(0,r.zw)(d.formatNumber(u.alpha)),5),(0,i._)("p",{style:(0,r.j5)({color:d.toColor(u.beta)})},"Beta: "+(0,r.zw)(d.formatNumber(u.beta)),5),(0,i._)("p",{style:(0,r.j5)({color:d.toColor(u.gamma)})},"Gamma: "+(0,r.zw)(d.formatNumber(u.gamma)),5),(0,i.wy)((0,i._)("input",{type:"number","onUpdate:modelValue":e[0]||(e[0]=t=>u.thresholdBeta=t),min:"0",max:"50",step:"1"},null,512),[[n.nr,u.thresholdBeta,void 0,{number:!0}]]),(0,i._)("button",{onClick:e[1]||(e[1]=(...t)=>d.toggleSound&&d.toggleSound(...t))},(0,r.zw)(u.soundEnabled?"Disable Sound":"Enable Sound"),1)])])}var d={name:"AngleApp",data(){return{alpha:null,beta:null,gamma:null,audioContext:null,oscillator:null,soundEnabled:!1,thresholdBeta:20}},created(){this.getOrientationPermission(),window.addEventListener("deviceorientation",this.updateOrientation),this.soundEnabled&&this.startSound()},beforeUnmount(){window.removeEventListener("deviceorientation",this.updateOrientation),this.oscillator&&this.oscillator.stop(),this.audioContext&&this.audioContext.close()},methods:{getOrientationPermission(){"function"===typeof DeviceOrientationEvent.requestPermission&&DeviceOrientationEvent.requestPermission().then((t=>{"granted"===t&&window.addEventListener("deviceorientation",this.updateOrientation)})).catch(console.error)},updateOrientation(t){if(this.alpha=t.alpha,this.beta=t.beta,this.gamma=t.gamma,this.oscillator)if(this.soundEnabled)if(this.beta<0||this.beta>this.thresholdBeta)this.oscillator.frequency.value=880;else{let t=300+this.beta/this.thresholdBeta*360;this.oscillator.frequency.value=t}else this.oscillator.frequency.value=0},formatNumber(t){return null!==t?t.toFixed(1):"N/A"},toColor(t){const e=Math.abs(t%360);return`hsl(${e}, 100%, 50%)`},toggleSound(){this.soundEnabled=!this.soundEnabled,!this.soundEnabled&&this.oscillator?(this.oscillator.stop(),this.oscillator.disconnect(),this.oscillator=null):this.soundEnabled&&!this.oscillator&&this.startSound()},startSound(){this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.oscillator=this.audioContext.createOscillator(),this.oscillator.connect(this.audioContext.destination),this.oscillator.start()}}},c=o(744);const h=(0,c.Z)(d,[["render",u]]);var p=h;const f=(0,i._)("h1",null,"GPS Information",-1);function m(t,e,o,n,a,s){return(0,i.wg)(),(0,i.iD)("div",null,[f,(0,i._)("p",null,"Latitude: "+(0,r.zw)(a.latitude),1),(0,i._)("p",null,"Longitude: "+(0,r.zw)(a.longitude),1),(0,i._)("p",null,"Speed: "+(0,r.zw)(a.speed)+" m/s",1)])}var v={name:"GPSApp",data(){return{latitude:null,longitude:null,speed:null}},created(){"geolocation"in navigator?navigator.permissions.query({name:"geolocation"}).then((t=>{"granted"===t.state||"prompt"===t.state?this.watchId=navigator.geolocation.watchPosition(this.updatePosition,this.handleLocationError,{enableHighAccuracy:!0}):"denied"===t.state&&alert("Location permission was denied. Some features may not work."),t.onchange=()=>{"granted"===t.state&&(this.watchId=navigator.geolocation.watchPosition(this.updatePosition,null,{enableHighAccuracy:!0}))}})):alert("Geolocation is not supported by this browser.")},beforeUnmount(){this.watchId&&navigator.geolocation.clearWatch(this.watchId)},methods:{updatePosition(t){this.latitude=t.coords.latitude,this.longitude=t.coords.longitude,this.speed=t.coords.speed},handleLocationError(t){console.warn(`ERROR(${t.code}): ${t.message}`)}}};const g=(0,c.Z)(v,[["render",m]]);var b=g,w={name:"App",components:{AngleApp:p,GPSApp:b}};const y=(0,c.Z)(w,[["render",a]]);var O=y;(0,n.ri)(O).mount("#app")}},e={};function o(n){var i=e[n];if(void 0!==i)return i.exports;var a=e[n]={exports:{}};return t[n](a,a.exports,o),a.exports}o.m=t,function(){var t=[];o.O=function(e,n,i,a){if(!n){var r=1/0;for(d=0;d<t.length;d++){n=t[d][0],i=t[d][1],a=t[d][2];for(var s=!0,l=0;l<n.length;l++)(!1&a||r>=a)&&Object.keys(o.O).every((function(t){return o.O[t](n[l])}))?n.splice(l--,1):(s=!1,a<r&&(r=a));if(s){t.splice(d--,1);var u=i();void 0!==u&&(e=u)}}return e}a=a||0;for(var d=t.length;d>0&&t[d-1][2]>a;d--)t[d]=t[d-1];t[d]=[n,i,a]}}(),function(){o.d=function(t,e){for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={143:0};o.O.j=function(e){return 0===t[e]};var e=function(e,n){var i,a,r=n[0],s=n[1],l=n[2],u=0;if(r.some((function(e){return 0!==t[e]}))){for(i in s)o.o(s,i)&&(o.m[i]=s[i]);if(l)var d=l(o)}for(e&&e(n);u<r.length;u++)a=r[u],o.o(t,a)&&t[a]&&t[a][0](),t[a]=0;return o.O(d)},n=self["webpackChunkvue"]=self["webpackChunkvue"]||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))}();var n=o.O(void 0,[998],(function(){return o(698)}));n=o.O(n)})();
//# sourceMappingURL=app.4b0b109e.js.map