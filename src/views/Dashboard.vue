<script setup>

</script>

<template>
 <section aria-label="Admin Dashboard Section" class="container">
    <h1 class="mb-3 text-center">Admin Dashboard</h1>
    <div id="dashboard-buttons">
      <RouterLink :to="{name: 'menu-category'}"><button class="btn-dashboard">Menu Category</button></RouterLink>
      <RouterLink :to="{name: 'menu-item'}"><button class="btn-dashboard">Menu Items</button></RouterLink>
      <button class="btn-dashboard disabled">Tables</button>
      <button class="btn-dashboard disabled">Users</button>
      <button class="btn-dashboard disabled">Statistics</button>
      <button class="btn-dashboard disabled">Preferences</button>
    </div>
 </section>
</template>

<style scoped>
  #dashboard-buttons{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    grid-template-rows: 100px 100px;
  }
  .btn-dashboard{
    background-color: var(--third-color);
    font-size: 1.25rem;
    border-radius: 0.5rem!important;
    display: block;
    width: 100%;
    height: 100%;
  }
  .disabled{
    color: grey;
    cursor: default;
  }
</style>