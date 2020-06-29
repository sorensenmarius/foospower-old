const mongoose = require('mongoose');
const Schema= mongoose.Schema;

var teamSchema = new Schema({
    offense: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }, 
    defense: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }
})

let gameSchema = new Schema({
    loserScore: {
        type: Number
    },
    whiteTeam: {
        type: teamSchema
    },
    blackTeam: {
        type: teamSchema
    },
    blackWin: {
        type: Boolean
    }
}, {
    collection: 'games',
    timestamps: true
})

module.exports = mongoose.model('Game', gameSchema)