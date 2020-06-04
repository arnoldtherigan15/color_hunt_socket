<template>
    <div class="waiting-room">
        <div class="bg-waiting">
            <h1>waiting room</h1>
            <h3>- {{name}}- </h3>
            <div v-if="!isPlay" class="loading-player">
                <img style="border:none; width:5%" src="https://i.gifer.com/XVo6.gif" alt="wait">
                <p> Waiting for another player </p>
                <img style="border:none; width:5%" src="https://i.gifer.com/XVo6.gif" alt="wait">
            </div>
            <div v-else>
                <button @click="playGame" style="background-color:white;">Play Game</button>
            </div>
            <div class="room-list">
                <div class="card" v-for="(player,i) in roomPlayers" :key="i">
                    <div class="card-body">
                        <h4 class="card-title">{{player}}</h4>
                        <img :src="ava+player" alt="player">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import socket from '../config/socket'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'WaitingRoom',
  data () {
    return {
      name: this.$route.params.name,
      pemains: [
        { name: 'arnold' },
        { name: 'putri' }
      ],
      ava: 'https://api.adorable.io/avatars/285/',
      isPlay: false,
      color: [
        '#ffbdad', // pink,
        '#d6ffff', // blue,
        '#d6ffff', // green
        '#ffffce' // yellow
      ]
    }
  },
  computed: {
    ...mapState(['players']),
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
  watch: {
    roomPlayers (val) {
      if (val.length === 2) {
        this.isPlay = true
      }
    }
  },
  methods: {
    ...mapMutations(['SET_PLAYERS', 'SET_GAME_DATAS', 'SET_GAME_PER_ROOM']),
    playGame () {
      const payload = {
        name: this.$route.params.name,
        username: this.roomPlayers
      }
      socket.emit('startPlay', payload)
      // socket.emit('isFull', payload)
    }
  },
  created () {
    socket.on('someoneJoined', (payload) => {
      this.SET_PLAYERS(payload)
    })
    socket.on('playGame', (payload) => {
      const key = Object.keys(payload)
      key.forEach(element => {
        if (element === this.$route.params.name) {
          this.$router.push(`/game/${this.$route.params.name}`)
          this.SET_GAME_DATAS(payload)
        }
      })
    })
  }
}
</script>

<style scoped>
.card {
    width: 20rem;
    background-color:white;
}
.loading-player {
    display: flex;
    justify-content: center;
}
h1 {
    text-shadow: 5px 5px 3px white;
    font-size: 4rem;
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
.card {
    width: 40% !important;
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

.waiting-room {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/color.gif');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: scroll;
    overflow-x: hidden;
}
.bg-waiting {
    background-color: rgba(236, 240, 241,.5);
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    overflow-x: hidden;
}
</style>
