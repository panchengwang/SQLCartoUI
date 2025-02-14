import { useAppConfig } from 'src/stores/ApplicationConfiguration'
import axios from 'axios'

class SQLCartoDatabase {
  constructor() {
    this.appConfig = useAppConfig()
    this.masterUrl = this.appConfig.$state.masterUrl
    this.nodeUrl = this.appConfig.$state.nodeUrl
  }

  postToMaster(requestData, callback) {
    const formData = new FormData()
    formData.append('request', JSON.stringify(requestData))
    axios.post(this.masterUrl, formData).then((response) => {
      if (callback) {
        callback(response.data)
      }
    })
  }

  postToNode(requestData, callback) {
    const formData = new FormData()
    formData.append('request', JSON.stringify(requestData))
    axios.post(this.nodeUrl, formData).then((response) => {
      if (callback) {
        callback(response.data)
      }
    })
  }

  userIfAvailable(username, callback) {
    this.postToMaster(
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
    this.postToMaster(
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
    this.postToMaster(
      {
        type: 'USER_REGISTER',
        data: userinfo,
      },
      callback,
    )
  }
  userResetPassword(userinfo, callback) {
    this.postToMaster(
      {
        type: 'USER_RESET_PASSWORD',
        data: userinfo,
      },
      callback,
    )
  }

  userSignIn(userinfo, callback) {
    this.postToMaster(
      {
        type: 'USER_SIGN_IN',
        data: userinfo,
      },
      callback,
    )
  }

  userLoadWebMapKeys(userinfo, callback) {
    this.postToNode(
      {
        type: 'USER_LOAD_WEB_MAP_KEYS',
        data: userinfo,
      },
      callback,
    )
  }
}

export default SQLCartoDatabase
