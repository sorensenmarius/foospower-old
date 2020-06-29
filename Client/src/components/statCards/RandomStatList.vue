<template>
  <v-row
    v-if="!loading"
    justify="center"
  >
    <v-col
      cols="12"
      sm="12"
      md="4"
    >
      <highest-winrate
        :players="players"
      />
    </v-col>
    <v-col
      cols="12"
      sm="12"
      md="4"
    >
      <lowest-winrate
        :players="players"
      />
    </v-col>
    <v-col
      cols="12"
      sm="12"
      md="4"
    >
      <most-games-played
        :players="players"
      />
    </v-col>
  </v-row>
</template>

<script>
  import HighestWinrate from './HighestWinrate'
  import LowestWinrate from './LowestWinrate'
  import MostGamesPlayed from './MostGamesPlayed'

  export default {
    components: {
      HighestWinrate,
      LowestWinrate,
      MostGamesPlayed,
    },
    data () {
      return {
        loading: true,
      }
    },
    computed: {
      players: function () {
        return this.$store.getters.getAllPlayers
      },
      games: function () {
        return this.$store.getters.getAllGames
      },
    },
    async mounted () {
      await this.getAllPlayers()
      await this.getAllGames()
      this.loading = false
    },
    methods: {
      async getAllPlayers () {
        await this.$store.dispatch('getAllPlayersFromApi')
      },
      async getAllGames () {
        await this.$store.dispatch('getAllGamesFromApi')
      },
    },
  }
</script>
