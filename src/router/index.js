import * as VueRouter from 'vue-router'
// 1. Define route components.
// These can be imported from other files
const About = { template: '<h1>About</h1>' }
// const Create = imp
import Create from '../page/create/Index.vue'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Create },
  { path: '/about', component: About },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes, // short for `routes: routes`
})

export default router
