<template>
  <base-material-card
    class="v-card-profile"
    :avatar="player.avatar ? player.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
  >
    <v-card-text class="text-center">
      <h6 class="display-1 mb-1 grey--text">
        {{ player.name }}
      </h6>

      <h4 class="display-2 font-weight-light black--text">
        Highest Difference In Positions
      </h4>

      <h6 class="display-1 mb-1 grey--text">
        Has {{ Math.round(Math.abs(getPositionWinrateDifference(player))*100) }}% higher winrate on {{ getPositionWinrateDifference(player) > 0 ? 'offense' : 'defense' }}
      </h6>

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
        return this.players.filter(p => p.games >= 25).reduce((max, player) => Math.abs(this.getPositionWinrateDifference(max)) > Math.abs(this.getPositionWinrateDifference(player)) ? max : player)
      },
    },
    methods: {
      getPositionWinrateDifference (player) {
        const offense = {
          wins: 0,
          games: 0,
        }
        const defense = {
          wins: 0,
          games: 0,
        }
        player.games.forEach(game => {
          if (game.blackTeam.offense === player._id) {
            offense.games++
            if (game.blackWin) {
              offense.wins++
            }
            return
          }

          if (game.whiteTeam.offense === player._id) {
            offense.games++
            if (!game.blackWin) {
              offense.wins++
            }
            return
          }

          if (game.blackTeam.defense === player._id) {
            defense.games++
            if (game.blackWin) {
              defense.wins++
            }
            return
          }

          if (game.whiteTeam.defense === player._id) {
            defense.games++
            if (!game.blackWin) {
              defense.wins++
            }
          }
        })

        return (offense.wins / offense.games) - (defense.wins / defense.games)
      },
    },
  }
</script>
