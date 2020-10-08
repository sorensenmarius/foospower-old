<template>
  <v-row justify="center">
    <v-dialog
      v-model="showModal"
      max-width="600px"
      @click:outside="$emit('update:showModal', false)"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ editGame ? 'Edit game' : 'Add a game' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              justify="space-between"
            >
              <v-col
                cols="12"
                sm="5"
                class="input-col"
              >
                <v-autocomplete
                  v-model="WJ"
                  label="WJ (3)"
                  :items="allPlayers"
                  item-text="name"
                  item-value="_id"
                  required
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                sm="5"
                class="input-col black-team"
              >
                <v-autocomplete
                  v-model="BK"
                  label="BK (2)"
                  :items="allPlayers"
                  item-text="name"
                  item-value="_id"
                  required
                  outlined
                />
              </v-col>
            </v-row>
            <v-row
              justify="space-between"
            >
              <v-col
                cols="12"
                sm="5"
                class="input-col"
              >
                <v-autocomplete
                  v-model="WK"
                  label="WK (1)"
                  :items="allPlayers"
                  item-text="name"
                  item-value="_id"
                  required
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                sm="5"
                class="input-col black-team"
              >
                <v-autocomplete
                  v-model="BJ"
                  label="BJ (4)"
                  :items="allPlayers"
                  item-text="name"
                  item-value="_id"
                  required
                  outlined
                />
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <h3>Winner</h3>
            </v-row>
            <v-row justify="space-around">
              <span class="switcher switcher-1">
                <input
                  id="switcher-1"
                  v-model="whiteWin"
                  type="checkbox"
                >
                <label for="switcher-1" />
              </span>
            </v-row>
            <v-row justify="space-between">
              <v-col sm="4">
                <v-text-field
                  :value="!whiteWin ? loserScore : 10"
                  :disabled="whiteWin"
                  type="number"
                  solo
                  @input="loserScore = $event"
                />
              </v-col>
              <v-col class="center-content">
                <h4 class="score-header">
                  Score
                </h4>
              </v-col>
              <v-col sm="4">
                <v-text-field
                  :value="whiteWin ? loserScore : 10"
                  :disabled="!whiteWin"
                  type="number"
                  solo
                  @input="loserScore = $event"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="$emit('update:showModal', false)"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addGame"
            :disabled="sendingGame"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="gameSentNotification"
      timeout="2000"
    >
      Game has been saved!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="gameSentNotification = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
  export default {
    props: {
      showModal: Boolean,
      editGame: {
        type: Object,
        default: () => (null),
      },
      generatedGame: {
        type: Object,
        default: () => (null),
      },
    },
    data: function () {
      return {
        BK: '',
        WK: '',
        BJ: '',
        WJ: '',
        whiteWin: true,
        loserScore: 0,
        gameSentNotification: false,
        sendingGame: false,
      }
    },
    computed: {
      allPlayers: function () {
        return this.$store.getters.getAllPlayers
      },
      chosenPlayers: function () {
        return [this.WK, this.BK, this.WJ, this.BJ]
      },
    },
    watch: {
      editGame: function () {
        this.setEditGame()
      },
      generatedGame: {
        handler: function () { this.setEditGame() },
        deep: true,
      },
    },
    methods: {
      addGame: async function () {
        this.$emit('update:showModal', false)
        this.sendingGame = true
        if (this.editGame) {
          await this.$http.post('game/edit', {
            id: this.editGame._id,
            players: this.chosenPlayers,
            loserScore: this.loserScore,
            blackWin: !this.whiteWin,
          })
        } else {
          await this.$http.post('game/create', {
            players: this.chosenPlayers,
            loserScore: this.loserScore,
            blackWin: !this.whiteWin, // Retarded because it had to be changed after deployment
          })
        }
        this.sendingGame = false
        await this.$store.dispatch('getAllPlayersFromApi')
        await this.$store.dispatch('getAllGamesFromApi')
        this.gameSentNotification = true
      },
      setEditGame: function () {
        if (this.editGame) {
          this.BK = this.editGame.blackTeam.offense._id
          this.WK = this.editGame.whiteTeam.offense._id
          this.BJ = this.editGame.blackTeam.defense._id
          this.WJ = this.editGame.whiteTeam.defense._id
          this.whiteWin = !this.editGame.blackWin
          this.loserScore = this.editGame.loserScore
        } else if (this.generatedGame) {
          this.BK = this.generatedGame.BK
          this.WK = this.generatedGame.WK
          this.BJ = this.generatedGame.BJ
          this.WJ = this.generatedGame.WJ
          this.loserScore = 0
          this.whiteWin = true
        } else {
          this.BK = ''
          this.WK = ''
          this.BJ = ''
          this.WJ = ''
          this.whiteWin = true
          this.loserScore = 0
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  $black:#1E1E1E;
  $grey:#CCCCCC;
  $white:#FFFFFF;
  .center-content {
    text-align: center;
  }

  .score-header {
    margin-top: 10px;
  }

body {
   span.switcher {
      position: relative;
      width:200px;
      height:50px;
      border-radius:25px;
      margin:20px 0;

      input {
         appearance: none;
         position: relative;
         width:200px;
         height:50px;
         border-radius:25px;
         background-color:$white;
         outline:none;
         font-family: 'Oswald', sans-serif;
         border: 1px black solid;

         &:before, &:after {
            z-index:2;
            position: absolute;
            top:50%;
            transform:translateY(-50%);
            color:$black;
         }
         &:before {
            content: 'WHITE';
            left:20px;
         }
         &:after {
            content: 'BLACK';
            right:20px;
         }
      }
      label {
         z-index:1;
         position: absolute;
         bottom:11px;
         height: 30px;
         border-radius:20px;
      }
      &.switcher-1 {
         input {
            transition:.25s .1s;
            &:checked {
               background-color:$black;
               &:before {
                  color:$black;
                  transition: color .5s .2s;
               }
               &:after {
                  color:$grey;
                  transition: color .5s;
               }
               &+label {
                  left:10px;
                  right:100px;

                  background:$white;
                  transition: left .5s, right .4s .2s;
               }
            }
            &:not(:checked) {
               background: $white;
               transition: background .5s .1s;
               &:before {
                  color:$grey;
                  transition: color .5s;
               }
               &:after {
                  color:$white;
                  transition: color .5s .2s;
               }
               &+label {
                  left:100px;
                  right:10px;
                  background:$black;
                  transition: left .4s .2s, right .5s, background .35s -.1s;
               }
            }
         }
      }
    }
  }

@media only screen and (max-width: 600px) {
  .input-col {
    max-width: 80%;
  }

  .black-team {
    margin-left: 20%;
  }
}
</style>
