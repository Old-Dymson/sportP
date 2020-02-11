import * as fb from 'firebase'
// import axios from 'axios'

// class Home {
//   constructor (id = '', name = '', shortName = '', imageUrl = '', logoUrl = '', groupName = '', players = null) {
//     this.id = id
//     this.name = name
//     this.shortName = shortName
//     this.imageUrl = imageUrl
//     this.logoUrl = logoUrl
//     this.groupName = groupName
//     this.players = players
//   }
// }
// class Away {
//   constructor (id = '', name = '', shortName = '', imageUrl = '', logoUrl = '', groupName = '', players = null) {
//     this.id = id
//     this.name = name
//     this.shortName = shortName
//     this.imageUrl = imageUrl
//     this.logoUrl = logoUrl
//     this.groupName = groupName
//     this.players = players
//   }
// }
// class Set {
//   constructor (id = '', homePointsWon = '', awayPointsWon = '', homeTimeouts = '', awayTimeouts = '', homeStat = null,
//     awayStat = null) {
//     this.id = id
//     this.homePointsWon = homePointsWon
//     this.awayPointsWon = awayPointsWon
//     this.homeTimeouts = homeTimeouts
//     this.awayTimeouts = awayTimeouts
//     this.homeStat = homeStat
//     this.awayStat = awayStat
//   }
// }
// class Mathes {
//   constructor (
//     id = '', duration = '3', setDuration = '15', status = 'notStarted', stage = 'group',
//     home = new Home(), away = new Away(),
//     homeSetWon = '',
//     awaySetWon = '',
//     homeStat = null,
//     awayStat = null,
//     Sets = [new Set(), new Set(), new Set()]) {
//     this.id = id
//     this.duration = duration
//     this.setDuration = setDuration
//     this.status = status
//     this.stage = stage
//     this.home = home
//     this.away = away
//     this.homeSetWon = homeSetWon
//     this.awaySetWon = awaySetWon
//     this.homeStat = homeStat
//     this.awayStat = awayStat
//     this.Sets = Sets
//   }
// }
// class AdEvent {
//   constructor (timeout = 'N', setId = 0, winner = null, type, playerId = 0, pointId = 0) {
//     this.timeout = timeout
//     this.setId = setId
//     this.winner = winner
//     this.type = type
//     this.playerId = playerId
//     this.pointId = pointId
//   }
// }

export default {
  state: {
    setSt: [],
    arrr: [],
    games: [],
    players: []
  },
  getters: {
    setSt (state) {
      return state.setSt
    },
    players (state) {
      return state.players
    },
    games (state) {
      return state.games
    },
    arrr (state) {
      return state.arrr
    }
  },
  mutations: {
    createStat (state, payload) {
      state.setSt.push(payload)
    },
    loadState (state, payload) {
      state.setSt = payload
    },
    loadPlayers (state, payload) {
      state.players = payload
    },
    loadMatches (state, payload) {
      state.games = payload
    },
    createArrr (state, payload) {
      state.arrr.push(payload)
    },
    updateArrr (state, payload) {
      let ad = state.arrr[state.arrr.length - 1]
      ad.taG = payload.taG
      ad.taH = payload.taH
    },
    updateStat (state, payload) {
      let ad = state.setSt[state.setSt.length - 1]
      ad.homeTimeout = payload.homeTimeout
      ad.awayTimeout = payload.awayTimeout
    },
    loadArrr (state, payload) {
      state.arrr = payload
    }
  },
  actions: {
    async fetchMatches ({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const resultAds = []
        const fbVal = await fb.database().ref('games').once('value')
        const adc = fbVal.val()
        Object.keys(adc).forEach(key => {
          if (adc[key].status !== 'finished') {
            resultAds.push(adc[key])
          }
        })
        commit('loadMatches', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async createStat ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newAd = {
          id: '',
          gameId: payload.gameId,
          setId: payload.setId,
          pointId: payload.pointId,
          homePoint: payload.homePoint,
          awayPoint: payload.awayPoint,
          homeTimeout: 0,
          awayTimeout: 0,
          teamId: payload.teamId,
          playerId: payload.playerId,
          type: payload.type
        }
        const ad = await fb.database().ref(`statistic/${localStorage.getItem('gameId')}`).push(newAd)
        await fb.database().ref(`statistic/${localStorage.getItem('gameId')}`).child(ad.key).update({
          id: ad.key
        })
        commit('createStat', {
          ...newAd,
          id: ad.key
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchStat ({ commit }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const resultAds = []
        const fbVal = await fb.database().ref(`statistic/${localStorage.getItem('gameId')}`).once('value')
        const adc = fbVal.val()
        Object.keys(adc).forEach(key => {
          resultAds.push(adc[key])
        })
        commit('loadState', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateStat ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.database().ref(`statistic/${localStorage.getItem('gameId')}`).child(payload.id).update({
          homeTimeout: payload.homeTimeout,
          awayTimeout: payload.awayTimeout
        })
        commit('updateStat', {
          homeTimeout: payload.homeTimeout,
          awayTimeout: payload.awayTimeout
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    createArrr ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      commit('createArrr', payload)
      commit('setLoading', false)
    },
    updateArrr ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      commit('updateArrr', payload)
      commit('setLoading', false)
    },
    async fetchPlayers ({ commit }, pl) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const resultAds = []
        const fbVal = await fb.database().ref('player').once('value')
        const adc = fbVal.val()
        Object.keys(adc).forEach(key => {
          resultAds.push(adc[key])
        })
        commit('loadPlayers', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateMatch ({ commit }, payload) {
      commit('clearError')
      try {
        await fb.database().ref('games').child(payload.id).update({
          status: payload.status,
          homeSetsWon: payload.homeSetsWon,
          awaySetsWon: payload.awaySetsWon
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    }
  }
}
