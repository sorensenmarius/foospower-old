<template>
  <base-material-card
    class="v-card-profile"
    avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
  >
    <v-card-text class="text-center">
      <h6 class="display-1 mb-1 grey--text">
        {{ player.name }}
      </h6>

      <h4 class="display-2 font-weight-light black--text">
        Most Games Played
      </h4>

      <h6 class="display-1 mb-1 grey--text">
        {{ player.games.length }}
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
        return this.players.reduce((max, player) => max.games.length > player.games.length ? max : player)
      },
    },
  }
</script>
