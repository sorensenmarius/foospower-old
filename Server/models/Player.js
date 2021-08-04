const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let playerSchema = new Schema(
  {
    name: {
      type: String,
    },
    games: [
      {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    wins: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "",
    },
    winStreak: {
      type: Number,
      default: 0,
    },
    longestWinStreak: {
      type: Number,
      default: 0,
    },
    longestLosingStreak: {
      type: Number,
      default: 0,
    },
    offenseRating: {
      type: Number,
      default: 1000,
    },
    offenseRatings: {
      type: [Number],
      default: [1000],
    },
    defenseRating: {
      type: Number,
      default: 1000,
    },
    defenseRatings: {
      type: [Number],
      default: [1000],
    },
  },
  {
    collection: "players",
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);
