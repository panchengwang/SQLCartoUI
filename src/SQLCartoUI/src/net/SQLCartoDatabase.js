import { useAppConfig } from 'src/stores/useAppConfig'
import axios from 'axios'

class SQLCartoDatabase {
  constructor() {
    this.appConfig = useAppConfig()
    this.masterUrl = this.appConfig.$state.masterUrl
    this.nodeUrl = this.appConfig.$state.nodeUrl
  }

  userIfAvailable(username, callback) {
    const formData = new FormData()
    formData.append(
      'request',
      JSON.stringify({
        type: 'USER_IF_AVAILABLE',
        data: {
          username: username,
        },
      }),
    )
    axios.post(this.masterUrl, formData).then((response) => {
      if (callback) {
        callback(response.data)
      }
    })
  }
  userGetCaptcha(username, callback) {
    const formData = new FormData()
    formData.append(
      'request',
      JSON.stringify({
        type: 'USER_GET_CAPTCHA',
        data: {
          username: username,
        },
      }),
    )
    axios.post(this.masterUrl, formData).then((response) => {
      if (callback) {
        callback(response.data)
      }
    })
  }
  userRegister(userinfo, callback) {
    const formData = new FormData()
    formData.append(
      'request',
      JSON.stringify({
        type: 'USER_REGISTER',
        data: userinfo,
      }),
    )
    axios.post(this.masterUrl, formData).then((response) => {
      if (callback) {
        callback(response.data)
      }
    })
  }
}

export default SQLCartoDatabase
