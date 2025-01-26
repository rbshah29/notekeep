<template>
  
    <div class="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded">
        {{ error }}
      </div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold mx-auto">Notekeep</h1>
        <div>
          <button @click="showDropdown = !showDropdown" class="absolute top-6 right-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div v-if="showDropdown" class="absolute right-0 mt-6 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <div class="m-2">
              <div class="user-info">
                <h2 class="flex">
                  <div>
                    Hello,&nbsp;
                  </div>  
                  <div class="flex font-bold text-orange-300">
                    {{ userName }}
                  </div>
                </h2>
                <p class="text-sm text-gray-600">Member since: {{ formatDate(userCreatedAt) }}</p>
              </div>
                <button @click="logout" class="mt-3  w-full px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-red-500 dark:hover:bg-red-700 flex items-center justify-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8m4-9l-4-4m4 4l-4 4m4-4H9"/></svg>
                </div> 
                </button>
            </div>
          </div>
        </div>

      </div>
      <input
        v-model="searchQuery"
        placeholder="Search notes..."
        class="p-2 w-full border rounded mb-4 dark:bg-gray-700 dark:text-white"
      />
  
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <NoteCard
          v-for="note in filteredNotes"
          :key="note._id"
          :note="note"
          @edit-note="editNote"
          @refresh-notes="fetchNotes"
        />
  
        <div v-if="filteredNotes.length === 0" class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'No notes found matching your search' : 'No notes yet. Create your first note!' }}
        </div>
      </div>
  
      <button
        @click="showModal = true"
        class="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-md shadow-lg hover:bg-blue-600 transition-colors"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><rect width="36" height="36" x="6" y="6" rx="3"/><path stroke-linecap="round" d="M24 16v16m-8-8h16"/></g></svg>
      </button>
  
      <AddNoteModal
        :show-modal="showModal"
        @refresh-notes="fetchNotes"
        @close-modal="() => (showModal = false)"
      />
      <EditNoteModal
        :show="showEditModal"
        :note="selectedNote"
        @close="closeEditModal"
        @refresh-notes="fetchNotes"
      />
    </div>
</template>
  
  
<script>
  import NoteCard from '~/components/NoteCard.vue';
  import AddNoteModal from '~/components/AddNoteModal.vue';
  import EditNoteModal from '~/components/EditNoteModal.vue';

  import axios from 'axios';
  
  
  export default {
    middleware: ['auth'],
    components: { NoteCard, AddNoteModal,  EditNoteModal },
    
    data() {
      return {
        showDropdown: false,
        notes: [],
        showModal: false,
        showEditModal: false,
        selectedNote: null,
        searchQuery: '',
        loading: false,
        error: null,
        userName: '',
        userEmail: '',
        userCreatedAt: ''
      };

    },
    
    computed: {
      filteredNotes() {
        if (!this.searchQuery) return this.notes;
        
        const query = this.searchQuery.toLowerCase();
        return this.notes.filter(note => 
          note.title?.toLowerCase().includes(query) ||
          note.content?.toLowerCase().includes(query)
        );
      },
    },
    
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      },
      async fetchUserDetails() {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/auth/user', {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('User details:', response.data);
            this.userName = response.data.name;
            this.userEmail = response.data.email;
            this.userCreatedAt = response.data.createdAt;
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        },
        formatDate(date) {
          return new Date(date).toLocaleDateString();
        },

      async fetchNotes() {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get('/api/notes', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.notes = response.data;
        } catch (error) {
          console.error('Error fetching notes:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            this.$router.push('/login');
          } else {
            this.error = 'Failed to load notes. Please try again later.';
          }
        } finally {
          this.loading = false;
        }
      },
      editNote(note) {
        this.selectedNote = note;
        this.showEditModal = true;
      },
      closeEditModal() {
        this.showEditModal = false;
        this.selectedNote = null;
      }
    },



    mounted() {
      this.fetchUserDetails();
      this.fetchNotes();
    },
  };
</script>