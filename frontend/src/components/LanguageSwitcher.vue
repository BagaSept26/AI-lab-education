<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="flex items-center px-3 py-2 bg-dark-card hover:bg-gray-700 rounded-md transition-colors">
      <span>{{ currentLangObject?.flag }}</span>
      <span class="ml-2 hidden sm:inline">{{ currentLangObject?.name }}</span>
      <svg class="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-dark-card rounded-md shadow-lg py-1 z-50">
        <a
          v-for="lang in languageStore.supportedLanguages"
          :key="lang.code"
          @click.prevent="selectLanguage(lang.code)"
          href="#"
          :class="[
            'block px-4 py-2 text-sm hover:bg-gray-700',
            languageStore.currentLanguage === lang.code ? 'text-brand-primary font-semibold' : 'text-dark-text'
          ]"
        >
          {{ lang.flag }} {{ lang.name }}
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const isOpen = ref(false)

const currentLangObject = computed(() => {
  return languageStore.supportedLanguages.find(lang => lang.code === languageStore.currentLanguage)
})

const selectLanguage = (langCode) => {
  languageStore.setLanguage(langCode)
  isOpen.value = false
}

// Close dropdown if clicked outside
const closeDropdown = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false;
  }
};

// Lifecycle hooks for event listener
import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>