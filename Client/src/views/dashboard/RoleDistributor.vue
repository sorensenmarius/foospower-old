<template>
  <v-container
    fluid
    class="pa-0"
  >
    <div
      v-if="choosing"
    >
      <h2 style="text-align: center">
        Choose players
      </h2>
      <v-row dense>
        <v-col
          v-for="p in players"
          :key="'checkbox-' + p._id"
          cols="4"
          md="2"
        >
          <v-chip
            label
            :color="isChosen(p) ? 'success' : isLocked(p) ? 'red' : 'indigo'"
            class="choose-players-chip"
            text-color="white"
            @click="() => handleChipClick(p)"
          >
            <v-avatar left>
              <img
                :src="p.avatar ? p.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
              >
            </v-avatar>
            <span class="choose-players-chip-text">{{ p.name }}</span>
          </v-chip>
        </v-col>
      </v-row>
      <v-row
        justify="center"
      >
        <v-btn
          color="success"
          class="ma-0 mt-2"
          :disabled="chosenPlayers.length + lockedPlayers.length < 4"
          @click="shufflePlayers()"
        >
          Start Game
        </v-btn>
      </v-row>
    </div>
    <div
      v-else
    >
      <v-row>
        <v-col
          cols="6"
          class="pa-1"
        >
          <h2
            style="text-align: center"
          >
            + {{ calculateRatingDelta('white') }}
          </h2>
        </v-col>
        <v-col
          cols="6"
          class="pa-1"
        >
          <h2
            style="text-align: center"
          >
            + {{ calculateRatingDelta('black') }}
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
          class="pa-1"
        >
          <v-chip
            label
            color="indigo"
            class="chosen-players-chip"
            text-color="white"
          >
            <v-avatar left>
              <img
                :src="roles.WJ.avatar ? roles.WJ.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
              >
            </v-avatar>
            <span class="choose-players-chip-text">{{ roles.WJ.name }}</span>
          </v-chip>
          <span
            class="ml-3 chosen-role"
          >
            WJ
          </span>
        </v-col>
        <v-col
          cols="6"
          class="pa-1"
        >
          <v-chip
            label
            color="indigo"
            class="chosen-players-chip float-right"
            text-color="white"
          >
            <v-avatar left>
              <img
                :src="roles.BK.avatar ? roles.BK.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
              >
            </v-avatar>
            <span class="choose-players-chip-text">{{ roles.BK.name }}</span>
          </v-chip>
          <span
            class="mr-3 chosen-role float-right"
          >
            BK
          </span>
        </v-col>
      </v-row>
      <v-row
        class="mt-5"
      >
        <v-col
          cols="6"
          class="pa-1"
        >
          <v-chip
            label
            color="indigo"
            class="chosen-players-chip"
            text-color="white"
          >
            <v-avatar left>
              <img
                :src="roles.WK.avatar ? roles.WK.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
              >
            </v-avatar>
            <span class="choose-players-chip-text">{{ roles.WK.name }}</span>
          </v-chip>
          <span
            class="ml-3 chosen-role"
          >
            WK
          </span>
        </v-col>
        <v-col
          cols="6"
          class="pa-1"
        >
          <v-chip
            label
            color="indigo"
            class="chosen-players-chip float-right"
            text-color="white"
          >
            <v-avatar left>
              <img
                :src="roles.BJ.avatar ? roles.BJ.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
              >
            </v-avatar>
            <span class="choose-players-chip-text">{{ roles.BJ.name }}</span>
          </v-chip>
          <span
            class="mr-3 chosen-role float-right"
          >
            BJ
          </span>
        </v-col>
      </v-row>
      <v-row
        v-if="chosenPlayers.length"
      >
        <v-col>
          <v-row
            justify="center"
          >
            <span class="chosen-role mt-5">Out:</span>
          </v-row>
          <v-row
            justify="space-around"
          >
            <v-col
              v-for="p in chosenPlayers"
              :key="'outPlayer'+p._id"
              cols="4"
            >
              <v-chip
                label
                color="indigo"
                style="width: 100%"
                text-color="white"
              >
                <v-avatar left>
                  <img
                    :src="p.avatar ? p.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
                  >
                </v-avatar>
                <span class="choose-players-chip-text">{{ p.name }}</span>
              </v-chip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        justify="center"
      >
        <v-btn
          color="primary"
          @click="recordStats"
        >
          Record stats
        </v-btn>
        <v-btn
          color="indigo"
          class="ma-0"
          @click="choosing = true"
        >
          New Game
        </v-btn>
      </v-row>
    </div>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        chosenPlayers: [],
        lockedPlayers: [],
        choosing: true,
        roles: {
          WK: {},
          BK: {},
          WJ: {},
          BJ: {},
        },
      }
    },
    computed: {
      players: function () {
        const players = this.$store.getters.getAllPlayers
        return players.sort((a, b) => (a.games.length > b.games.length ? -1 : 1))
      },
      whiteRating: function () {
        if (this.roles.WK && this.roles.WJ) {
          return (this.roles.WK.rating + this.roles.WJ.rating) / 2
        }
        return null
      },
      blackRating: function () {
        if (this.roles.WK && this.roles.WJ) {
          return (this.roles.BK.rating + this.roles.BJ.rating) / 2
        }
        return null
      },
    },
    methods: {
      handleChipClick: function (player) {
        if (this.isLocked(player)) {
          this.lockedPlayers.splice(this.chosenPlayers.findIndex(p => p._id === player._id), 1)
        } else if (this.isChosen(player)) {
          if (this.lockedPlayers.length < 4) {
            this.lockedPlayers.push(player)
          }
          this.chosenPlayers.splice(this.chosenPlayers.findIndex(p => p._id === player._id), 1)
        } else {
          this.chosenPlayers.push(player)
        }
      },
      isChosen: function (player) {
        return this.chosenPlayers.find(p => p._id === player._id)
      },
      isLocked: function (player) {
        return this.lockedPlayers.find(p => p._id === player._id)
      },
      shufflePlayers: function () {
        const r = ['WK', 'BK', 'WJ', 'BJ']
        for (var i = r.length - 1; i > 0; i--) {
          var rand = Math.floor(Math.random() * (i + 1));
          [r[i], r[rand]] = [r[rand], r[i]]
        }
        for (const role of r) {
          if (this.lockedPlayers.length) {
            const i = Math.floor(Math.random() * this.lockedPlayers.length)
            this.roles[role] = this.lockedPlayers[i]
            this.lockedPlayers.splice(i, 1)
          } else {
            const i = Math.floor(Math.random() * this.chosenPlayers.length)
            this.roles[role] = this.chosenPlayers[i]
            this.chosenPlayers.splice(i, 1)
          }
        }
        this.choosing = false
      },
      recordStats: function () {
        this.$emit('recordStats', this.roles)
      },
      calculateRatingDelta: function (team) {
        let chanceToWin = 0
        if (team === 'white') {
          chanceToWin = 1 / (1 + Math.pow(10, (this.blackRating - this.whiteRating) / 400))
        } else {
          chanceToWin = 1 / (1 + Math.pow(10, (this.whiteRating - this.blackRating) / 400))
        }

        return Math.round(64 * (1 - chanceToWin))
      },
    },
  }
</script>

<style scoped>
  .choose-players-chip {
    width: 100%;
  }
  .chosen-players-chip {
    width: 75%;
  }
  .choose-players-chip-text {
    font-size: 12px;
  }
  .chosen-role {
    line-height: 32px;
    font-weight: bold;
  }
</style>
