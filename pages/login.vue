<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl mb-6 text-center">Login</h2>
        <div v-if="error" class="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {{ error }}
        </div>
        <form @submit.prevent="handleLogin">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <p class="mt-4 text-center">
          Don't have an account? 
          <NuxtLink to="/signup" class="text-blue-500 hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: null
      }
    },
    methods: {
      async handleLogin() {
        try {
          const response = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { email: this.email, password: this.password }
          });
          localStorage.setItem('token', response.token);
          this.$router.push('/');
        } catch (error) {
          this.error = error.data?.message || 'Login failed';
        }
      }
    }
  }
  </script>