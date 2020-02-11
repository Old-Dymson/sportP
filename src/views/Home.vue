<template>
  <div class="home">
    <v-container>
      <v-layout>
        <v-flex>
          <v-form>
            <v-select
              v-model="select1"
              :items="items1"
              label="Клуб"
              required
            ></v-select>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  }
}
</script>
