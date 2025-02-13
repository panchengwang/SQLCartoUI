import { defineStore, acceptHMRUpdate } from 'pinia'

export const useStyles = defineStore('styles', {
  state: () => ({}),

  getters: {},

  actions: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStyles, import.meta.hot))
}
