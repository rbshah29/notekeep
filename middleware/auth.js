export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
      const token = localStorage.getItem('token');
      if (!token && to.path !== '/login' && to.path !== '/signup') {
        return navigateTo('/login');
      }
    }
  });