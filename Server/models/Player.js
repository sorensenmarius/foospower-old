const mongoose = require('mongoose');
const Schema= mongoose.Schema;

let playerSchema = new Schema({
    name: {
        type: String
    },
    games: {
        type: Number
    },
    wins: {
        type: Number
    }
}, {
    collection: 'players',
    timestamps: true
})

module.exports = mongoose.model('Player', playerSchema)