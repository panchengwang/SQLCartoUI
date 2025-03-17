import { defineStore, acceptHMRUpdate } from 'pinia'

export const useWindowsManager = defineStore('windowsmanager', {
  state: () => ({
    windows: [],
  }),

  getters: {},

  actions: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWindowsManager, import.meta.hot))
}
