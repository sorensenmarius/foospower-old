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
        Highest Difference In Color
      </h4>

      <h6 class="display-1 mb-1 grey--text">
        Has {{ Math.round(Math.abs(getColorWinrateDifference(player))*100) }}% higher winrate with {{ getColorWinrateDifference(player) > 0 ? 'black' : 'white' }}
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
        return this.players.filter(p => p.games >= 25).reduce((max, player) => Math.abs(this.getColorWinrateDifference(max)) > Math.abs(this.getColorWinrateDifference(player)) ? max : player)
      },
    },
    methods: {
      getColorWinrateDifference (player) {
        const black = {
          wins: 0,
          games: 0,
        }
        const white = {
          wins: 0,
          games: 0,
        }
        player.games.forEach(game => {
          if (game.blackTeam.offense === player._id || game.blackTeam.defense === player._id) {
            black.games++
            if (game.blackWin) {
              black.wins++
            }
            return
          }

          if (game.whiteTeam.offense === player._id || game.whiteTeam.defense === player._id) {
            white.games++
            if (!game.blackWin) {
              white.wins++
            }
          }
        })

        return (black.wins / black.games) - (white.wins / white.games)
      },
    },
  }
</script>
