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
          <h4 class="text-h3 font-weight-light black--text">
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
                <h6 class="text-h4 grey--text">
                  Winrate
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="text-h4 mb-1">
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
                <h6 class="text-h4 grey--text">
                  Goals Scored
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="text-h4 mb-1">
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
                <h6 class="text-h4 grey--text">
                  Rating
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="text-h4 mb-1">
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
                <h6 class="text-h4 grey--text">
                  Games Played
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="text-h4 mb-1">
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
                <h6 class="text-h4 grey--text">
                  Games Won
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="text-h4 mb-1">
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
                <h6 class="text-h4 grey--text">
                  Games Lost
                </h6>
              </v-row>
              <v-row
                justify="center"
              >
                <h6 class="text-h4 mb-1">
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
            :data="ratingChart.data"
            :options="{ ...ratingChart.options, low: charMinValue, high: chartMaxValue}"
            color="success"
            hover-reveal
            type="Line"
          >
            <h4 class="card-title font-weight-light mt-2 ml-2">
              Rating
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
        ratingChart: {
          data: {
            series: [
              [0, 0, 0, 0, 0],
            ],
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
        return Math.max(...this.ratingChart.data.series[0]) * 1.2
      },
      charMinValue: function () {
        return Math.min(...this.ratingChart.data.series[0]) * 0.8
      },
    },
    async mounted () {
      const res = await this.$http.get('/player/get/' + this.$route.params.id)
      this.player = res.data
      this.populateRatingChart()
      this.loading = false
    },
    methods: {
      getWinPercentage () {
        if (this.player.games.length === 0 || this.player.wins === 0) return 0
        return Math.round(this.player.wins / this.player.games.length * 100)
      },
      populateRatingChart () {
        this.ratingChart.data.series[0] = this.player.ratings
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
