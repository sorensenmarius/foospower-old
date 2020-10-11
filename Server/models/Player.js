const mongoose = require('mongoose');
const Schema= mongoose.Schema;

let playerSchema = new Schema({
    name: {
        type: String
    },
    games: [{
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }],
    wins: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: ''
    },
    longestWinningStreak: {
        type: Number,
        default: 0
    },
    longestLosingStreak: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 1000
    }
}, {
    collection: 'players',
    timestamps: true
})

module.exports = mongoose.model('Player', playerSchema)