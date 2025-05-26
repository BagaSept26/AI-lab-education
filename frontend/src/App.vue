<template>
  <div id="app-container" class="min-h-screen bg-dark-bg text-dark-text flex flex-col">
    <header class="bg-dark-card shadow-lg sticky top-0 z-40">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center">
          <img alt="AI Lab Logo" class="h-8 w-auto mr-2" src="" /> <!-- Ganti dengan logo kamu nanti -->
          <h1 class="text-xl font-bold text-brand-primary hover:text-brand-secondary transition-colors">
            ai-lab-education
          </h1>
        </RouterLink>
        <LanguageSwitcher />
      </nav>
    </header>

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="bg-dark-card text-center py-4 text-sm text-gray-400">
      © {{ new Date().getFullYear() }} ai-lab-education. Dibuat dengan ❤️ dan AI.
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useLanguageStore } from '@/stores/language'
import { watchEffect } from 'vue';

const languageStore = useLanguageStore();

// Update HTML lang attribute whenever language changes
watchEffect(() => {
  document.documentElement.lang = languageStore.currentLanguage;
});

// Buat file icon.svg di folder `frontend/public/`
// Contoh isi icon.svg (SVG sederhana, bisa diganti dengan logo yang lebih baik)
/*
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
  <circle cx="50" cy="50" r="45" fill="#4A90E2"/>
  <path d="M30 70 Q 50 90 70 70 Q 50 50 30 70 Z" fill="#FFFFFF"/>
  <path d="M35 35 Q 50 20 65 35 L 50 60 Z" fill="#50E3C2"/>
</svg>
*/
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>