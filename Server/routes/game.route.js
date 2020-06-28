
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
            offense: data.players[1],
            defense: data.players[3]
        },
        blackTeam: {
            offense: data.players[0],
            defense: data.players[2]
        },
        blackWin: data.blackWin
    }
    GameModel.create(gameObject, (error, data) => {
        if(error) {
            return next(error)
        } else {
            // Damn this is ugly
            let winnerTeam = data.blackWin ? data.blackTeam : data.whiteTeam
            let loserTeam = !data.blackWin ? data.blackTeam : data.whiteTeam
            winnerTeam = [mongoose.Types.ObjectId(winnerTeam.offense), mongoose.Types.ObjectId(winnerTeam.defense)]
            loserTeam = [mongoose.Types.ObjectId(winnerTeam.offense), mongoose.Types.ObjectId(winnerTeam.defense)]
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

module.exports = router;