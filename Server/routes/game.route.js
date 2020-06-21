
const express = require('express');
const router = express.Router();

let GameModel = require('../models/Game');

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
    GameModel.create()
    .populate('whiteTeam.offense whiteTeam.defense blackTeam.offense blackTeam.defense')
    .exec(req.body, (error, data) => {
        if(error) {
            return next(error)
        } else {
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