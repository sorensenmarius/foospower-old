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
        Lowest Win Percentage
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
        // Players with 0 wins are not counted
        return this.players.filter(p => p.wins !== 0).reduce((min, player) => this.getWinPercentage(min) < this.getWinPercentage(player) ? min : player)
      },
    },
    methods: {
      getWinPercentage (player) {
        if (player.games.length === 0 || player.wins === 0) return 0
        return Math.round(player.wins / player.games.length * 100)
      },
    },
  }
</script>
