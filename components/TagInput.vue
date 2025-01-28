# TagInput.vue
<template>
  <div class="mb-4">
    <label class="block text-gray-700 dark:text-gray-300 mb-2">Tags</label>
    <div class="relative">
      <!-- Tag Input Container -->
      <div class="flex flex-wrap p-2 border rounded dark:bg-gray-700 min-h-[42px] bg-white">
        <!-- Existing Tags -->
        <span
          v-for="(tag, index) in modelValue"
          :key="index"
          class="bg-blue-500 text-white px-2 py-1 rounded mr-2 mb-2 flex items-center"
        >
          {{ tag }}
          <button
            v-if="!readonly"
            @click="removeTag(index)"
            class="ml-1 text-white hover:text-blue-200"
          >
            ×
          </button>
        </span>
        
        <!-- Input Field -->
        <input
          v-model="newTag"
          :readonly="readonly"
          @input="handleInput"
          @keyup.enter="addTag"
          @keydown.backspace="handleBackspace"
          @focus="handleFocus"
          ref="inputRef"
          placeholder="Add a tag and press Enter"
          class="flex-grow outline-none bg-transparent dark:text-white py-1"
        >
      </div>

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border rounded-md shadow-lg max-h-48 overflow-y-auto"
      >
        <div
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagInput',
  
  props: {
    modelValue: {
      type: Array,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    existingTags: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      newTag: '',
      showSuggestions: false,
      filteredSuggestions: []
    }
  },

  methods: {
    handleInput() {
      // Filter suggestions based on input
      this.filteredSuggestions = this.existingTags.filter(tag => 
        tag.toLowerCase().includes(this.newTag.toLowerCase()) &&
        !this.modelValue.includes(tag)
      );
      // Keep showing suggestions even if input is empty
      this.showSuggestions = true;
    },

    addTag() {
      const tag = this.newTag.trim();
      if (tag && !this.modelValue.includes(tag)) {
        this.$emit('update:modelValue', [...this.modelValue, tag]);
        this.newTag = '';
        this.showSuggestions = false;
      }
    },

    removeTag(index) {
      const newTags = [...this.modelValue];
      newTags.splice(index, 1);
      this.$emit('update:modelValue', newTags);
    },

    selectSuggestion(tag) {
      if (!this.modelValue.includes(tag)) {
        this.$emit('update:modelValue', [...this.modelValue, tag]);
        this.newTag = '';
        this.showSuggestions = false;
      }
    },

    handleBackspace(e) {
      if (this.newTag === '' && this.modelValue.length > 0 && e.target.selectionStart === 0) {
        this.removeTag(this.modelValue.length - 1);
      }
    },

    handleFocus() {
      // Show all available tags that aren't already selected
      this.filteredSuggestions = this.existingTags.filter(tag => 
        !this.modelValue.includes(tag)
      );
      this.showSuggestions = true;
    }
  },

  mounted() {
    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showSuggestions = false;
      }
    });
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>