const { Room } = require('../models')

class RoomController {
    static create (req,res,next) {
        let { name } = req.body
        Room.create({
            name
        })
            .then(data=>{
                res.status(201).json({
                    msg:'room created',
                    id: data.id,
                    name: data.name
                })
                
            })
            .catch(next)
    }
    static getAll (req,res,next) {
        Room.findAll()
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static delete (req,res,next) {
        let { name } = req.params
        Room.destroy({
            where : { name }
        })
            .then(data =>{
                if (data) {
                    res.status(200).json({
                        message: `Room ${id} deleted`
                    })
                  } else {
                    next({status:404,msg:'not found'})
                  }
            })
            .catch(next)
    }
}

module.exports = RoomController