<template>
  <v-container>
    <base-material-card
      title="All games"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th
              v-for="(th, index) in tableHeaders"
              :key="'th-' + index"
              class="primary--text"
            >
              {{ th }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(g, index) in games"
            :key="'td-' + index"
            :class="g.loserScore === 0 ? 'nulling' : ''"
          >
            <td class="nullingWinner">
              {{ getWinnerTeam(g) }}
            </td>
            <td class="nullingLoser">
              {{ getLoserTeam(g) }}
            </td>
            <td>10 - {{ g.loserScore }}</td>
            <td>{{ getTime(g) }}</td>
            <td>
              <v-btn
                color="success"
                icon
                @click="openEditModal(g)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <h2
      style="text-align: center"
      v-if="games.length >= 49"
    >
      Only showing last 50 games.
    </h2>
    <create-game-modal
      :show-modal.sync="showCreateGameModal"
      :edit-game="editGame"
    />
  </v-container>
</template>

<script>
  import CreateGameModal from '../../components/base/CreateGameModal'
  export default {
    name: 'Games',
    components: {
      CreateGameModal,
    },
    data () {
      return {
        tableHeaders: ['Winners', 'Losers', 'Score', 'Time', ''],
        showCreateGameModal: false,
        editGame: null,
      }
    },
    computed: {
      games: function () {
        return this.$store.getters.getAllGames.slice().reverse()
      },
      nullinger: function () {
        return this.games.filter(g => g.loserScore === 0).slice(0, 3)
      },
    },
    mounted () {
      this.getAllGames()
    },
    methods: {
      getAllGames () {
        this.$store.dispatch('getAllGamesFromApi')
      },
      getWinPercentage (player) {
        if (player.games.length === 0 || player.wins === 0) return 0
        return player.wins / player.games.length * 100
      },
      getWinnerTeam (game) {
        if (game.blackWin) {
          return game.blackTeam.offense.name + ' & ' + game.blackTeam.defense.name + ' (B)'
        }
        return game.whiteTeam.offense.name + ' & ' + game.whiteTeam.defense.name + ' (W)'
      },
      getLoserTeam (game) {
        if (!game.blackWin) {
          return game.blackTeam.offense.name + ' & ' + game.blackTeam.defense.name + ' (B)'
        }
        return game.whiteTeam.offense.name + ' & ' + game.whiteTeam.defense.name + ' (W)'
      },
      getTime (game) {
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }
        const d = new Date(game.createdAt)
        return d.toLocaleTimeString([], { timeStyle: 'short' }) + ' - ' + d.toLocaleString('nb-NO', options)
      },
      async openEditModal (game) {
        await this.$store.dispatch('getAllPlayersFromApi')
        this.editGame = game
        this.showCreateGameModal = true
      },
    },
  }
</script>

<style scoped>
  .nulling td {
    font-weight: bold !important;
  }

  .nulling td.nullingLoser {
    color: red;
  }

  .nulling td.nullingWinner {
    color: #4CAF50;
  }
</style>
