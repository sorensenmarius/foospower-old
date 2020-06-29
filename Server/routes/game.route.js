
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Schema= mongoose.Schema;

let GameModel = require('../models/Game');
let PlayerModel = require('../models/Player')

router.route('/getAll').get((req, res, next) => {
    GameModel.find()
    .populate('whiteTeam.offense whiteTeam.defense blackTeam.offense blackTeam.defense')
    .exec((error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/create').post((req, res, next) => {
    let data = req.body
    let gameObject = {
        loserScore: parseInt(data.loserScore),
        whiteTeam: {
            offense: data.players[0],
            defense: data.players[2]
        },
        blackTeam: {
            offense: data.players[1],
            defense: data.players[3]
        },
        blackWin: data.blackWin
    }
    GameModel.create(gameObject, (error, data) => {
        if(error) {
            return next(error)
        } else {
            let winnerTeam = data.blackWin ? data.blackTeam : data.whiteTeam
            let loserTeam = !data.blackWin ? data.blackTeam : data.whiteTeam
            winnerTeam = [mongoose.Types.ObjectId(winnerTeam.offense), mongoose.Types.ObjectId(winnerTeam.defense)]
            loserTeam = [mongoose.Types.ObjectId(loserTeam.offense), mongoose.Types.ObjectId(loserTeam.defense)]
            PlayerModel.updateMany({ _id: {$in: winnerTeam}}, {
                $push: {
                    games: data._id
                },
                $inc: {
                    wins: 1
                }
            }, (err) => {
                if(err) {
                    return next(error)
                }
            })
            PlayerModel.updateMany({ _id: {$in: loserTeam}}, {
                $push: {
                    games: data._id
                }
            }, (err) => {
                if(err) {
                    return next(error)
                }
            })
            res.json(data)
        }
    })
})

router.route('/edit').post((req, res, next) => {
    let reqData = req.body
    let newGameObject = {
        loserScore: parseInt(reqData.loserScore),
        whiteTeam: {
            offense: reqData.players[0],
            defense: reqData.players[2]
        },
        blackTeam: {
            offense: reqData.players[1],
            defense: reqData.players[3]
        },
        blackWin: reqData.blackWin
    }
    GameModel.findOne({_id: reqData.id}, (error, data) => {
        if(error) return next(error)
        let winnerTeam = data.blackWin ? data.blackTeam : data.whiteTeam
        let loserTeam = !data.blackWin ? data.blackTeam : data.whiteTeam
        winnerTeam = [mongoose.Types.ObjectId(winnerTeam.offense), mongoose.Types.ObjectId(winnerTeam.defense)]
        loserTeam = [mongoose.Types.ObjectId(loserTeam.offense), mongoose.Types.ObjectId(loserTeam.defense)]
        PlayerModel.updateMany({ _id: {$in: winnerTeam}}, {
            $pull: {
                games: data._id
            },
            $inc: {
                wins: -1
            }
        }, (err) => {
            if(err) {
                return next(error)
            }
        })
        PlayerModel.updateMany({ _id: {$in: loserTeam}}, {
            $pull: {
                games: data._id
            }
        }, (err) => {
            if(err) {
                return next(error)
            }
        })
    })
    GameModel.updateOne({_id: reqData.id},{
        $set: {
            loserScore: newGameObject.loserScore,
            blackTeam: newGameObject.blackTeam,
            whiteTeam: newGameObject.whiteTeam,
            blackWin: newGameObject.blackWin
        },
    }, (error, data) => {
        if(error) return next(error)
    })
    let winnerTeam = newGameObject.blackWin ? newGameObject.blackTeam : newGameObject.whiteTeam
    let loserTeam = !newGameObject.blackWin ? newGameObject.blackTeam : newGameObject.whiteTeam
    // Should probably use .map here ;)
    winnerTeam = [mongoose.Types.ObjectId(winnerTeam.offense), mongoose.Types.ObjectId(winnerTeam.defense)]
    loserTeam = [mongoose.Types.ObjectId(loserTeam.offense), mongoose.Types.ObjectId(loserTeam.defense)]
    PlayerModel.updateMany({ _id: {$in: winnerTeam}}, {
        $push: {
            games: reqData.id
        },
        $inc: {
            wins: 1
        }
    }, (err) => {
        if(err) {
            return next(error)
        }
    })
    PlayerModel.updateMany({ _id: {$in: loserTeam}}, {
        $push: {
            games: reqData.id
        }
    }, (err) => {
        if(err) {
            return next(error)
        }
    })
})

router.route('/get/:id').get((req, res, next) => {
    GameModel.findOne({_id: req.params.id})
    .populate('whiteTeam.offense whiteTeam.defense blackTeam.offense blackTeam.defense')
    .exec((error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/delete/:id').delete((req, res, next) => {
    GameModel.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

router.route('/deleteAll').delete((req, res, next) => {
    GameModel.remove({}, (error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

module.exports = router;