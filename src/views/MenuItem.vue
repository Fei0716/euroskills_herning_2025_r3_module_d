<script setup>
import {ref,reactive, computed} from 'vue';
import api from '../api';
import {useRouter} from 'vue-router';
const router = useRouter();
// states
const menuCategory = reactive([]);
const selectedCategory = ref(0);
const menuItem = reactive([]);
const filteredMenuItem = computed(()=>{
   return menuItem.filter((i) => i.menuCategoryId === menuCategory[selectedCategory.value].id);
});

const types = computed(()=>{
  let duplicateTypes = menuItem.map((i) => i.type);
  return [... new Set(duplicateTypes)];
})
const selectedMenuItem = ref({
  id: 0,
  name: '',
  price: 0,
  type: '',
  menuCategoryId: 0,
});
const modalEdit = ref(null);
const toggleFlag = ref(null);

//functions
getMenuCategories();
getMenuItems();
async function getMenuCategories(){
  try{
    const {data} = await api.get('/menuCategories');
    menuCategory.push(...data);

  }catch(e){
    console.error(e);
  }
}
async function getMenuItems(){
  try{
    const {data} = await api.get('/menuItems');
    menuItem.splice(0, menuItem.length);
    menuItem.push(...data);
  }catch(e){
    console.error(e);
  }
}

function toggleEdit(i){
   toggleFlag.value = 'edit';
   selectedMenuItem.value = i;
   modalEdit.value.showModal();
}
function hideModal(){
  modalEdit.value.close();
}
// for saving the menu items new details
async function save(){
  try{
    await api.put(`/menuItems/${selectedMenuItem.value.id}`,{
      name: selectedMenuItem.value.name,
      type: selectedMenuItem.value.type,
      menuCategoryId: selectedMenuItem.value.menuCategoryId,
      price: selectedMenuItem.value.price,
    });
    await getMenuItems();
    hideModal()
  }catch(e){
    console.error(e);
  }
}

async function deleteItem(){
  try{
    await api.delete(`/menuItems/${selectedMenuItem.value.id}`);
    await getMenuItems();
    hideModal()
  }catch(e){
    console.error(e);
  }
}

function toggleAdd(){
  toggleFlag.value = 'add';
  selectedMenuItem.value = {
    id: 0,
    name: '',
    price: 0,
    type: 'FOOD',
    menuCategoryId: menuCategory[selectedCategory.value].id,
  };
  modalEdit.value.showModal();
}
async function add(){
  try{
    await api.post(`/menuItems`,{
      name: selectedMenuItem.value.name,
      type: selectedMenuItem.value.type,
      menuCategoryId: selectedMenuItem.value.menuCategoryId,
      price: selectedMenuItem.value.price,
    });
    await getMenuItems();
    hideModal()
  }catch(e){
    console.error(e);
  }
}

</script>

<template>
  <section aria-label="Menu Items Section" class="container" id="menu-item-section">
       <h1 class="mb-2 text-center">Menu Items</h1>
       <button class="btn-primary" id="btn-add" @click="toggleAdd">&plus;</button>
      <select name="selectedCategory" id="selectedCategory" class="form-control mb-2" v-model="selectedCategory">
        <option :value="i" v-for="(c, i) of menuCategory">
          {{c.name}}
        </option>
      </select>

      <table class="table">
          <tr>
            <th>Name</th>
            <th style="width: 10%">Type</th>
            <th style="width: 10%">Price</th>
          </tr>
          <tr v-for="i in filteredMenuItem" @click="toggleEdit(i)">
            <td>{{i.name}}</td>
            <td>{{i.type}}</td>
            <td>{{i.price}}</td>
          </tr>
      </table>
  </section>
  <!--  dialog modal-->
  <dialog ref="modalEdit" class="modal">
    <h2 class="mb-2 h4">Edit Menu Item</h2>
    <form action="#" @submit.prevent="toggleFlag==='edit'? save(): add()" method="post">
        <div>
          <label for="name">Name</label>
          <input type="text" name="name" id="name" class="form-control" v-model="selectedMenuItem.name">
        </div>
        <div>
          <label for="price">Price</label>
          <input type="number" min="0.00" name="price" id="price" class="form-control" v-model="selectedMenuItem.price">
        </div>
        <div>
          <label for="type">Type</label>
          <select name="type" id="type" class="form-control mb-2"  v-model="selectedMenuItem.type">
            <option :value="t" v-for="t of types">
              {{t}}
            </option>
          </select>
        </div>
        <div class="mb-2">
          <label for="category">Category</label>
          <select name="category" id="category" class="form-control mb-2"  v-model="selectedMenuItem.menuCategoryId">
            <option :value="c.id" v-for="(c, i) of menuCategory">
              {{c.name}}
            </option>
          </select>
        </div>
      <div id="btn-group">
        <button type="submit" class="btn-primary">{{ toggleFlag === "edit" ? 'Save' : 'Add' }}</button>
        <button type="button" @click="deleteItem" class="btn-primary">Delete</button>
        <button type="button" @click="hideModal"  class="btn-primary">Cancel</button>
      </div>
    </form>
  </dialog>

</template>

<style scoped>
  #menu-item-section{
    position: relative;
  }
  #btn-add{
    position: absolute;
    right: 1rem;
    top: 0;
    font-size: 2rem;
    border-radius: 100%!important;
    padding: 0.5rem 1rem;
  }
  #selectedCategory{
    display: block;
    width: 300px;
    margin: 2rem auto;
  }
  table{
    display: block;
    width: fit-content;
    margin:  0 auto;
    border-collapse: collapse;
    height: 500px;
    overflow-y: scroll;
    table-layout: fixed;
  }
  th,td{
    padding: 1rem;
    text-align: start;
  }
  th{
    padding: 1rem;
    background-color: #0b0b0b;
    color: white;
  }
  tr{
    height: 1rem!important;
    border-bottom: 1px solid grey;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  tr:hover{
    background-color: #c7c7c7;
  }
  .modal{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 3.5rem 4rem;
    border-radius: 0.5rem;
    border: none;
    box-shadow: 1px 1px 4px rgba(157, 157, 157, 0.8);

  }
  #btn-group{
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
</style>