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
        Longest Losing Streak
      </h4>

      <h6 class="display-1 mb-1 grey--text">
        {{ player.longestLosingStreak }}
        <img
          class="streakImage"
          src="/losingStreak.png"
        />
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
        return this.players.reduce((max, player) => max.longestLosingStreak > player.longestLosingStreak ? max : player)
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
