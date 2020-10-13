<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(player, index) in players"
        :key="'p-' + index"
        cols="12"
        sm="12"
        md="6"
        lg="4"
      >
        <base-material-card
          class="v-card-profile"
          :avatar="player.avatar ? player.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
        >
          <v-card-text class="text-center">
            <h5 class="display-2 mb-1 grey--text">
              {{ player.rating }}
            </h5>
            <h6 class="display-1 mb-1 grey--text">
              {{ player.games.length }} | {{ getWinPercentage(player) + '%' }} <span v-html="showStreak(player)" />
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ player.name }}
            </h4>

            <v-btn
              color="success"
              rounded
              class="mr-0"
              @click="$router.push(`players/${player._id}`)"
            >
              Show Profile
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        // players: [],
      }
    },
    computed: {
      players: function () {
        const players = this.$store.getters.getAllPlayers
        return players.sort((a, b) => (a.rating > b.rating ? -1 : 1))
      },
    },
    mounted () {
      this.getAllPlayers()
    },
    methods: {
      getAllPlayers () {
        this.$store.dispatch('getAllPlayersFromApi')
      },
      getWinPercentage (player) {
        if (player.games.length === 0 || player.wins === 0) return 0
        return Math.round(player.wins / player.games.length * 100)
      },
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

        if (currentStreak < 0 && player.longestLosingStreak < Math.abs(currentStreak)) {
          this.$http.post('player/setLosingStreak', {
            id: player._id,
            streak: currentStreak,
          })
        }
        return currentStreak
      },
      showStreak (player) {
        const streakNumber = this.streak(player)
        if (streakNumber >= 3) {
          return ` | ${streakNumber} <img class='streakImage' src=' ./winningStreak.jpg' />`
        }
        if (streakNumber <= -3) {
          return ` | ${streakNumber * -1} <img class='streakImage' src='./losingStreak.png' />`
        }
        return ''
      },
    },
  }
</script>

<style>
  img.streakImage {
    height: 20px;
    margin-bottom: -4px;
  }
</style>
