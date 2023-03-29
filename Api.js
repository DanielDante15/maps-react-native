import axios from 'axios'

const Api = axios.create({
    baseURL:'http://192.168.88.43:8000/',
    headers:{
        "Content-Type":"application/json",
    },
})


export default Api;
