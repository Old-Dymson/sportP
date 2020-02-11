const DB_NAME = 'sportdb'
const DB_VERSION = 3
let DB

export default {
  async getDb (stn) {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB)
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION, (upgradeDB) => {
        if (!upgradeDB.objectStoreNames.contains(stn)) {
          upgradeDB.createObjectStore(stn)
        }
      })
      request.onerror = e => {
        console.log('Error opening db', e)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Error')
      }
      request.onsuccess = e => {
        DB = e.target.result
        resolve(DB)
      }
      request.onupgradeneeded = e => {
        let db = e.target.result
        db.createObjectStore(stn)
      }
    })
  },
  async deleteObj (payload, stn) {
    const db = await this.getDb(stn)
    return new Promise(resolve => {
      const trans = db.transaction(stn, 'readwrite')
      trans.oncomplete = () => {
        resolve()
      }
      const store = trans.objectStore(stn)
      store.delete(payload.id)
    })
  },
  async getObj (stn) {
    let db = await this.getDb(stn)
    return new Promise(resolve => {
      let trans = db.transaction(stn, 'readonly')
      trans.oncomplete = () => {
        resolve(clubs)
      }
      const store = trans.objectStore(stn)
      const clubs = []
      store.openCursor().onsuccess = e => {
        const cursor = e.target.result
        if (cursor) {
          clubs.push(cursor.value)
          cursor.continue()
        }
      }
    })
  },
  async saveObj (payload, stn) {
    let db = await this.getDb(stn)
    return new Promise(resolve => {
      let trans = db.transaction(stn, 'readwrite')
      trans.oncomplete = () => {
        resolve()
      }
      let store = trans.objectStore(stn)
      store.put(payload)
    })
  }
}
