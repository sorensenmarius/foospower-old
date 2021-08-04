<template>
  <v-row
    v-if="players.length"
    justify="center"
    class="mt-8"
  >
    <v-col
      v-for="component in currentComponents"
      :key="'component' + component"
      cols="12"
      sm="12"
      md="4"
    >
      <component
        :is="component"
        :players="players"
      />
    </v-col>
  </v-row>
</template>

<script>
  import HighestWinrate from './HighestWinrate'
  import LowestWinrate from './LowestWinrate'
  import MostGamesPlayed from './MostGamesPlayed'
  import LongestWinningStreak from './LongestWinningStreak'
  import LongestLosingStreak from './LongestLosingStreak'
  import LongestCurrentWinningStreak from './LongestCurrentWinningStreak'
  import LongestCurrentLosingStreak from './LongestCurrentLosingStreak'
  import MostGoalsScored from './MostGoalsScored'
  import PositionDifference from './PositionDifference'
  import ColorDifference from './ColorDifference'
  import { shuffleArray } from '../../utils/arrayUtils'

  export default {
    components: {
      HighestWinrate,
      LowestWinrate,
      MostGamesPlayed,
      LongestWinningStreak,
      LongestLosingStreak,
      LongestCurrentWinningStreak,
      LongestCurrentLosingStreak,
      MostGoalsScored,
      PositionDifference,
      ColorDifference,
    },
    data () {
      return {
        loading: true,
        componentNames: [
          'highestWinrate',
          'lowestWinrate',
          'mostGamesPlayed',
          'longestWinningStreak',
          'longestLosingStreak',
          'longestCurrentWinningStreak',
          'longestCurrentLosingStreak',
          'mostGoalsScored',
          'positionDifference',
          'colorDifference',
        ],
        currentComponents: [],
      }
    },
    computed: {
      players: function () {
        return this.$store.getters.getAllPlayers.filter(p => p.games.length > 5)
      },
      games: function () {
        return this.$store.getters.getAllGames
      },
    },
    async mounted () {
      await this.getAllPlayers()
      await this.getAllGames()
      this.chooseRandomComponents()
      this.loading = false
    },
    methods: {
      async getAllPlayers () {
        await this.$store.dispatch('getAllPlayersFromApi')
      },
      async getAllGames () {
        await this.$store.dispatch('getAllGamesFromApi')
      },
      chooseRandomComponents () {
        this.currentComponents = shuffleArray(this.componentNames).slice(0, 3)
      },
    },
  }
</script>
