<template>
  <div class="home">
    <div class="bg-room">
      <h1>List of Rooms</h1>
      <div class="room-create">
        <form @submit.prevent="create">
          <input v-model="name" type="text" placeholder="Room name here" required>
          <input type="submit" value="Create Room">
        </form>
      </div>
      <div class="room-list">
        <div
          class="card"
          style="width: 20rem; background-color:white;"
          v-for="room in rooms" :key="room.name"
        >
          <div class="card-body">
            <h4 class="card-title">{{room.name}}</h4>
            <h5 class="card-subtitle">Color-War</h5>
            <button @click="joinGame(room.name)" style="width:100%">Join</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import socket from '../config/socket'
// @ is an alias to /src

export default {
  name: 'Room',
  data () {
    return {
      name: '',
      ava: 'https://api.adorable.io/avatars/285/'
    }
  },
  computed: {
    ...mapState([
      'rooms', 'players'
    ]),
    roomPlayers () {
      let data
      const play = this.players
      const key = Object.keys(play)
      key.forEach(element => {
        if (element === this.$route.params.name) {
          data = this.players[element]
        }
      })
      return data
    }
  },
  methods: {
    ...mapMutations([
      'SET_FULL_ROOM_NAME'
    ]),
    ...mapActions([
      'createRoom', 'fetchRooms'
    ]),
    create () {
      const data = this.name
      this.createRoom(data)
      // socket dari store vuex
      this.$router.push(`/room/${data}`)
    },
    fetch () {
      this.fetchRooms()
    },
    joinGame (name) {
      const payload = {
        name,
        username: localStorage.getItem('username')
      }
      socket.emit('joinRoom', payload)
      this.$router.push(`/room/${name}`)
    }
  },
  created () {
    this.fetchRooms()
    socket.on('fullRoom', payload => {
      // alert('masuk')
      this.SET_FULL_ROOM_NAME(payload)
    })
  }
}
</script>

<style scoped>
h1 {
  text-shadow: 5px 5px 3px white;
  font-size: 4rem;
}
.bg-room {
  background-color: rgba(236, 240, 241,.5);
  width: 100%;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
  padding: 4%;
}
.home {
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-image: url('../assets/color.gif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.room-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.room-list div {
  margin: 10px;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-body img {
  width: 40%;
  padding: 20px;
}
</style>
