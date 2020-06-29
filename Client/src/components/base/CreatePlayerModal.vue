<template>
  <v-dialog
    v-model="showModal"
    max-width="600px"
    @click:outside="$emit('update:showModal', false)"
  >
    <v-card>
      <v-card-title>Add a player</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name"
        />
        <v-text-field
          v-model="img"
          label="Image link"
        />
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
          @click="addPlayer"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      showModal: Boolean,
    },
    data: function () {
      return {
        name: '',
        img: '',
      }
    },
    methods: {
      addPlayer: function () {
        this.$http.post('player/create', {
          name: this.name,
          avatar: this.img,
        }).then(() => {
          this.$emit('update:showModal', false)
        }).catch((e) => {
          console.error(e)
        })
      },
    },
  }
</script>
