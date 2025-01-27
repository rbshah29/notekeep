<template>
  <div class="bg-white dark:bg-gray-700 shadow-md p-4 rounded-lg h-60 cursor-pointer hover:shadow-lg transition-shadow relative">
    <div @click="$emit('edit-note', note)" class="">
      <h3 class="text-lg mb-2 font-bold text-stone-400 dark:text-stone-400 truncate">{{ note.title }}</h3>
      <hr class="border-black"/>
      <div class="tags mt-2">
        <span
          v-for="tag in noteTags"
          :key="tag"
          class="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded mr-2"
        >
          {{ tag }}
        </span>
      </div>
      
      <pre class="mt-2 text-gray-700 dark:text-gray-300 overflow-hidden line-clamp-4 font-sans">{{ note.content }}</pre>
    </div>
    <div class="justify-between items-center mt-10">
      <!-- <button @click="deleteNote" class="text-red-600 mt-36 px-4 py-2 rounded absolute bottom-2 right-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </button>
      <button @click="showShareModal = true" class="text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </button> -->
  
      <div class="flex justify-between items-center absolute bottom-2 right-2">
        <button v-if="isOwner" @click.stop="deleteNote" class="text-red-600 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
        
        <button v-if="isOwner" @click.stop="showShareModal = true" class="text-blue-500 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
  
        <span v-if="!isOwner" class="text-sm text-gray-500">
          ({{ note.userPermission }})
        </span>
      </div>
  
      <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showShareModal = false">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold dark:text-white">Share Note</h3>
            <button @click="showShareModal = false" class="text-gray-500">&times;</button>
          </div>
  
          <div class="mb-4">
            <input 
              v-model="newCollaboratorEmail" 
              type="email" 
              placeholder="Enter email"
              class="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
            >
            <div class="flex gap-2">
              <select 
                v-model="newCollaboratorPermission" 
                class="p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
              <button 
                @click="addCollaborator" 
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Share
              </button>
            </div>
          </div>
  
          <div v-if="shareError" class="text-red-500 mb-4">
            {{ shareError }}
          </div>
  
          <div class="space-y-2">
            <div v-for="collab in note.collaborators" :key="collab.email" 
                 class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div>
                <span class="dark:text-white">{{ collab.email }}</span>
                <span class="text-sm text-gray-500">({{ collab.permission }})</span>
              </div>
              <button 
                @click="removeCollaborator(collab.email)" 
                class="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  

<script>
import axios from 'axios';

export default {
    props: {
      note: {
        type: Object,
        required: true,
      },
      uniqueTags: {
        type: Array,
        required: true,
      },
      noteTags: {
        type: Array,
        required: true,
      },
    },
  data() {
    return {
      showShareModal: false,
      newCollaboratorEmail: '',
      newCollaboratorPermission: 'view',
      shareError: null
    }

  },
  computed: {
    isOwner() {
      return this.note.userPermission === 'owner';
    },
    canEdit() {
      return this.isOwner || this.note.userPermission === 'edit';
    }
  },

  methods: {
    handleNoteClick() {
      if (this.canEdit) {
        console.log("Edit note");
        this.$emit('edit-note', this.note);
      }
    },
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
    },
    async addCollaborator() {
      try {
        this.shareError = null;
        const token = localStorage.getItem('token');
        await axios.post(`/api/notes/${this.note._id}/collaborators`, {
          email: this.newCollaboratorEmail,
          permission: this.newCollaboratorPermission
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$emit('refresh-notes');
        this.newCollaboratorEmail = '';
      } catch (error) {
        this.shareError = error.response?.data?.message || 'Failed to share note';
        console.error('Error adding collaborator:', error);
      }
    },
    async removeCollaborator(email) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/notes/${this.note._id}/collaborators/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$emit('refresh-notes');
      } catch (error) {
        console.error('Error removing collaborator:', error);
      }
    }
  }

};
</script>