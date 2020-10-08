<template>
  <v-container>
    <v-row
      v-if="loading"
      justify="center"
    >
      <h2>Loading...</h2>
    </v-row>
    <v-row
      v-if="!loading"
      justify="center"
    >
      <base-material-card
        class="player-profile-card mt-15"
        :avatar="player.avatar ? player.avatar : 'https://svgsilh.com/svg_v2/156584.svg'"
      >
        <v-card-text
          class="text-center"
        >
          <h4 class="display-2 font-weight-light black--text">
            {{ player.name }}
          </h4>
          <v-row>
            <v-col
              cols="12"
              sm="4"
              md="2"
            >
              <v-row
                justify="center"
              >
                <h6 class="display-1 grey--text">
                  Winrate
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="display-1 mb-1">
                  {{ getWinPercentage() + '%' }}
                </h6>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="2"
            >
              <v-row
                justify="center"
              >
                <h6 class="display-1 grey--text">
                  Goals Scored
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="display-1 mb-1">
                  {{ goalsScored() }}
                </h6>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="2"
            >
              <v-row
                justify="center"
              >
                <h6 class="display-1 grey--text">
                  Rating
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="display-1 mb-1">
                  {{ player.rating }}
                </h6>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="2"
            >
              <v-row
                justify="center"
              >
                <h6 class="display-1 grey--text">
                  Games Played
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="display-1 mb-1">
                  {{ player.games.length }}
                </h6>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="2"
            >
              <v-row
                justify="center"
              >
                <h6 class="display-1 grey--text">
                  Games Won
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="display-1 mb-1">
                  {{ player.wins }}
                </h6>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="2"
            >
              <v-row
                justify="center"
              >
                <h6 class="display-1 grey--text">
                  Games Lost
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="display-1 mb-1">
                  {{ player.games.length - player.wins }}
                </h6>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </base-material-card>
    </v-row>
    <v-row
      v-if="!loading"
    >
      <v-col>
        <v-row
          justify="center"
        >
          <base-material-chart-card
            class="player-profile-card"
            :data="dailyPlaysChart.data"
            :options="{ ...dailyPlaysChart.options, high: chartMaxValue }"
            color="success"
            hover-reveal
            type="Line"
          >
            <h4 class="card-title font-weight-light mt-2 ml-2">
              Games played per day
            </h4>
          </base-material-chart-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        player: {},
        loading: true,
        dailyPlaysChart: {
          data: {
            series: [
              [0, 0, 0, 0, 0],
            ],
            labels: ['M', 'T', 'W', 'T', 'F'],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 1,
            }),
            low: 0,
            onlyInteger: true,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
      }
    },
    computed: {
      chartMaxValue: function () {
        return Math.max(...this.dailyPlaysChart.data.series[0]) * 1.2
      },
    },
    async mounted () {
      const res = await this.$http.get('/player/get/' + this.$route.params.id)
      this.player = res.data
      this.populateDailyPlaysChart()
      this.loading = false
    },
    methods: {
      getWinPercentage () {
        if (this.player.games.length === 0 || this.player.wins === 0) return 0
        return Math.round(this.player.wins / this.player.games.length * 100)
      },
      populateDailyPlaysChart () {
        this.player.games.forEach(game => {
          const dayNumber = (new Date(game.createdAt).getDay() + 4) % 5
          this.dailyPlaysChart.data.series[0][dayNumber] += 1
        })
      },
      goalsScored () {
        let goals = 0
        this.player.games.forEach(game => {
          if (game.whiteTeam.offense === this.player._id || game.whiteTeam.defense === this.player._id) {
            if (!game.blackWin) {
              goals += 10
            } else {
              goals += game.loserScore
            }
          }

          if (game.blackTeam.offense === this.player._id || game.blackTeam.defense === this.player._id) {
            if (game.blackWin) {
              goals += 10
            } else {
              goals += game.loserScore
            }
          }
        })
        return goals
      },
    },
  }
</script>

<style scoped>
  .player-profile-card {
    width: 90%;
  }
</style>
