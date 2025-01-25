<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto">
      <input 
        v-model="editedNote.title" 
        class="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white text-xl font-bold"
      >
      <textarea 
        v-model="editedNote.content"
        class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white font-mono min-h-[200px]"
      ></textarea>
      <div class="mt-4 flex justify-end space-x-2">
        
        <button @click="saveEdit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button @click="closeModal" class="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded text-black dark:text-white">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    show: Boolean,
    note: Object
  },
  data() {
    return {
      editedNote: {
        title: '',
        content: ''
      }
    };
  },
  watch: {
    note: {
      immediate: true,
      handler(newNote) {
        if (newNote) {
          this.editedNote = { ...newNote };
        }
      }
    }
  },
  methods: {
    async saveEdit() {
      try {
        await axios.put(`/api/notes?id=${this.note._id}`, this.editedNote);
        this.$emit('refresh-notes');
        this.closeModal();
      } catch (error) {
        console.error('Error updating note:', error);
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>