<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <!-- <sequence-generator /> -->
    <role-distributor />
    <random-stat-list />
    <create-game-modal
      :show-modal.sync="showCreateGameModal"
      :update-players="getAllPlayers"
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
        @click="openCreateGameModal"
      >
        <v-icon>mdi-clipboard-plus-outline</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import CreateGameModal from '../../components/base/CreateGameModal'
  import CreatePlayerModal from '../../components/base/CreatePlayerModal'
  // import SequenceGenerator from './SequenceGenerator'
  import RandomStatList from '../../components/statCards/RandomStatList'
  import RoleDistributor from './RoleDistributor'

  export default {
    name: 'Home',
    components: {
      CreateGameModal,
      CreatePlayerModal,
      // SequenceGenerator,
      RandomStatList,
      RoleDistributor,
    },
    data () {
      return {
        fab: false,
        showCreateGameModal: false,
        showCreatePlayerModal: false,
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
</style>
