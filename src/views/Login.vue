<script setup>
import {ref} from 'vue';
import api from '../api';
import auth from '../auth';
import {useRouter} from 'vue-router';
const error = ref(null);
const username = ref('');
const password = ref('');
const router = useRouter();
async function login(){
   try{
     const {data} = await api.post('/login',{
       username: username.value,
       password: password.value,
     });

     error.value  = null;
     auth.setAuth(data.token , username.value);
     router.push({name: 'dashboard'});

   }catch(e){
     error.value = e.response.data;
     console.error(e);
   }
}
</script>

<template>
   <section aria-label="Login Section">
     <img src="/dineease_logo.png" alt="Logo of Dineease" id="img-logo">
     <form action="#" @submit.prevent="login" method="post">
       <h1 class="text-center mb-1 h4">Login</h1>
       <Transition name="alert">
         <div class="alert-danger mb-1" v-if="error">
           {{error}}
         </div>
        </Transition>
       <div>
         <label for="username">Username</label>
         <input type="text" id="username" name="username" class="form-control" v-model="username" required>
       </div>
       <div>
         <label for="password">Password</label>
         <input type="password" id="password" name="password" class="form-control" v-model="password" required>
       </div>
        <button type="submit" class="btn-primary d-block mx-auto">Login</button>
     </form>
   </section>
</template>

<style scoped>
  #img-logo{
    width: 150px;
    margin: 0 auto 1rem;
    display: block;
  }

  section{
    height: 100dvh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
  form{
    background-color: var(--third-color);
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 1px 1px 4px rgba(157, 157, 157, 0.8);
  }
</style>