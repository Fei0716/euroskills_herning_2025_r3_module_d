import {reactive} from 'vue';
const auth = reactive({
    token: localStorage.getItem('token')||null,
    username: localStorage.getItem('username')||null,
    isAuth(){
      return this.token !== null && this.username !== null;
    },
    setAuth(t,u){
        this.token = t;
        this.username = u;
        localStorage.setItem('token',t);
        localStorage.setItem('username',u);
    },
    removeAuth(){
        this.token = null;
        this.username = null;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }
});
export default auth;