import Vue from 'vue'
import VueRouter from 'vue-router'
import SetState from '../components/SetState'

Vue.use(VueRouter)

const routes = [
  {
    path: '/setState',
    name: 'SetState',
    component: SetState
  }
]

const router = new VueRouter({
  routes
})

export default router
