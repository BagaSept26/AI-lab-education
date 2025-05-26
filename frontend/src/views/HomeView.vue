<template>
  <div class="space-y-8">
    <section class="text-center py-8 bg-dark-card rounded-xl shadow-2xl p-6">
      <h2 class="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
        {{ texts.welcomeTitle }}
      </h2>
      <p class="text-lg text-gray-300 max-w-2xl mx-auto">
        {{ texts.welcomeSubtitle }}
      </p>
    </section>

    <section>
      <h3 class="text-2xl font-semibold mb-6 text-gray-200">{{ texts.featuresTitle }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Nanti di sini kita loop fitur-fiturnya -->
        <div v-for="feature in features" :key="feature.id"
             class="bg-dark-card p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
             @click="navigateToFeature(feature.path)">
          <div class="flex items-center mb-3">
            <span class="text-3xl mr-4">{{ feature.icon }}</span>
            <h4 class="text-xl font-semibold text-brand-primary">{{ feature.title[languageStore.currentLanguage] }}</h4>
          </div>
          <p class="text-gray-400 text-sm">{{ feature.description[languageStore.currentLanguage] }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const router = useRouter()

const texts = computed(() => ({
  welcomeTitle: {
    id: 'Selamat Datang di AI Lab Education!',
    en: 'Welcome to AI Lab Education!',
    ja: 'AI Lab Education へようこそ！',
  }[languageStore.currentLanguage],
  welcomeSubtitle: {
    id: 'Platform untuk belajar dan bereksperimen dengan AI. Pilih fitur di bawah untuk memulai.',
    en: 'A platform to learn and experiment with AI. Choose a feature below to get started.',
    ja: 'AIを学び、実験するためのプラットフォームです。以下の機能を選んで始めてください。',
  }[languageStore.currentLanguage],
  featuresTitle: {
    id: 'Fitur Unggulan Kami',
    en: 'Our Featured Tools',
    ja: '主な機能',
  }[languageStore.currentLanguage],
}))

// Placeholder untuk fitur. Nanti kita isi dengan data sebenarnya.
const features = ref([
  {
    id: 'persona-chat',
    icon: '💬',
    title: { id: 'PersonaChat', en: 'PersonaChat', ja: 'ペルソナチャット' },
    description: {
      id: 'Ngobrol sama AI dengan berbagai persona.',
      en: 'Chat with AI in various personas.',
      ja: '様々なペルソナのAIとチャット。'
    },
    path: '/persona-chat' // Contoh path, akan dibuat nanti
  },
  {
    id: 'whisper-transcriber',
    icon: '🎙️',
    title: { id: 'Transkripsi Audio', en: 'Audio Transcriber', ja: '音声文字起こし' },
    description: {
      id: 'Ubah rekaman suara jadi teks.',
      en: 'Convert audio recordings to text.',
      ja: '音声録音をテキストに変換します。'
    },
    path: '/whisper-transcriber'
  },
  {
    id: 'soal-generator',
    icon: '📝',
    title: { id: 'Pembuat Soal', en: 'Quiz Generator', ja: '問題ジェネレーター' },
    description: {
      id: 'Bikin soal otomatis dari materi.',
      en: 'Generate quizzes from your materials.',
      ja: '教材から自動で問題を作成します。'
    },
    path: '/quiz-generator'
  },
  // Tambahkan fitur lainnya di sini nanti
])

const navigateToFeature = (featureItem) => {
  if (featureItem.path) {
    // Untuk saat ini, kita hanya log saja karena rutenya belum ada
    console.log(`Navigasi ke: ${featureItem.path}`);
    // Jika rute sudah ada, gunakan:
    // router.push(path);
    router.push(featureItem.path);
  } else {
    alert('Fitur ini belum tersedia.');
    console.warn(`path tidak ditemukan untuk fitur: ${featureItem.id}`);
  }
}
</script>