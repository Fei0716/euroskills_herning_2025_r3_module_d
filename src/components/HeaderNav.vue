<script setup>
 import auth from '../auth';
 import api from '../api';
 import {useRouter,useRoute} from 'vue-router';
 import{ref , watchEffect} from 'vue';


 const router = useRouter();
 const route = useRoute();
 const isAtDashboard = ref(false);

 watchEffect(()=>{
   isAtDashboard.value = route.name === 'dashboard';
 });
 async function logout(){
   try{
      const response = await api.post('/logout');
      auth.removeAuth();
      router.push({name: 'login'});
   }catch(e){
     console.error(e);
   }
 }

 function redirectToDashboard(){
   router.push({name: 'dashboard'});
 }
</script>

<template>
   <header>
      <nav class="navbar">
        <div>
            <RouterLink :to="{name:'dashboard'}"><img src="/dineease_logo.png" alt="Logo of Dineease" class="navbar-brand"></RouterLink>
            <ul class="navbar-nav">
              <li>
                {{auth.username}}
              </li>
            </ul>
        </div>

        <div class="navbar-buttons">
          <button @click="redirectToDashboard" v-if="!isAtDashboard" class="btn-secondary">Back to Dashboard</button>
          <button @click="logout" class="btn-secondary">Logout</button>
        </div>
      </nav>
   </header>
</template>

<style scoped>
   .navbar{
     display: flex;
     justify-content: space-between;
     padding: 1rem 0.5rem;
     align-items: center;
   }
   .navbar-brand{
      width: 200px;
   }
   .navbar > div{
     display: flex;
     align-items: center;
     gap: 1rem;
   }
</style>