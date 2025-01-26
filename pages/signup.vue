<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl mb-6 text-center">Sign Up</h2>
        <div v-if="error" class="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {{ error }}
        </div>
        <form @submit.prevent="handleSignup">
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
            Sign Up
          </button>
        </form>
        <p class="mt-4 text-center">
          Already have an account? 
          <NuxtLink to="/login" class="text-blue-500 hover:underline">Login</NuxtLink>
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
      async handleSignup() {
        try {
          await $fetch('/api/auth/signup', {
            method: 'POST',
            body: { email: this.email, password: this.password }
          });
          this.$router.push('/login');
        } catch (error) {
          this.error = error.data?.message || 'Signup failed';
        }
      }
    }
  }
  </script>