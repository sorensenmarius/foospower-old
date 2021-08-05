import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Home',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'Players',
          path: 'players',
          component: () => import('@/views/players/Players'),
        },
        {
          name: 'Player profile',
          path: 'players/:id',
          component: () => import('@/views/players/PlayerProfile'),
        },
        {
          name: 'Games',
          path: 'games',
          component: () => import('@/views/games/Games'),
        },
      ],
    },
  ],
})
