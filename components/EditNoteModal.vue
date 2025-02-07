<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto">
      <div class="flex mb-3">
        <div class="flex-grow">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Update your note....</h2>
        </div>
        <div class="flex justify-end mb-3">
          <button @click="closeModal" class="px-4 py-2 rounded text-black dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m15.5 15.5l-10-10zm0-10l-10 10"/></svg>
        </button>
        </div>
      </div>

      <input 
        v-model="editedNote.title" 
        :readonly="!canEdit"
        class="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white text-xl font-bold"
      >
      <textarea 
        v-model="editedNote.content"
        :readonly="!canEdit"
        class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white font-mono min-h-[200px]"
      ></textarea>

      <TagInput
        v-model="editedNote.tags"
        :existing-tags="existingTags"
        :readonly="!canEdit"
      />

      <div class="mt-4 flex justify-end space-x-2">
        
        <button @click="saveEdit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
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
        content: '',
        tags: []
      },
      newTag: '',
      existingTags: []
    };
  },

  computed: {
    isOwner() {
      return this.note.userPermission === 'owner';
    },
    
    canEdit() {
      console.log(this.isOwner);
      console.log(this.note.userPermission);
      if (this.isOwner)
      {
        return true;
      }
      else if (this.note.userPermission === 'edit')
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  },

  watch: {
    note: {
      immediate: true,
      handler(newNote) {
        if (newNote) {
          this.editedNote = { 
            ...newNote,
            tags: newNote.tags || []
          };
        }
      }
    }
  },

  methods: {
    async saveEdit() {
      console.log("this.editedNote");
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/notes?id=${this.note._id}`, this.editedNote, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.$emit('refresh-notes');
        this.$emit('refresh-tags');
        this.$emit('close');
      } catch (error) {
        console.error('Error updating note:', error);
        this.error = error.response?.data?.message || 'Failed to update note';
      }
    },
    closeModal() {
      this.$emit('close');
    },
    addTag() {
    if (this.newTag.trim() !== '') {
      this.editedNote.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  },
  removeTag(index) {
    this.editedNote.tags.splice(index, 1);
  },
  async fetchTags() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tags', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.existingTags = response.data;
      console.log('Existing tags:', this.existingTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }
  },
  mounted() {
    this.fetchTags();
  }

};
</script>