<template>
    <div class="game">
        <div class="bg-game">
          <div v-if="!isOver">
            <Basetimer></Basetimer>
            <!-- {{score}} -->
            <!-- <h1>Fill all the boxes</h1> -->
            <div class="score-board">
              <div class="score-detail" v-for="(el,i) in score" :key="i">
                <div class="score-info" v-if="i !== ''">
                  <img :src="ava + i" alt="ava">
                  <p>{{i}} : {{el}}</p>
                </div>
              </div>
            </div>
            <!-- {{gameInRoom}} -->
            <div class="board">
                <div @click="addColor(board.id)" class="board-item" :class="'board-' + board.id" v-for="board in gamePerRoom" :key="board.id" style="cursor:pointer">
                    <div v-if="board.player !== ''">
                        <img class="board-img" :src="ava + board.player" alt="ava">
                    </div>
                </div>
            </div>
          </div>
          <div v-else>
            <h1>{{winName}} is the WINNER</h1>
            <button @click.prevent="toHome" style="background-color:white;">Play Again</button>
          </div>
        </div>
        <audio ref="audioElm" src="../assets/sounds/touch.mp3"></audio>
    </div>
</template>

<script>
import socket from '../config/socket'
import axios from '../config/axios'
import { mapState, mapMutations } from 'vuex'
import Basetimer from '../components/Basetimer'
export default {
  name: 'Game',
  components: {
    Basetimer
  },
  data () {
    return {
      ava: 'https://api.adorable.io/avatars/285/'
    }
  },
  computed: {
    ...mapState([
      'gameDatas', 'gamePerRoom', 'countTime', 'isOver', 'winName'
    ]),
    gamePerRoom () {
      let gameInRoom = []
      const key = Object.keys(this.gameDatas)
      key.forEach(element => {
        if (element === this.$route.params.name) {
          gameInRoom = this.gameDatas[element].gameDatas
        }
      })
      return gameInRoom
    },
    score () {
      const obj = {}
      this.gamePerRoom.forEach(element => {
        if (!obj[element.player]) {
          obj[element.player] = 1
        } else {
          obj[element.player]++
        }
      })
      return obj
    }
  },
  methods: {
    ...mapMutations([
      'UPDATE_PLAYER', 'SET_GAME_DATAS', 'SET_GAME_PER_ROOM', 'SET_WIN_NAME', 'SET_IS_OVER'
    ]),
    toHome () {
      const datapay = {
        name: this.$route.params.name
      }
      socket.emit('endGame', datapay)
      // socket.emit('')
    },
    addColor (id) {
      this.$refs.audioElm.play()
      const payload = {
        id,
        player: localStorage.username,
        name: this.$route.params.name
      }
      this.UPDATE_PLAYER(payload)
      const datapayload = {
        nameroom: this.$route.params.name,
        datagame: this.gameDatas
      }
      socket.emit('updatePlayer', datapayload)
    },
    start () {
      this.$confetti.start()
    },

    stop () {
      this.$confetti.stop()
    }
  },
  watch: {
    gameDatas: {
      handler: function (val, oldVal) {
        socket.on('newPlayerData', payload => {
          this.SET_GAME_DATAS(payload)
        })
      },
      deep: true
    },
    countTime (val) {
      // win check
      if (val === 0) {
        const win = {
          max: 0,
          name: ''
        }
        const key = Object.keys(this.score)
        for (let i = 0; i < key.length; i++) {
          if (key[i] !== '') {
            if (i === 0) {
              win.max = this.score[key[i]]
              win.name = key[i]
            } else {
              if (win.max < this.score[key[i]]) {
                win.max = this.score[key[i]]
                win.name = key[i]
              }
            }
          }
        }
        const dataWin = {
          name: this.$route.params.name,
          playerWin: win.name
        }
        socket.emit('timesup', dataWin)
        axios({
          method: 'delete',
          url: `/rooms/${this.$route.params.name}`,
          token: localStorage.token
        })
          .then(_ => {
            console.log('ROOOM DELETED')
          })
          .catch(err => {
            console.log(err, 'ERRRO DELETEEE')
          })
      }
    }
  },
  created () {
    socket.on('newPlayerData', payload => {
      this.SET_GAME_DATAS(payload)
    })

    socket.on('winner', payload => {
      this.$confetti.start()
      this.SET_WIN_NAME(payload.playerWin)
      this.SET_IS_OVER(true)
    })

    socket.on('playAgain', payload => {
      this.$router.push('/')
      this.$confetti.stop()
      this.SET_IS_OVER(false)
      location.reload()
    })
  }
}
</script>

<style scoped>
.score-board {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  margin-right: 25px;
}
.score-detail {
  display: flex;
  justify-content: flex-end;
}
.score-info {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.score-board  img{
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.board-img {
    width: 100% !important;
    height: 100% !important;
}
.board-item {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid black;
    margin: 5px;
    cursor: pointer;
}
.board {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
    height: 100%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
}
.game {
    background-image: url('../assets/color.gif');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
.bg-game {
    background-color: rgba(236, 240, 241,.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 15%;
}
</style>
