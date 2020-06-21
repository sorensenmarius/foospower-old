const express = require('express');
const router = express.Router();

let PlayerModel = require('../models/Player');

router.route('/getAll').get((req, res, next) => {
    console.log("player/")
    PlayerModel.find((error, data) => {
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
    PlayerModel.findById(req.params.id, (error, data) => {
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

module.exports = router;