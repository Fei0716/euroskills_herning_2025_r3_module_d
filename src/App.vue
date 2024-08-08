<script setup>
  import HeaderNav  from "./components/HeaderNav.vue";
  import auth from './auth';
  import {watchEffect, ref} from 'vue';

  const isAuth = ref(auth.isAuth);

  //make sure the isAuth value is always in sync with the auth.isAuth value
  watchEffect(()=>{
    isAuth.value = auth.isAuth();
  });
</script>

<template>
     <HeaderNav v-if="isAuth"/>
    <RouterView/>
</template>

<style scoped>

</style>
