<template>
  <div class="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ note.title }}</h3>
    <p class="text-gray-700 dark:text-gray-300">{{ note.content }}</p>
    <button @click="deleteNote(note._id)" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">    
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
      </svg>
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['note'],
  methods: {
    async deleteNote(id) {
      try {
        await axios.delete(`/api/notes?id=${id}`);
        this.$emit('refresh-notes');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    },
  },
};
</script>