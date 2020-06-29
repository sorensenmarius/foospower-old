<template>
  <v-col>
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
          <h3 style="text-align: center">
            Count {{ direction }} from the person on your {{ starting }}
          </h3>
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
            <h2>{{ getRole(num) }}</h2>
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
  </v-col>
</template>

<script>
  export default {
    data () {
      return {
        numberOfPlayers: 4,
        rolling: false,
        sequence: [],
        direction: 'clockwise',
        starting: 'right',
      }
    },
    methods: {
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
        this.direction = Math.random() > 0.5 ? 'counter-clockwise' : 'clockwise'
        this.starting = Math.random() > 0.5 ? 'left' : 'right'
        this.rolling = true
      },
      getRole (num) {
        if (num > 4) return 'Out'
        switch (num) {
          case (1):
            return 'WK'
          case (2):
            return 'BK'
          case (3):
            return 'WJ'
          case (4):
            return 'BJ'
        }
      },
    },
  }
</script>

<style scoped>
  .centered-input >>> input, .centered-text{
    text-align: center;
  }
</style>
