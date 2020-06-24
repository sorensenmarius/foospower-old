<template>
  <v-dialog
    v-model="showModal"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>Add a player</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name"
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
      }
    },
    methods: {
      addPlayer: function () {
        this.$http.post('player/create', {
          name: name,
        })
      },
    },
  }
</script>
