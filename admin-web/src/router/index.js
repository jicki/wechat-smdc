import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由懒加载
const Login = () => import('../views/Login.vue')
const Home = () => import('../views/Home.vue')
const Welcome = () => import('../views/Welcome.vue')
const Users = () => import('../views/user/Users.vue')
const Shop = () => import('../views/shop/Shop.vue')
const DishCategory = () => import('../views/dish/DishCategory.vue')
const Dish = () => import('../views/dish/Dish.vue')
const Order = () => import('../views/order/Order.vue')
const SystemConfig = () => import('../views/system/SystemConfig.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/shop',
        component: Shop
      },
      {
        path: '/dish/category',
        component: DishCategory
      },
      {
        path: '/dish',
        component: Dish
      },
      {
        path: '/order',
        component: Order
      },
      {
        path: '/system/config',
        component: SystemConfig
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问登录页，直接放行
  if (to.path === '/login') return next()
  // 获取token
  const token = localStorage.getItem('token')
  // 如果没有token，强制跳转到登录页
  if (!token) return next('/login')
  // 有token，放行
  next()
})

export default router 