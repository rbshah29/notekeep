<template>
  
    <div class="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded">
        {{ error }}
      </div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold mx-auto">Notekeep</h1>
        <button @click="logout" class="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
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
        class="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        +
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
        notes: [],
        showModal: false,
        showEditModal: false,
        selectedNote: null,
        searchQuery: '',
        loading: false,
        error: null
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
      this.fetchNotes();
    },
  };
</script>