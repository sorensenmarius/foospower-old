<template>
  <v-main>
    <v-btn
      v-if="$vuetify.breakpoint.mdAndDown"
      class="ml-3 mt-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="drawer">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>
    <router-view />
  </v-main>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'DashboardCoreView',
    components: {
    },
    computed: {
      ...mapState(['drawer']),
    },
    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
    },
  }
</script>
