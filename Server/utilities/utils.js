let GameModel = require('../models/Game');
let PlayerModel = require('../models/Player')

const mongoose = require('mongoose');

async function deleteGameFromPlayers(data) {
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
}

async function addGameToPlayers(data) {
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
            return next(err)
        }
    })
    PlayerModel.updateMany({ _id: {$in: loserTeam}}, {
        $push: {
            games: data._id
        }
    }, (err) => {
        if(err) {
            return next(err)
        }
    })
}

module.exports = {
    deleteGameFromPlayers,
    addGameToPlayers
}