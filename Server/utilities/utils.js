let GameModel = require("../models/Game");
let PlayerModel = require("../models/Player");

const mongoose = require("mongoose");

async function deleteGameFromPlayers(data) {
  let winnerTeam = data.blackWin ? data.blackTeam : data.whiteTeam;
  let loserTeam = !data.blackWin ? data.blackTeam : data.whiteTeam;
  winnerTeam = [
    mongoose.Types.ObjectId(winnerTeam.offense),
    mongoose.Types.ObjectId(winnerTeam.defense),
  ];
  loserTeam = [
    mongoose.Types.ObjectId(loserTeam.offense),
    mongoose.Types.ObjectId(loserTeam.defense),
  ];
  PlayerModel.updateMany(
    { _id: { $in: winnerTeam } },
    {
      $pull: {
        games: data._id,
      },
      $inc: {
        wins: -1,
      },
    },
    (err) => {
      if (err) {
        return next(error);
      }
    }
  );
  PlayerModel.updateMany(
    { _id: { $in: loserTeam } },
    {
      $pull: {
        games: data._id,
      },
    },
    (err) => {
      if (err) {
        return next(error);
      }
    }
  );
}

async function addGameToPlayers(data) {
  let winnerTeam = data.blackWin ? data.blackTeam : data.whiteTeam;
  let loserTeam = !data.blackWin ? data.blackTeam : data.whiteTeam;
  winnerTeam = [
    mongoose.Types.ObjectId(winnerTeam.offense),
    mongoose.Types.ObjectId(winnerTeam.defense),
  ];
  loserTeam = [
    mongoose.Types.ObjectId(loserTeam.offense),
    mongoose.Types.ObjectId(loserTeam.defense),
  ];

  await updateRating(winnerTeam, loserTeam);

  PlayerModel.updateMany(
    { _id: { $in: winnerTeam } },
    {
      $push: {
        games: data._id,
      },
      $inc: {
        wins: 1,
      },
    },
    (err) => {
      if (err) {
        return next(err);
      }
    }
  );
  PlayerModel.updateMany(
    { _id: { $in: loserTeam } },
    {
      $push: {
        games: data._id,
      },
    },
    (err) => {
      if (err) {
        return next(err);
      }
    }
  );
}

async function updateRating(winnerTeam, loserTeam) {
  let winnerOffense = await PlayerModel.findById(winnerTeam[0]);
  let winnerDefense = await PlayerModel.findById(winnerTeam[1]);

  let loserOffense = await PlayerModel.findById(loserTeam[0]);
  let loserDefense = await PlayerModel.findById(loserTeam[1]);

  let winnerRating =
    (winnerOffense.offenseRating + winnerDefense.defenseRating) / 2;
  let loserRating =
    (loserOffense.offenseRating + loserDefense.defenseRating) / 2;

  let ratingDelta = getRatingDelta(winnerRating, loserRating);

  await addRatingAndWinStreakToPlayer(winnerOffense, ratingDelta, true, true);
  await addRatingAndWinStreakToPlayer(winnerDefense, ratingDelta, false, true);
  await addRatingAndWinStreakToPlayer(loserOffense, ratingDelta, true, false);
  await addRatingAndWinStreakToPlayer(loserDefense, ratingDelta, false, false);
}

function getRatingDelta(myRating, opponentRating) {
  var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

  return Math.round(64 * (1 - myChanceToWin));
}

async function addRatingAndWinStreakToPlayer(
  player,
  rating,
  isOffense,
  hasWon
) {
  rating = hasWon ? rating : -rating;

  if (isOffense) {
    player.offenseRating += rating;
    player.offenseRatings.push(player.offenseRating);
  } else {
    player.defenseRating += rating;
    player.defenseRatings.push(player.defenseRating);
  }

  if (player.winStreak >= 0 && player.hasWon) {
    player.winStreak += 1;
  } else if (player.winStreak <= 0 && !player.hasWon) {
    player.winStreak -= 1;
  } else {
    player.winStreak = 0;
  }

  if (player.winStreak > player.longestWinStreak)
    player.longestWinStreak = player.winStreak;
  if (player.winStreak < player.longestLosingStreak)
    player.longestLosingStreak = player.winStreak;

  await player.save();
}

module.exports = {
  deleteGameFromPlayers,
  addGameToPlayers,
  getRatingDelta,
};
