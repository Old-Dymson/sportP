<template>
  <v-app>
    <div>
    <v-app-bar style="background-color: DarkTurquoise"
      app
      color="SkyBlue"
      dark
    >
      <v-app-bar-nav-icon
        @click="start"
      ></v-app-bar-nav-icon>
      <h2>{{homeTeamName}}</h2>
      <v-spacer></v-spacer>
      <v-card>Сет</v-card>
      <v-card>| {{setH}}/{{setG}} |</v-card>
      <v-spacer></v-spacer>
      <v-card>| {{PoH}} : {{PoG}} |</v-card>
      <v-spacer></v-spacer>
      <h2>{{awayTeamName}}</h2>
    </v-app-bar>
    </div>
    <v-content style="margin-top: 0; padding-top: 50px">
      <app-stat></app-stat>
    </v-content>
    <template v-if="alert">
      <v-snackbar
        :timeout="5000"
        :multi-line="true"
        color="green"
        @input="closeError"
        :value="true"
      >
        {{messagesG}}
        <v-btn large dark @click.native="closeError">OK</v-btn>
      </v-snackbar>
    </template>
    <template v-if="error">
      <v-snackbar
        :timeout="5000"
        :multi-line="true"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{error}}
        <v-btn large dark @click.native="closeError">Закрыть</v-btn>
      </v-snackbar>
    </template>
    <v-dialog v-model="dialogSt" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select
              v-model="select2"
              :items="itemsGames"
              label="Игры"
              required
            ></v-select>
            <p>{{ mess1 }}</p>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="saveSt">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select
              v-model="select"
              v-on:change="onChange"
              :items="items"
              label="Действия"
              required
            ></v-select>
            <v-select
              v-model="select1"
              :items="itemsPlayer"
              label="Игроки"
              :disabled="dis"
              required
            ></v-select>
            <p>Очко + {{ mess }}</p>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-footer
      app
    >
      <v-row>
        <v-col cols="12">
            <v-card :elevation="8">
              <template>
                <v-app-bar
                  dark
                >
                  <v-btn :disabled="dis1" small color="warning" style="max-width: 20px;" @click="iTH">Time</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn small :disabled="disGame" color="warning" @click="iH" style="max-width: 20px;">Point</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn small :disabled="disGame"  color="warning" @click="iG" style="max-width: 20px;">Point</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="dis2" small color="warning" @click="iTG" style="max-width: 20px;">Time</v-btn>
                </v-app-bar>
              </template>
            </v-card>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  modules: {
  },
  components: {
  },
  data: () => ({
    alert: false,
    disGame: true,
    dis: true,
    dis1: true,
    dis2: true,
    mess1: 'Выберите игру!',
    maxSet: 3,
    maxPoint: 14,
    drawer: false,
    dialog: false,
    dialogSt: false,
    itemsGames: [],
    gameId: '',
    host: '',
    away: '',
    HG: '',
    timeout: 'N',
    countT: 0,
    PoH: 0,
    PoG: 0,
    nH: '',
    nG: '',
    eH: '',
    eG: '',
    blH: true,
    blG: true,
    idClub: '',
    indClub: '',
    mess: '',
    setH: 0,
    setG: 0,
    select: [],
    select1: [],
    select2: [],
    select3: [],
    selectClubs: [],
    selectSet: [],
    set: '0',
    items: [
      'Атака',
      'Блок',
      'Подача',
      'Ошибка',
      'Ош.Подачи'
    ],
    itemsPlayer: [],
    countP: 0,
    arr: [],
    gameOver: false,
    teamId: 0,
    homeId: '',
    awayId: '',
    matchId: '',
    playersH: [],
    playersA: [],
    playersS: [],
    homeTeamName: '',
    awayTeamName: '',
    long1: 0,
    long2: 0,
    messagesG: ''
  }),
  computed: {
    error () {
      return this.$store.getters.error
    },
    clubs () {
      return this.getNameClub(this.$store.getters.clubs)
    },
    games () {
      return this.getNameGames(this.$store.getters.games)
    },
    formTitle () {
      return ''
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    games () {
      return this.getNameGames(this.$store.getters.games)
    }
  },
  methods: {
    start () {
      this.fetchMatches()
      this.dialogSt = !this.dialogSt
    },
    onChange () {
      if (this.select === 'Атака' || this.select === 'Блок' || this.select === 'Подача') {
        this.dis = false
        this.editItem()
      } else if (this.select === 'Ошибка' || this.select === 'Ош.Подачи') {
        this.dis = false
        this.editItem1()
      }
    },
    fetchMatches () {
      this.$store.dispatch('fetchMatches')
        .catch(err => console.log(err))
    },
    getNameGames (obj) {
      this.itemsGames = []
      for (let i = 0; i < obj.length; i++) {
        this.itemsGames.push(obj[i].homeTeamName + ' - ' + obj[i].awayTeamName)
      }
    },
    closeError () {
      this.$store.dispatch('clearError')
    },
    iH () {
      this.mess = ' команде А'
      this.HG = 'H'
      this.dialog = true
    },
    iG () {
      this.mess = ' команде Б'
      this.HG = 'A'
      this.dialog = true
    },
    iTH () {
      const upHsT = this.$store.getters.setSt
      const upHArrr = this.$store.getters.arrr
      if (+this.long1 === upHsT.length || +this.long2 === upHArrr.length) { return }
      this.timeout = 'H'
      if (+(localStorage.getItem('homeTimeout')) < 2) {
        localStorage.setItem('homeTimeout', +(localStorage.getItem('homeTimeout')) + 1)
        if (+(localStorage.getItem('homeTimeout')) === 2) {
          this.dis1 = true
        }
      } else { return }
      upHsT[this.$store.getters.setSt.length - 1].homeTimeout = 1
      upHArrr[this.$store.getters.arrr.length - 1].taH = 'TA'
      this.$store.dispatch('updateArrr', upHArrr[this.$store.getters.arrr.length - 1])
      this.$store.dispatch('updateStat', upHsT[this.$store.getters.setSt.length - 1])
      this.long1 = upHsT.length
      this.long2 = upHArrr.length
      // this.save(upHsT[this.$store.getters.setSt.length - 1], true)
    },
    iTG () {
      const upHsT = this.$store.getters.setSt
      const upHArrr = this.$store.getters.arrr
      if (+this.long1 === upHsT.length || +this.long2 === upHArrr.length) { return }
      this.timeout = 'A'
      if (+(localStorage.getItem('awayTimeout')) < 2) {
        localStorage.setItem('awayTimeout', +(localStorage.getItem('awayTimeout')) + 1)
        if (+(localStorage.getItem('awayTimeout')) === 2) {
          this.dis2 = true
        }
      } else { return }
      upHsT[this.$store.getters.setSt.length - 1].awayTimeout = 1
      upHArrr[this.$store.getters.arrr.length - 1].taG = 'TA'
      this.$store.dispatch('updateArrr', upHArrr[this.$store.getters.arrr.length - 1])
      this.$store.dispatch('updateStat', upHsT[this.$store.getters.setSt.length - 1])
      this.long1 = upHsT.length
      this.long2 = upHArrr.length
      // this.save(upHsT[this.$store.getters.setSt.length - 1], true)
    },
    editItem () {
      this.indClub = this.HG
      this.itemsPlayer = []
      if (this.HG === 'H') {
        for (let i = 0; i < this.playersH.length; i++) {
          this.itemsPlayer.push(this.playersH[i].lastName + ' ' + this.playersH[i].firstName +
            ' № ' + this.playersH[i].number)
        }
        this.teamId = this.homeId
      } else if (this.HG === 'A') {
        for (let i = 0; i < this.playersA.length; i++) {
          this.itemsPlayer.push(this.playersA[i].lastName + ' ' + this.playersA[i].firstName +
            ' № ' + this.playersA[i].number)
        }
        this.teamId = this.awayId
      }
    },
    editItem1 () {
      this.indClub = this.HG
      this.itemsPlayer = []
      if (this.HG === 'A') {
        for (let i = 0; i < this.playersH.length; i++) {
          this.itemsPlayer.push(this.playersH[i].lastName + ' ' + this.playersH[i].firstName +
            ' № ' + this.playersH[i].number)
        }
        this.teamId = this.homeId
      } else if (this.HG === 'H') {
        for (let i = 0; i < this.playersA.length; i++) {
          this.itemsPlayer.push(this.playersA[i].lastName + ' ' + this.playersA[i].firstName +
            ' № ' + this.playersA[i].number)
        }
        this.teamId = this.awayId
      }
    },
    getPlayerId (px, pl) {
      var v = px.toString()
      var index = this.itemsPlayer.indexOf(v)
      if (pl === 'H') {
        return this.playersH[index].id
      } else if (this.HG === 'A') {
        return this.playersA[index].id
      }
    },
    getPlayersNumber (pl) {
      let num = 0
      for (let i = 0; i < this.playersS.length; i++) {
        if (this.playersS[i].id === pl) {
          num = this.playersS[i].number
        }
      }
      return num
    },
    loadArr (pl) {
      const ThisArr = this.$store.getters.setSt
      if (ThisArr.length < 1) { return }
      // console.log('about to add ' + JSON.stringify(ThisArr))
      // let str = JSON.stringify(ThisArr)
      // str = str.replace(this.matchId, '')
      // console.log(str)
      // console.log(this.gameId)
      // console.log('about to add ' + JSON.parse(ThisArr))
      // console.log(ThisArr[this.gameId])
      const stSet = []
      Object.keys(ThisArr).forEach(key => {
        stSet.push(ThisArr[key])
      })
      const match = this.$store.getters.games
      if (stSet.length < 1) {
        console.log('Return new')
        return
      }
      console.log('Go To')
      // this.loadArrr([])
      if (match[pl].status === '1S') {
        this.setH = match[pl].homeSetsWon
        this.setG = match[pl].awaySetsWon
        this.set = 1
        console.log('SET-1')
      } else if (match[pl].status === '2S') {
        this.set = 2
        this.setH = match[pl].homeSetsWon
        this.setG = match[pl].awaySetsWon
        console.log('SET-2')
      } else if (match[pl].status === '3S') {
        this.set = 3
        this.setH = match[pl].homeSetsWon
        this.setG = match[pl].awaySetsWon
        console.log('SET-3')
      } else {
        this.set = 1
        console.log('SET-1')
      }
      let hh = 0
      let aa = 0
      let numH = 0
      let numA = 0
      for (let i = 0; i < stSet.length; i++) {
        if (stSet[i].setId === this.set) {
          if (stSet[i].homePoint.toString() === '1') {
            this.countP = this.countP + 1
            hh = (stSet[i].homePoint) + hh
            numH = this.getPlayersNumber(stSet[i].playerId)
            const p1 = {
              numH: numH,
              eventH: stSet[i].type,
              pointH: hh,
              blockH: false,
              blockG: true,
              taG: stSet[i].awayTimeout === 1 ? 'TA' : '',
              taH: stSet[i].homeTimeout === 1 ? 'TA' : ''
            }
            this.createArrr(p1)
          } else if (stSet[i].awayPoint.toString() === '1') {
            this.countP = this.countP + 1
            aa = (stSet[i].awayPoint) + aa
            numA = this.getPlayersNumber(stSet[i].playerId)
            const p2 = {
              numG: numA,
              eventG: stSet[i].type,
              pointG: aa,
              blockH: true,
              blockG: false,
              taG: stSet[i].awayTimeout === 1 ? 'TA' : '',
              taH: stSet[i].homeTimeout === 1 ? 'TA' : ''
            }
            this.createArrr(p2)
          }
        }
      }
      localStorage.setItem('pointH', 'hh')
      this.PoH = hh
      localStorage.setItem('pointG', 'aa')
      this.PoG = aa
      localStorage.setItem('set', this.set)
      // } catch (e) {
      // }
    },
    saveSt () {
      if (this.select2.length < 1) {
        alert('Выберите игру!')
        return
      }
      this.disGame = false
      this.dis1 = false
      this.dis2 = false
      this.loadArrr([])
      this.maxSet = this.$store.getters.games[0].duration
      this.maxPoint = this.$store.getters.games[0].setDuration
      var v = this.select2.toString()
      var index = this.itemsGames.indexOf(v)
      this.matchId = this.$store.getters.games[index]
      this.homeTeamName = this.matchId.homeTeamName
      this.gameId = this.matchId.id
      this.fetchStat()
      this.homeId = this.matchId.homeId
      this.awayId = this.matchId.awayId
      localStorage.setItem('gameId', this.gameId)
      this.awayTeamName = this.matchId.awayTeamName
      if (this.set === '0') {
        localStorage.setItem('set', this.set)
      }
      this.set = +(localStorage.getItem('set')) + 1
      localStorage.setItem('set', this.set)
      if (this.gameOver) {
        this.set = 0
        this.gameOver = false
      }
      localStorage.setItem('homeTimeout', '0')
      localStorage.setItem('awayTimeout', '0')
      this.fetchStat()
      const Player = this.$store.getters.players
      Object.keys(Player).forEach(key => {
        if (Player[key].teamId === this.homeId) {
          this.playersS.push(Player[key])
          this.playersH.push(Player[key])
        }
      })
      Object.keys(Player).forEach(key => {
        if (Player[key].teamId === this.awayId) {
          this.playersS.push(Player[key])
          this.playersA.push(Player[key])
        }
      })
      this.loadArr(index)
      this.dialogSt = false
    },
    save (pl, px) {
      if (this.select.length < 1 || this.select1.length < 1) {
        alert('Выберите игрока и действие!')
        return
      }
      // if (px) {
      //   const setS = {
      //     setId: pl.setId,
      //     pointId: pl.pointId,
      //     homePoint: 0,
      //     awayPoint: 0,
      //     homeTimeout: pl.homeTimeout,
      //     awayTimeout: pl.awayTimeout,
      //     teamId: pl.teamId,
      //     playerId: '',
      //     type: 'TA'
      //   }
      //   this.createStat(setS)
      //   console.log('AUT')
      //   this.close()
      //   return
      // }
      this.alert = false
      this.setPoint()
      var typeTime
      switch (this.select) {
        case 'Атака':
          typeTime = 'A'
          break
        case 'Блок':
          typeTime = 'B'
          break
        case 'Подача':
          typeTime = 'AC'
          break
        case 'Ошибка':
          typeTime = 'E'
          break
        case 'Ош.Подачи':
          typeTime = 'ES'
          break
      }
      let x = 0
      let y = 0
      if (this.HG === 'H') {
        x = 1
      } else if (this.HG === 'A') {
        y = 1
      }
      const setS = {
        gameId: this.gameId,
        setId: this.set,
        pointId: this.countT,
        homePoint: x,
        awayPoint: y,
        homeTimeout: 0,
        awayTimeout: 0,
        teamId: this.teamId,
        playerId: this.getPlayerId(this.select1, this.HG),
        type: typeTime
      }
      this.createStat(setS)
      const p1 = {
        numH: this.nH,
        eventH: this.eH,
        pointH: this.PoH,
        blockH: this.blH,
        blockG: this.blG,
        taG: null,
        taH: null
      }
      const p2 = {
        numG: this.nG,
        eventG: this.eG,
        pointG: this.PoG,
        blockH: this.blH,
        blockG: this.blG,
        taG: null,
        taH: null
      }
      if (this.HG === 'H') {
        this.createArrr(p1)
      } else if (this.HG === 'A') {
        this.createArrr(p2)
      }
      this.dis = true
      this.select1 = []
      this.select = []
      this.close()
    },
    close () {
      this.dialog = false
      this.dialogSt = false
      this.dis = true
      this.select1 = []
      this.select = []
      setTimeout(() => {
      }, 300)
    },
    setPoint () {
      let v = ''
      let index = ''
      if (this.HG.toString() === 'H') {
        v = this.select1.toString()
        index = this.itemsPlayer.indexOf(v)
        this.nH = this.playersH[index].number
        this.blH = false
        this.blG = true
        switch (this.select) {
          case 'Атака':
            this.eH = 'А'
            break
          case 'Блок':
            this.eH = 'Б'
            break
          case 'Подача':
            this.eH = 'П'
            break
          case 'Ошибка':
            this.eH = 'О'
            break
          case 'Ош.Подачи':
            this.eH = 'ОП'
            break
        }
        this.PoH = this.PoH + 1
        localStorage.setItem('pointH', this.PoH)
        this.countT = +(this.countT) + 1
      } else if (this.HG.toString() === 'A') {
        v = this.select1.toString()
        index = this.itemsPlayer.indexOf(v)
        this.nG = this.playersA[index].number
        this.PoG = this.PoG + 1
        localStorage.setItem('pointG', this.PoG)
        this.countT = +(this.countT) + 1
        switch (this.select) {
          case 'Атака':
            this.eG = 'А'
            break
          case 'Блок':
            this.eG = 'Б'
            break
          case 'Подача':
            this.eG = 'П'
            break
          case 'Ошибка':
            this.eG = 'О'
            break
          case 'Ош.Подачи':
            this.eG = 'ОП'
            break
        }
        this.blG = false
        this.blH = true
      }
    },
    fetchStat () {
      this.$store.dispatch('fetchStat')
        .catch(err => console.log(err))
    },
    fetchPlayers (pl) {
      this.$store.dispatch('fetchPlayers', pl)
        .catch(err => console.log(err))
    },
    createStat (pl) {
      this.$store.dispatch('createStat', pl)
        .catch(err => console.log(err))
    },
    createArrr (pl) {
      this.$store.dispatch('createArrr', pl)
        .then(this.indSet())
        .catch(err => console.log(err))
    },
    loadArrr () {
      this.$store.commit('loadArrr', [])
    },
    loadStS () {
      this.$store.commit('loadState', [])
    },
    indSet () {
      const pH = +this.PoH
      const pG = +this.PoG
      if (((pH > this.maxPoint - 1) || (pG > this.maxPoint - 1)) && ((pH - pG) > 1 || (pG - pH) > 1)) {
        console.log('in if maxPoint')
        if (this.HG.toString() === 'H') {
          this.setH = this.setH + 1
          this.set = this.set + 1
        } else if (this.HG.toString() === 'A') {
          this.setG = this.setG + 1
          this.set = this.set + 1
        }
        if (+this.maxSet === 3) {
          console.log('in if maxSet = 3')
          if ((+this.setH === 2 && +this.setG === 0) || (+this.setG === 2 && +this.setH === 0) || (+this.setH +
            (+this.setG)) > 2) {
            console.log('GameOver!')
            this.gameOver = true
          }
        } else if (+this.maxSet === 5) {
          console.log('in if maxSet = 5')
          if ((+this.setH === 3 && +this.setG === 0) || (+this.setG === 3 && +this.setH === 0) || (+this.setH +
              +this.setG) > 4) {
            console.log('GameOver!5')
            this.gameOver = true
          }
        }
        this.creatMatch(this.gameOver)
      }
    },
    creatMatch (pl) {
      let GO = ''
      if (pl) {
        GO = 'finished'
        this.dis1 = true
        this.dis2 = true
        this.dialog = false
        this.disGame = true
        this.messagesG = 'Игра закончена!'
        this.alert = true
        this.fetchMatches()
      } else {
        GO = (this.setH + this.setG + 1) + 'S'
        this.dis1 = false
        this.dis2 = false
        this.dialog = false
        this.messagesG = 'Сет № ' + (+this.set - 1) + ' закончен!'
        this.alert = true
      }
      localStorage.setItem('pointH', '0')
      localStorage.setItem('homeTimeout', '0')
      localStorage.setItem('awayTimeout', '0')
      this.PoH = 0
      localStorage.setItem('pointG', '0')
      this.PoG = 0
      this.countP = 0
      this.loadArrr([])
      this.loadStS([])
      const match = {
        id: this.gameId,
        status: GO,
        homeSetsWon: +this.setH,
        awaySetsWon: +this.setG
      }
      if (pl) {
        this.countP = 0
        this.set = 0
        this.setH = 0
        this.setG = 0
        this.mess1 = 'Игра закончена. Выберите новую игру!'
        this.dialogSt = true
      }
      this.updateMatch(match)
    },
    deleteMatch () {
      this.$store.dispatch('deleteMatch', 8)
        .catch(err => console.log(err))
    },
    updateMatch (pl) {
      this.$store.dispatch('updateMatch', pl)
        .catch(err => console.log(err))
    }
  }
}
</script>

<style>
  .sticky {
    position: sticky;
    top: 50px;
    z-index: 1;
  }
</style>
