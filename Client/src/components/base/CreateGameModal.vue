<template>
  <v-row justify="center">
    <v-dialog
      v-model="showModal"
      max-width="600px"
      @click:outside="$emit('update:showModal', false)"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Add a game</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              justify="space-between"
            >
              <v-col
                cols="12"
                sm="5"
              >
                <v-autocomplete
                  v-model="BJ"
                  label="BJ (3)"
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
              >
                <v-autocomplete
                  v-model="WK"
                  label="WK (2)"
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
              >
                <v-autocomplete
                  v-model="BK"
                  label="BK (1)"
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
              >
                <v-autocomplete
                  v-model="WJ"
                  label="WJ (4)"
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
                  v-model="blackWin"
                  type="checkbox"
                >
                <label for="switcher-1" />
              </span>
            </v-row>
            <v-row justify="space-between">
              <v-col sm="4">
                <v-text-field
                  :value="!blackWin ? loserScore : 10"
                  :disabled="blackWin"
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
                  :value="blackWin ? loserScore : 10"
                  :disabled="!blackWin"
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
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: {
      showModal: Boolean,
    },
    data: function () {
      return {
        BK: '',
        WK: '',
        BJ: '',
        WJ: '',
        blackWin: true,
        loserScore: 0,
      }
    },
    computed: {
      allPlayers: function () {
        return this.$store.getters.getAllPlayers
      },
      chosenPlayers: function () {
        return [this.BK, this.WK, this.BJ, this.WJ]
      },
    },
    methods: {
      addGame: function () {
        this.$http.post('game/create', {
          players: this.chosenPlayers,
          loserScore: this.loserScore,
          blackWin: this.blackWin,
        })
        this.showModal = false
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
         background-color:$black;
         outline:none;
         font-family: 'Oswald', sans-serif;
         border: 1px black solid;

         &:before, &:after {
            z-index:2;
            position: absolute;
            top:50%;
            transform:translateY(-50%);
            color:$white;
         }
         &:before {
            content: 'BLACK';
            left:20px;
         }
         &:after {
            content: 'WHITE';
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
            transition:.25s -.1s;
            &:checked {
               background-color:$white;
               &:before {
                  color:$white;
                  transition: color .5s .2s;
               }
               &:after {
                  color:$grey;
                  transition: color .5s;
               }
               &+label {
                  left:10px;
                  right:100px;

                  background:$black;
                  transition: left .5s, right .4s .2s;
               }
            }
            &:not(:checked) {
               background:$black;
               transition: background .5s -.1s;
               &:before {
                  color:$grey;
                  transition: color .5s;
               }
               &:after {
                  color:$black;
                  transition: color .5s .2s;
               }
               &+label {
                  left:100px;
                  right:10px;
                  background:$white;
                  transition: left .4s .2s, right .5s, background .35s -.1s;
               }
            }
         }
      }
    }
  }
</style>
