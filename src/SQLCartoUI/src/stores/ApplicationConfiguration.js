import { defineStore, acceptHMRUpdate } from 'pinia'
import SQLCartoDatabase from 'src/net/SQLCartoDatabase'

export const useAppConfig = defineStore('appconfig', {
  state: () => ({
    webMapKeys: {
      GaoDe: {
        key: '',
        password: '',
      },
      TianDiTu: {
        key: '',
      },
      Bing: {
        key: '',
      },
      Google: {
        key: '',
      },
    },
    token: '',
    username: '',
    masterUrl: 'http://127.0.0.1/sqlcarto/master/service.php',
    nodeUrl: '',
  }),

  getters: {
    getGaoDe: (state) => state.webMapKeys.GaoDe,
    getTianDitu: (state) => state.webMapKeys.TianDiTu,
    getBing: (state) => state.webMapKeys.Bing,
    getGoogle: (state) => state.webMapKeys.Google,
    hasLogin: (state) => {
      state.token.trim() !== '' && state.username.trim() !== ''
    },
  },

  actions: {
    setGaoDe(key, password) {
      this.webMapKeys.GaoDe.key = key
      this.webMapKeys.GaoDe.password = password
    },
    setTianDiTu(key) {
      this.webMapKeys.TianDiTu.key = key
    },
    setBing(key) {
      this.webMapKeys.Bing.key = key
    },
    setGoogle(key) {
      this.webMapKeys.Google.key = key
    },
    setAccountInformation(username, token) {
      this.token = token
      this.username = username
    },
    setMasterUrl(url) {
      this.masterUrl = url
    },
    setNodeUrl(url) {
      this.nodeUrl = url
    },
    loadWebMapKeys() {
      const db = new SQLCartoDatabase()
      db.userLoadWebMapKeys(
        {
          token: this.token,
          username: this.username,
        },
        (response) => {
          const webmapkeys = response.data.webmapkeys
          this.webMapKeys.GaoDe.key = webmapkeys.gaode_key
          this.webMapKeys.GaoDe.password = webmapkeys.gaode_password
          this.webMapKeys.Bing.key = webmapkeys.bing_key
          this.webMapKeys.TianDiTu.key = webmapkeys.tianditu_key
          this.webMapKeys.Google.key = webmapkeys.google_key
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppConfig, import.meta.hot))
}
