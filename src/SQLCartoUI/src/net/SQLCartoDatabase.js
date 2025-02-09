import { useAppConfig } from 'src/stores/useAppConfig'
import axios from 'axios'

class SQLCartoDatabase {
  constructor() {
    this.appConfig = useAppConfig()
    this.masterUrl = this.appConfig.$state.masterUrl
    this.nodeUrl = this.appConfig.$state.nodeUrl
  }

  post(requestData, callback) {
    const formData = new FormData()
    formData.append('request', JSON.stringify(requestData))
    axios.post(this.masterUrl, formData).then((response) => {
      if (callback) {
        callback(response.data)
      }
    })
  }
  userIfAvailable(username, callback) {
    this.post(
      {
        type: 'USER_IF_AVAILABLE',
        data: {
          username: username,
        },
      },
      callback,
    )
  }
  userGetCaptcha(username, callback) {
    this.post(
      {
        type: 'USER_GET_CAPTCHA',
        data: {
          username: username,
        },
      },
      callback,
    )
  }
  userRegister(userinfo, callback) {
    this.post(
      {
        type: 'USER_REGISTER',
        data: userinfo,
      },
      callback,
    )
  }
}

export default SQLCartoDatabase
