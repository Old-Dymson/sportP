import Vue from 'vue'
import Vuex from 'vuex'

export default {
  data: () => ({
    hostIp: 'http://localhost:8000/',
    // GET
    urlMatches: 'matches',
    urlPlayers: 'players',
    urlMatchesId: 'analyst/matches/{id}',
    // PUT
    urlPutMatchesId: 'analyst/matches/{id}',
    urlPutMatchIdEvent: 'analyst/matches/{id}/events'
  })
}
