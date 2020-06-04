import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://aqueous-depths-80257.herokuapp.com'
})

export default instance
