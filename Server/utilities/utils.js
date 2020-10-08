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
    
    await updateRating(winnerTeam, loserTeam)

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

async function updateRating(winnerTeam, loserTeam) {
    let winnerOffense = await PlayerModel.findById(winnerTeam[0])
    let winnerDefense = await PlayerModel.findById(winnerTeam[1])

    let loserOffense = await PlayerModel.findById(loserTeam[0])
    let loserDefense = await PlayerModel.findById(loserTeam[1])
    

    let winnerRating = ( winnerOffense.rating + winnerDefense.rating ) / 2
    let loserRating = ( loserOffense.rating + loserDefense.rating ) / 2

    let ratingDelta = getRatingDelta(winnerRating, loserRating, 1)
    winnerOffense.rating += ratingDelta
    winnerDefense.rating += ratingDelta

    loserOffense.rating -= ratingDelta
    loserDefense.rating -= ratingDelta

    await winnerOffense.save()
    await winnerDefense.save()
    await loserOffense.save()
    await loserDefense.save()
}

function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 1].indexOf(myGameResult) === -1) {
        return null;
    }

    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(64 * (myGameResult - myChanceToWin));
}

module.exports = {
    deleteGameFromPlayers,
    addGameToPlayers
}