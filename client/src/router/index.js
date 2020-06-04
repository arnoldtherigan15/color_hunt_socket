import Vue from 'vue'
import VueRouter from 'vue-router'
import Room from '../views/Room.vue'
import Home from '../views/Home.vue'
import WaitingRoom from '../views/WaitingRoom.vue'
import Game from '../views/Game.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/rooms',
    name: 'Room',
    component: Room
  },
  {
    path: '/room/:name',
    name: 'WaitingRoom',
    component: WaitingRoom
  },
  {
    path: '/game/:name',
    name: 'Game',
    component: Game
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
