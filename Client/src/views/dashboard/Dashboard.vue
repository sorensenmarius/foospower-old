<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row
      v-show="!rolling"
      justify="center"
    >
      <v-col>
        <v-row
          justify="center"
        >
          <h2>How many people are playing?</h2>
        </v-row>
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
            sm="4"
            md="3"
            lg="2"
          >
            <v-row>
              <v-text-field
                v-model="numberOfPlayers"
                class="centered-input"
                type="number"
                solo
              />
            </v-row>
            <v-row
              justify="center"
            >
              <v-btn
                color="green"
                @click="createNumberSequence"
              >
                Roll
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      v-show="rolling"
      justify="center"
    >
      <v-col>
        <v-row
          justify="center"
        >
          <h3>Count from the person on your {{ direction }}</h3>
        </v-row>
        <v-row
          justify="center"
        >
          <v-col
            v-for="num in sequence"
            :key="num"
            :cols="sequence.length"
            sm="1"
            class="centered-text"
          >
            <h2>{{ num }}</h2>
          </v-col>
        </v-row>
        <v-row
          justify="center"
        >
          <v-btn
            color="green"
            @click="createNumberSequence"
          >
            Re-roll
          </v-btn>
          <v-btn
            color="green"
            @click="rolling = false"
          >
            New roll
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
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

  export default {
    name: 'Home',
    components: {
      CreateGameModal,
      CreatePlayerModal,
    },
    data () {
      return {
        fab: false,
        showCreateGameModal: false,
        showCreatePlayerModal: false,
        numberOfPlayers: 4,
        rolling: false,
        sequence: [],
        direction: 'right',
      }
    },
    mounted () {
      this.getAllPlayers()
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
      getAllPlayers () {
        this.$store.dispatch('getAllPlayersFromApi')
      },
      openCreateGameModal () {
        this.getAllPlayers()
        this.showCreateGameModal = true
      },
      shuffleArray (array) {
        const newArray = []
        let index = 0
        while (array.length > 0) {
          index = Math.floor(Math.random() * array.length)
          newArray.push(array[index])
          array.splice(index, 1)
        }
        return newArray
      },
      createNumberSequence () {
        this.sequence = []
        for (let i = 1; i <= this.numberOfPlayers; i++) {
          this.sequence.push(i)
        }
        this.sequence = this.shuffleArray(this.sequence)
        this.direction = Math.random() > 0.5 ? 'right' : 'left'
        this.rolling = true
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
  .v-input__slot {
    height: 41px;
  }
  .centered-input >>> input, .centered-text{
    text-align: center;
  }
</style>
