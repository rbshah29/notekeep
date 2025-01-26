<template>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center dark:bg-opacity-75">
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-2/3">

        <div class="flex mb-3">
          <div class="flex-grow">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Take a note....</h2>
          </div>
          <div class="flex justify-end mb-3">
            <button @click="closeModal" class="px-4 py-2 rounded text-black dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m15.5 15.5l-10-10zm0-10l-10 10"/></svg>
          </button>
          </div>
        </div>
        
        <input v-model="newNote.title" placeholder="Title" class="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white">
        <textarea v-model="newNote.content" placeholder="Content" class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"></textarea>
        <div class="mt-4 flex justify-end">
          <button @click="saveNote" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['showModal'],
    data() {
      return {
        newNote: {
          title: '',
          content: '',
        },
      };
    },
    methods: {


      async saveNote() {
        try {
          const token = localStorage.getItem('token');
          console.log('Sending note:', this.newNote); // Debug log
          const response = await axios.post('/api/notes', this.newNote, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Response:', response.data); // Debug log
          this.$emit('refresh-notes');
          this.$emit('close-modal');
          this.newNote = { title: '', content: '' };
        } catch (error) {
          console.error('Full error:', error);
          this.error = error.response?.data?.message || 'Failed to add note';
        }
      },


      closeModal() {
        this.$emit('close-modal');
      },
    },
  };
  </script>
  