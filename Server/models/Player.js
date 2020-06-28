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
    }
}, {
    collection: 'players',
    timestamps: true
})

module.exports = mongoose.model('Player', playerSchema)