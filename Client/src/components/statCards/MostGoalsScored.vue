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
        Most Goals Scored
      </h4>

      <h6 class="display-1 mb-1 grey--text">
        {{ goalsScored(player) }}
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
        return this.players.reduce((max, player) => this.goalsScored(max) > this.goalsScored(player) ? max : player)
      },
    },
    methods: {
      goalsScored (player) {
        let goals = 0
        player.games.forEach(game => {
          if (game.whiteTeam.offense === player._id || game.whiteTeam.defense === player._id) {
            if (!game.blackWin) {
              goals += 10
            } else {
              goals += game.loserScore
            }
          }

          if (game.blackTeam.offense === player._id || game.blackTeam.defense === player._id) {
            if (game.blackWin) {
              goals += 10
            } else {
              goals += game.loserScore
            }
          }
        })
        return goals
      },
    },
  }
</script>
