import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../config/axios'
import socket from '../config/socket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rooms: [],
    players: [],
    gameDatas: [],
    gamePerRoom: [],
    isOver: false,
    countTime: undefined,
    winName: '',
    fullRoomName: ''
  },
  mutations: {
    SET_FULL_ROOM_NAME (state, payload) {
      for (let i = 0; i < state.rooms.length; i++) {
        if (state.rooms[i].name == payload) {
          state.rooms.splice(i, 1);
        }
      }
      state.fullRoomName = payload
      console.log('masukkkkkkk', state.fullRoomName)
    },
    SET_WIN_NAME (state, payload) {
      state.winName = payload
    },
    SET_TIME (state, payload) {
      state.countTime = payload
    },
    SET_GAME_PER_ROOM (state, payload) {
      state.gamePerRoom = payload
    },
    SET_IS_OVER (state, payload) {
      state.isOver = payload
    },
    SET_ROOMS (state, payload) {
      state.rooms = payload
    },
    SET_PLAYERS (state, payload) {
      state.players = payload
    },
    ADD_NEW_ROOM (state, payload) {
      state.rooms.push(payload)
    },
    SET_GAME_DATAS (state, payload) {
      state.gameDatas = payload
    },
    UPDATE_PLAYER (state, payload) {
      for (let i = 0; i < state.gameDatas[payload.name].gameDatas.length; i++) {
        if (state.gameDatas[payload.name].gameDatas[i].id === payload.id) {
          state.gameDatas[payload.name].gameDatas[i].player = payload.player
        }
      }
    }
  },
  actions: {
    createRoom ({ commit, dispatch }, payload) {
      axios({
        method: 'post',
        url: '/rooms',
        data: {
          name: payload
        }
      })
        .then(({ data }) => {
          dispatch('fetchRooms')
          socket.emit('createRoom', {
            name: payload,
            username: localStorage.username
          })
        })
    },
    fetchRooms ({ commit }) {
      return axios({
        method: 'get',
        url: '/rooms'
      })
        .then(({ data }) => {
          commit('SET_ROOMS', data)
          socket.on('roomCreated', (room) => {
            commit('ADD_NEW_ROOM', room)
          })
        })
    }
  },
  modules: {
  }
})
