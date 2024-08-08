import {createRouter ,createWebHistory} from "vue-router";
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import MenuCategory from './views/MenuCategory.vue';
import MenuItem from './views/MenuItem.vue';
import auth from './auth.js';

const routes = [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
        meta:{
          guard: 'auth',
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta:{
            guard: 'guest',
        }
    },
    {
        path: '/menu-category',
        name: 'menu-category',
        component: MenuCategory,
        meta:{
            guard: 'auth',
        }
    },
    {
        path: '/menu-item',
        name: 'menu-item',
        component: MenuItem,
        meta:{
            guard: 'auth',
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to,from,next) =>{
    if(to.meta.guard =='auth' && !auth.token){
        //if user have not logged in
        return next({name: 'login'});
    }else{
        next();
    }
});


export default router;
