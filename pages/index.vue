<template>
    <div class="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded">
        {{ error }}
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
    </div>
</template>
  
  
  <script>
  import NoteCard from '~/components/NoteCard.vue';
  import AddNoteModal from '~/components/AddNoteModal.vue';
  import axios from 'axios';
  
  export default {
    components: { NoteCard, AddNoteModal },
    
    data() {
      return {
        notes: [],
        showModal: false,
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
      async fetchNotes() {
        this.loading = true;
        this.error = null;
        
        try {
          const response = await axios.get('/api/notes');
          this.notes = response.data;
        } catch (error) {
          console.error('Error fetching notes:', error);
          this.error = 'Failed to load notes. Please try again later.';
        } finally {
          this.loading = false;
        }
      },
    },
    
    mounted() {
      this.fetchNotes();
    },
  };
  </script>