<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row
          v-if="nullinger.length > 0"
          justify="center"
        >
          <h2>Siste nullinger</h2>
        </v-row>
        <v-row>
          <v-col
            v-for="(game, index) in nullinger"
            :key="'n-' + index"
            cols="12"
            sm="12"
            lg="4"
          >
            <base-material-card
              class="v-card-profile"
              title="testsetst"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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
          >
            <td>{{ getWinnerTeam(g) }}</td>
            <td>{{ getLoserTeam(g) }}</td>
            <td>{{ '10 - ' + g.loserScore }}</td>
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
          return game.blackTeam.offense.name + ' & ' + game.blackTeam.defense.name
        }
        return game.whiteTeam.offense.name + ' & ' + game.whiteTeam.defense.name
      },
      getLoserTeam (game) {
        if (!game.blackWin) {
          return game.blackTeam.offense.name + ' & ' + game.blackTeam.defense.name
        }
        return game.whiteTeam.offense.name + ' & ' + game.whiteTeam.defense.name
      },
      getTime (game) {
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }
        const d = new Date(game.createdAt)
        return d.toLocaleTimeString([], { timeStyle: 'short' }) + ' - ' + d.toLocaleString('nb-NO', options)
      },
      openEditModal (game) {
        this.editGame = game
        this.showCreateGameModal = true
      },
    },
  }
</script>
