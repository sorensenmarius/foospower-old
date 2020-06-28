<template>
  <v-row
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
    computed: {
      players: function () {
        return this.$store.getters.getAllPlayers
      },
      games: function () {
        return this.$store.getters.getAllGames
      },
    },
    mounted () {
      this.getAllPlayers()
      this.getAllGames()
    },
    methods: {
      getAllPlayers () {
        this.$store.dispatch('getAllPlayersFromApi')
      },
      getAllGames () {
        this.$store.dispatch('getAllGamesFromApi')
      },
    },
  }
</script>
