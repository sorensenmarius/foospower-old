const express = require('express');
const router = express.Router();

let PlayerModel = require('../models/Player');

router.route('/getAll').get((req, res, next) => {
    PlayerModel.find()
    .populate('games')
    .exec((error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/create').post((req, res, next) => {
    PlayerModel.create(req.body, (error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/get/:id').get((req, res, next) => {
    PlayerModel.findById(req.params.id)
    .populate('games')
    .exec((error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/delete/:id').delete((req, res, next) => {
    PlayerModel.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

router.route('/resetAll').get((req, res, next) => {
    PlayerModel.updateMany({}, {
        $set: {
            games: [],
            wins: 0
        }
    }, (error, data) => {
        if(error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/setWinningStreak').post(async (req, res, next) => {
    let player = await PlayerModel.findOne({_id: req.body.id})
    player.longestWinningStreak = req.body.streak;
    await player.save()
    res.json(player)
})

router.route('/setLosingStreak').post(async (req, res, next) => {
    let player = await PlayerModel.findOne({_id: req.body.id})
    player.longestLosingStreak = Math.abs(req.body.streak);
    await player.save()
    res.json(player)
})

module.exports = router;