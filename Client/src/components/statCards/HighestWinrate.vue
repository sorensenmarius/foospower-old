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
        Highest Win Percentage
      </h4>

      <h6 class="display-1 mb-1 grey--text">
        {{ getWinPercentage(player) + '%' }}
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
        return this.players.filter(p => p.games >= 25).reduce((max, player) => this.getWinPercentage(max) > this.getWinPercentage(player) ? max : player)
      },
    },
    methods: {
      getWinPercentage (player) {
        return Math.round(player.wins / player.games.length * 100)
      },
    },
  }
</script>
