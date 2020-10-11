<template>
  <base-material-card
    class="v-card-profile"
    :avatar="player && player.avatar && anyWinningStreaks ? player.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
  >
    <v-card-text class="text-center">
      <h6
        class="display-1 mb-1 grey--text"
      >
        {{ anyWinningStreaks ? player.name : '' }}
      </h6>

      <h4 class="display-2 font-weight-light black--text">
        {{ anyWinningStreaks ? 'Longest Current Winning Streak' : 'No Current Winning Streaks' }}
      </h4>

      <h6
        v-if="anyWinningStreaks"
        class="display-1 mb-1 grey--text"
      >
        {{ Math.abs(streak(player)) }}
        <img
            class="streakImage"
            src="/winningStreak.jpg"
        />
      </h6>

      <v-btn
        color="success"
        rounded
        class="mr-0"
        v-if="anyWinningStreaks"
        @click="$router.push(`players/${player._id}`)"
      >
        Show Profile
      </v-btn>
    </v-card-text>
  </base-material-card>
</template>

<script>
  export default {
    props: {
      players: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      player: function () {
        const filteredPlayers = this.players.filter(p => p.games >= 25)
        if (filteredPlayers.length) {
          return filteredPlayers.filter(p => p.games >= 25).reduce((max, player) => this.streak(max) > this.streak(player) ? max : player)
        }
        return null
      },
      anyWinningStreaks: function () {
        if (this.player) {
          return this.streak(this.player) < 0
        }
        return false
      },
    },
    methods: {
      playerWon (game, player) {
        if (game.blackWin) {
          if (game.blackTeam.offense === player._id || game.blackTeam.defense === player._id) return true
          return false
        } else {
          if (game.whiteTeam.offense === player._id || game.whiteTeam.defense === player._id) return true
          return false
        }
      },
      streak: function (player) {
        let currentStreak = 0
        let done = false
        const games = [...player.games]
        games.reverse()
        for (const g of games) {
          done = true
          if (this.playerWon(g, player) && currentStreak >= 0) {
            currentStreak += 1
            done = false
          } else if (!this.playerWon(g, player) && currentStreak <= 0) {
            currentStreak -= 1
            done = false
          }
          if (done) break
        };
        if (player.longestWinningStreak < currentStreak) {
          this.$http.post('player/setWinningStreak', {
            id: player._id,
            streak: currentStreak,
          })
        }

        if (player.longestLosingStreak > currentStreak) {
          this.$http.post('player/setLosingStreak', {
            id: player._id,
            streak: currentStreak,
          })
        }
        return currentStreak
      },
    },
  }
</script>
