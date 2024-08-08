<script setup>
import {ref,reactive, computed , watch} from 'vue';
import api from '../api';
import {useRouter} from 'vue-router';
const router = useRouter();

// states

const menuItem  = reactive([]);
const menuCategory = reactive([]);
const selectedCategory = reactive({
  id: -1,
  name: '',
  priority: 0,
});
const inlineEditIndex = ref(null);


//functions
getMenuCategories();
getMenuItems();
async function getMenuCategories(){
  try{
    const {data} = await api.get('/menuCategories');
    menuCategory.splice(0, menuCategory.length);
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
// for saving the menu items new details
async function save(){
  if(selectedCategory.id === 0){
    await addCategory();
    return;
  }
  await updateCategory();
}
async function updateCategory(){
  try{
    //check whether is updating or adding new category
    await api.put(`/menuCategories/${selectedCategory.id}`,{
      name: selectedCategory.name,
      priority: selectedCategory.priority,
    });
    await getMenuCategories();
    inlineEditIndex.value = null;

  }catch(e){
    console.error(e);
  }
}

async function addCategory(){
  try{
    //generate the priority which is the lowest in the list
     const priority = menuCategory[0].priority - 1;
     await api.post('/menuCategories',{
       name: selectedCategory.name,
       priority: priority,
     });
     await getMenuCategories();
  }catch(e){
    console.error(e);
  }
}
async function deleteCategory(m){
  try{
    //check if no menu items are linked to the category.
    if(menuItem.find((item) => item.menuCategoryId == m.id)){
      alert('Cannot delete category with menu items linked to it');
      return;
    }
    await api.delete(`/menuCategories/${m.id}`);
    await getMenuCategories();
  }catch(e){
    console.error(e);
  }
}

function inlineEdit(i){
  selectedCategory.name = menuCategory[i].name;
  selectedCategory.priority = menuCategory[i].priority;
  selectedCategory.id = menuCategory[i].id;
  inlineEditIndex.value = i;
}
function cancelEdit(i){
  inlineEditIndex.value = null;
}

// for drag and drop
// Drag and Drop Functions
let draggedItem = null;

function onDragStart(event, index) {
  draggedItem = menuCategory[index];
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', event.target.outerHTML);
}

function onDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  if(event.target.classList.contains('card')){
    event.target.classList.add('drag-over');
    return;
  }
  event.target.closest('.card').classList.add('drag-over');
}
function onDragLeave(event){
  event.target.classList.remove('drag-over');
}
function onDrop(event, index) {
  event.preventDefault();
  if(!event.target.classList.contains('card')){
    event.target.closest('.card').classList.remove('drag-over');
  }else{
    event.target.classList.remove('drag-over');
  }
  const dropTarget = menuCategory[index];
  const draggedIndex = menuCategory.indexOf(draggedItem);
  const dropIndex = menuCategory.indexOf(dropTarget);
  // Swap the elements
  menuCategory.splice(draggedIndex, 1);
  menuCategory.splice(dropIndex, 0, draggedItem);

  saveReorder(draggedIndex, dropIndex);
}
async function saveReorder(draggedIndex, dropIndex){
  try{
    await api.put(`/menuCategories/${menuCategory[draggedIndex].id}`,{
      name: menuCategory[draggedIndex].name,
      priority: menuCategory[dropIndex].priority,
    });
    await api.put(`/menuCategories/${menuCategory[dropIndex].id}`,{
      name: menuCategory[dropIndex].name,
      priority: menuCategory[draggedIndex].priority,
    });
    await getMenuItems();
  }catch(e){
    console.error(e);
  }
}

function addNewCategory(){
// add new card
  menuCategory.unshift({
    id: 0,
    name: '',
    priority: 0,
  });
}

//if blur event is triggered and the user is adding a new category
function checkBlur(){
  if(menuCategory[0].id === 0){
    //remove the first menu card
    menuCategory.shift();
    Object.assign(selectedCategory , {
      id: -1,
      name: '',
      priority: 0,
    });
  }
}
</script>

<template>
  <section aria-label="Menu Items Section" class="container" id="menu-category-section">
    <h1 class="mb-2 text-center">Menucard Categories</h1>
    <button class="btn-primary" id="btn-add" @click="addNewCategory">&plus;</button>
     <div class="cards">
       <article class="card" v-for="(m , i) of menuCategory" :key="m.id" draggable="true" @dragstart="onDragStart($event, i)"
           @dragleave="onDragLeave"     @dragover="onDragOver"
                @drop="onDrop($event, i)">
         <div>
           <div class="card-drag">
             <div></div>
             <div></div>
             <div></div>
             <div></div>
             <div></div>
             <div></div>
           </div>
          <input v-if="inlineEditIndex=== i"  type="text" name="name" id="name" class="form-control" v-model="selectedCategory.name">
           <h2 v-else class="h4">{{m.name}}</h2>
         </div>
          <div id="btn-group">
            <button class="btn-primary" @click="inlineEdit(i ,m)" v-if="inlineEditIndex !== i">Edit</button>
            <button class="btn-primary" @click="save" v-else-if="inlineEditIndex === i">Save</button>
            <button class="btn-primary" @click="deleteCategory(m)" v-if="inlineEditIndex !== i">Delete</button>
            <button class="btn-primary" @click="cancelEdit(i)" v-if="inlineEditIndex === i">Cancel</button>
          </div>
       </article>
     </div>
  </section>

</template>

<style scoped>
.form-control{
  margin-bottom: 0!important;
  font-size: clamp(1.25rem , 3vw , 2.25rem);
  padding: 0.5rem 0;
}
#menu-category-section{
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
.cards{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 500px;
  overflow-y: auto;
  width: fit-content;
  margin: 0 auto;
  padding-right: 0.25rem;
}
.cards::-webkit-scrollbar{
  width: 0.5rem;
  color: var(--primary-color);
}
.cards::-webkit-scrollbar-thumb{
  background-color: #bebebe;
  border-radius: 0.25rem;
}
.card{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 700px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border: 1px solid grey;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}
.card > div:first-child{
  display: flex;
  align-items: center;
  gap: 1rem;
}
.card-drag{
  display:grid;
  grid-template-rows: repeat(3, 5px);
  grid-template-columns: repeat(2, 5px);
  gap: 2px;
  width: fit-content;
  cursor: move;
}
.card-drag > div{
  background-color: var(--primary-color);
  height: 5px;
  width: 5px;
  border-radius: 100%;
}
#btn-group{
  display: flex;
  gap: 0.5rem;
}
.drag-over{
  margin-bottom: 60px;
}
</style>