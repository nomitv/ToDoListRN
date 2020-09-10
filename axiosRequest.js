import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://todo-list-poc-api.herokuapp.com',
    headers: {       // can be common or any other method
      'Content-Type' : 'application/json',
      'Accept' : '*/*',
    },
  });

export default instance