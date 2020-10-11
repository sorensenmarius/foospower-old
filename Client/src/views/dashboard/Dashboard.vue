<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <img
      src="/Foospower.png"
      class="dashboard-logo"
    />
    <role-distributor
      @recordStats="generateGame"
    />
    <random-stat-list />
    <create-game-modal
      :show-modal.sync="showCreateGameModal"
      :update-players="getAllPlayers"
      :generated-game="generatedGame"
    />
    <create-player-modal
      :show-modal.sync="showCreatePlayerModal"
    />
    <div class="create-buttons">
      <v-btn
        fab
        dark
        color="indigo"
        @click="showCreatePlayerModal = true"
      >
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        color="green"
        @click="createNewGame"
      >
        <v-icon>mdi-clipboard-plus-outline</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import CreateGameModal from '../../components/base/CreateGameModal'
  import CreatePlayerModal from '../../components/base/CreatePlayerModal'
  import RandomStatList from '../../components/statCards/RandomStatList'
  import RoleDistributor from './RoleDistributor'

  export default {
    name: 'Home',
    components: {
      CreateGameModal,
      CreatePlayerModal,
      RandomStatList,
      RoleDistributor,
    },
    data () {
      return {
        fab: false,
        showCreateGameModal: false,
        showCreatePlayerModal: false,
        generatedGame: null,
      }
    },
    methods: {
      getAllPlayers () {
        this.$store.dispatch('getAllPlayersFromApi')
      },
      openCreateGameModal () {
        this.getAllPlayers()
        this.showCreateGameModal = true
      },
      generateGame (roles) {
        this.generatedGame = {}
        this.generatedGame.BK = roles.BK._id
        this.generatedGame.WK = roles.WK._id
        this.generatedGame.BJ = roles.BJ._id
        this.generatedGame.WJ = roles.WJ._id
        this.openCreateGameModal()
      },
      createNewGame () {
        this.generatedGame = null
        this.openCreateGameModal()
      },
    },
  }
</script>

<style scoped>
  .create-buttons {
    display: inline-block;
    position: fixed;
    right: 10px;
    bottom: 10px;
  }

  .create-buttons .v-btn {
    margin: 0px 5px;
  }

  .dashboard-logo {
    max-width: min(100%, 300px);
    display: block;
    margin: auto;
  }
</style>
