import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import * as fb from 'firebase'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import SetState from './components/SetState'
Vue.component('app-stat', SetState)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  vuetify,
  data: () => ({
  }),
  created: function () {
    const firebaseConfig = {
      apiKey: 'AIzaSyADsW4PR-pPQCO36yE1wbN_ius5d6SNP9g',
      authDomain: 'it-project-a6bdb.firebaseapp.com',
      databaseURL: 'https://it-project-a6bdb.firebaseio.com',
      projectId: 'it-project-a6bdb',
      storageBucket: 'it-project-a6bdb.appspot.com',
      messagingSenderId: '365134993779',
      appId: '1:365134993779:web:18ed3ac968259c02574d06'
    }
    // Initialize Firebase
    fb.initializeApp(firebaseConfig)
    // this.$store.dispatch('fetchGame')
    this.$store.dispatch('fetchMatches')
    this.$store.dispatch('fetchPlayers')
  },
  render: h => h(App)
}).$mount('#app')
