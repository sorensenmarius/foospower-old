<template>
  <v-row
    v-if="!loading"
    justify="center"
  >
    <v-col>
      <highest-winrate
        :players="players"
      />
    </v-col>
    <v-col>
      <lowest-winrate
        :players="players"
      />
    </v-col>
    <v-col>
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
