
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

let GameModel = require('../models/Game');
let utils = require('../utilities/utils')

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

router.route('/create').post(async (req, res, next) => {
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
    await GameModel.create(gameObject, async (error, data) => {
        if(error) {
            return next(error)
        } else {
            await utils.addGameToPlayers(data)
            res.json(data)
        }
    })
})

router.route('/edit').post(async (req, res, next) => {
    let reqData = req.body
    let game = await GameModel.findOne({_id: reqData.id})
    await utils.deleteGameFromPlayers(game)
    game.loserScore = reqData.loserScore
    game.whiteTeam = {
        offense: reqData.players[0],
        defense: reqData.players[2]
    }
    game.blackTeam = {
        offense: reqData.players[1],
        defense: reqData.players[3]
    }
    game.blackWin = reqData.blackWin
    await game.save()
    await utils.addGameToPlayers(game)
    res.json(game)
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

router.route('/delete/:id').delete(async (req, res, next) => {
    let game = await GameModel.findOne({_id: req.params.id})
    await utils.deleteGameFromPlayers(game)
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
    GameModel.deleteMany({}, (error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

module.exports = router;