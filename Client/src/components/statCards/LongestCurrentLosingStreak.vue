<template>
  <base-material-card
    class="v-card-profile"
    :avatar="player && player.avatar && anyLosingStreaks ? player.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
  >
    <v-card-text class="text-center">
      <h6
        class="display-1 mb-1 grey--text"
      >
        {{ anyLosingStreaks ? player.name : '' }}
      </h6>

      <h4 class="display-2 font-weight-light black--text">
        {{ anyLosingStreaks ? 'Longest Current Losing Streak' : 'No Current Losing Streaks' }}
      </h4>

      <h6
        v-if="anyLosingStreaks"
        class="display-1 mb-1 grey--text"
      >
        {{ Math.abs(streak(player)) }}
        <img
            class="streakImage"
            src="/losingStreak.png"
        />
      </h6>

      <v-btn
        color="success"
        rounded
        class="mr-0"
        v-if="anyLosingStreaks"
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
          return filteredPlayers.filter(p => p.games >= 25).reduce((min, player) => this.streak(min) < this.streak(player) ? min : player)
        }
        return null
      },
      anyLosingStreaks: function () {
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
