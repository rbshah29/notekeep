// NoteCard.vue
<template>
  <div class="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg h-48 flex flex-col cursor-pointer hover:shadow-lg transition-shadow relative">
    <div @click="$emit('edit-note', note)" class="flex-grow">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ note.title }}</h3>
      <pre class="text-gray-700 dark:text-gray-300 overflow-hidden line-clamp-4 font-sans">{{ note.content }}</pre>
    </div>
    <button @click="deleteNote" class="text-red-600 px-4 py-2 rounded absolute bottom-2 right-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['note'],
  methods: {
    async deleteNote() {
      if (confirm('Are you sure you want to delete this note?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/api/notes?id=${this.note._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.$emit('refresh-notes');
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      }
    }
  }
};
</script>