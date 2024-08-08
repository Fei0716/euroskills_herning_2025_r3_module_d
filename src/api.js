import axios from 'axios';
import auth from './auth.js';
import {useRouter} from 'vue-router';

const router = useRouter();
const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api/v1',
    baseURL: 'http://127.0.0.1:3000/api/v1',

    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
    }
})
api.interceptors.response.use(function(response){
//when status code lies around 200 range
    return response;
},function(error){
    if(error.status === 401){
        auth.removeAuth();
        router.push({name: 'login'});
    }
    return Promise.reject(error);
})
export default api;