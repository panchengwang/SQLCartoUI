import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalStorage } from 'quasar'

export const useAppConfig = defineStore('appconfig', {
  state: () => ({
    webMapKeys: {
      GaoDe: {
        key: LocalStorage.getItem('gaode_key') || '',
        password: LocalStorage.getItem('gaode_password') || '',
      },
      TianDiTu: {
        key: LocalStorage.getItem('tianditu_key') || '',
      },
      Bing: {
        key: LocalStorage.getItem('bing_key') || '',
      },
      Google: {
        key: LocalStorage.getItem('google_key') || '',
      },
    },
    token: '',
    username: '',
    masterUrl: LocalStorage.getItem('master_url') || 'http://127.0.0.1/sqlcarto/master/service.php',
    nodeUrl: LocalStorage.getItem('node_url') || 'http://127.0.0.1/sqlcarto/node/service.php',
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
      LocalStorage.set('gaode_key', key)
      LocalStorage.set('gaode_password', password)
    },
    setTianDiTu(key) {
      this.webMapKeys.TianDiTu.key = key
      LocalStorage.set('tianditu_key', key)
    },
    setBing(key) {
      this.webMapKeys.Bing.key = key
      LocalStorage.set('bing_key', key)
    },
    setGoogle(key) {
      this.webMapKeys.Google.key = key
      LocalStorage.set('google_key', key)
    },
    setAccountInformation(username, token) {
      this.token = token
      this.username = username
    },
    setMasterUrl(url) {
      this.masterUrl = url
      LocalStorage.setItem('master_url', url)
    },
    setNodeUrl(url) {
      this.nodeUrl = url
      LocalStorage.setItem('node_url', url)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppConfig, import.meta.hot))
}
