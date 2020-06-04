const router = require('express').Router()
const roomController = require('../controller/roomController')
// const todoRouter = require('./todoRouter')
const gameData = require('../helpers/gameData')

router.get('/',(req,res,next)=>{
    res.json({message:'tesss'})
})

router.post('/rooms',roomController.create)
router.get('/rooms',roomController.getAll)
router.delete('/rooms/:name',roomController.delete)

module.exports = function (io) {
    //Socket.IO
    // let players = []
    let players = {}
    let games = {}
    let gameDatas = gameData()
    
    io.on('connection', function (socket) {
        console.log('User has connected to Index');
        //ON Events
        console.log(socket.id);
        // test saat ada yg post
        socket.on('createRoom', (payload) => {
            if (players[payload.name] == undefined) {
                players[payload.name] = [payload.username]
            } else {
                players[payload.name].push(payload.username)
            }
            socket.join(payload.name, (err) => {
                if(err) {
                    console.log(err)
                } else {
                    io.to(payload.name).emit('someoneJoined', players)
                    io.emit('roomCreated', payload)
                }
            })
        })
        socket.on('joinRoom', (payload) => {
            if (players[payload.name] == undefined) {
                players[payload.name] = [payload.username]
            } else {
                players[payload.name].push(payload.username)
            }
            socket.join(payload.name, () => {
              io.to(payload.name).emit('someoneJoined', players)
            })
        })
        socket.on('startPlay', (payload) => {
            if (games[payload.name] == undefined) {
                games[payload.name] = {
                    'status' : true,
                    players: [
                        payload.username
                    ],
                    gameDatas
                }
            } else {
                games[payload.name] = {
                    'status' : true,
                    players: [
                        payload.username
                    ],
                    gameDatas
                }
            }
            io.to(payload.name).emit('playGame', games)
            io.emit('fullRoom',payload.name)
        })

        // socket.on('isFull', (payload) => {
        // })
        
        socket.on('updatePlayer',payload => {
            io.to(payload.nameroom).emit('newPlayerData', payload.datagame)
        })
        socket.on('timesup', payload => {
            io.to(payload.name).emit('winner',payload)
        })
        
        socket.on('endGame', payload => {            
            io.to(payload.name).emit('playAgain',payload)
            socket.disconnect()
        })

        
        //End ON Events
    });
    return router;
};