import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vuex.Store.prototype.$http = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    allPlayers: [],
    allGames: [],
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    setAllPlayers (state, payload) {
      state.allPlayers = payload
    },
    setAllGames (state, payload) {
      state.allGames = payload
    },
  },
  actions: {
    async getAllPlayersFromApi (context) {
      const res = await this.$http.get('player/getAll')
      context.commit('setAllPlayers', res.data)
    },
    async getAllGamesFromApi (context) {
      const res = await this.$http.get('game/getAll')
      context.commit('setAllGames', res.data)
    },
  },
  getters: {
    getAllPlayers: state => {
      return state.allPlayers
    },
    getAllGames: state => {
      return state.allGames
    },
  },
})
