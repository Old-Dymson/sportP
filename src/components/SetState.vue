<template>
  <div>
    <v-container style="padding-top: unset">
      <v-card class="sticky">
        <v-row style="text-align: center;">
          <v-col style="padding: 12px 8px 0 24px"><v-card style=" border: none" outlined tile>T</v-card></v-col>
          <v-col ><v-card style=" border: none" outlined tile>№</v-card></v-col>
          <v-col ><v-card style=" border: none" outlined tile>C</v-card></v-col>
          <v-col ><v-card style=" border: none" outlined tile>O</v-card></v-col>
          <v-col ><v-card style=" border: none" outlined tile>O</v-card></v-col>
          <v-col ><v-card style=" border: none" outlined tile>C</v-card></v-col>
          <v-col ><v-card style=" border: none" outlined tile>№</v-card></v-col>
          <v-col style="padding: 12px 24px 0 8px"><v-card style=" border: none" outlined tile>T</v-card></v-col>
        </v-row>
      </v-card>
      <v-card>
        <template>
          <v-container class="grey lighten-5" style="text-align: center; padding: 0 8px 0 8px ">
            <v-row style="text-align: center; border: none"
              v-for="el in arrr"
              :key=el.id
              no-gutters
            >
              <v-col><v-card style="min-width: 21px; min-height: 42px; border: none" class="pa-2" outlined
                             tile v-text=el.taH></v-card></v-col>
              <v-col><v-card style="min-width: 21px; min-height: 42px; border: none" class="pa-2" outlined
                             tile v-text=el.numH></v-card></v-col>
              <v-col><v-card style="min-width: 21px; min-height: 42px; border: none" class="pa-2" outlined
                             tile v-text=el.eventH></v-card></v-col>
              <v-col><v-card v-if="el.blockH" style="border: none; min-width: 21px; min-height: 42px"
                             class="pa-2" outlined
                             tile v-text=el.pointH></v-card>
                <v-card v-else style="border: 1px solid #000000; min-width: 21px; min-height: 42px" class="pa-2"
                        outlined tile v-text=el.pointH></v-card></v-col>
              <v-col><v-card v-if="el.blockG" style="border: none; min-width: 21px; min-height: 42px"
                             class="pa-2" outlined
                             tile v-text=el.pointG></v-card>
                <v-card v-else style="border: 1px solid #000000; min-width: 21px; min-height: 42px" class="pa-2"
                        outlined tile v-text=el.pointG></v-card></v-col>
              <v-col><v-card style="min-width: 21px; min-height: 42px; border: none" class="pa-2" outlined
                             tile v-text=el.eventG></v-card></v-col>
              <v-col><v-card style="min-width: 21px; min-height: 42px; border: none" class="pa-2" outlined
                             tile v-text=el.numG></v-card></v-col>
              <v-col><v-card style="min-width: 21px; min-height: 42px; border: none" class="pa-2" outlined
                             tile v-text=el.taG></v-card></v-col>
            </v-row>
          </v-container>
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'SetState',
  computed: {
    arrr () {
      return this.$store.getters.arrr
    }
  }
}
</script>

<style scoped>
  .sticky {
    position: sticky;
    top: 50px;
    z-index: 1;
  }
</style>
