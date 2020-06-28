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
          avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              {{ player.games.length }} | {{ getWinPercentage(player) + '%' }}
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
        return this.$store.getters.getAllPlayers
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
    },
  }
</script>
