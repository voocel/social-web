import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/Index.vue"),
    children: [
      {
        path: "/chat",
        name: "chat",
        component: () => import("@/views/home/components/Chat"),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/login/Register"),
    meta: {
      requiresAuth: false
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
