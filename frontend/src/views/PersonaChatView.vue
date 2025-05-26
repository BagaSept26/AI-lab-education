<template>
  <div class="persona-chat-container p-4 md:p-6 lg:p-8 bg-dark-card rounded-xl shadow-2xl flex flex-col h-[calc(100vh-12rem)] max-h-[700px]">
    <!-- Header Fitur -->
    <div class="mb-6 text-center">
      <h2 class="text-3xl font-bold text-brand-primary">{{ texts.pageTitle }}</h2>
      <p class="text-gray-400">{{ texts.pageSubtitle }}</p>
    </div>

    <!-- Konten Utama PersonaChat -->
    <div class="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
      <!-- Panel Kiri: Pilihan Persona & Kontrol (Eksperimental) -->
      <div class="w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-md flex flex-col space-y-4 overflow-y-auto">
        <div>
          <label for="persona-select" class="block text-sm font-medium text-gray-300 mb-1">{{ texts.selectPersona }}</label>
          <select 
            id="persona-select" 
            v-model="selectedPersona"
            class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5"
          >
            <option disabled value="">{{ texts.choosePersona }}</option>
            <option v-for="persona in availablePersonas" :key="persona.id" :value="persona.id">
              {{ persona.name[languageStore.currentLanguage] || persona.name['en'] }} ({{ persona.description[languageStore.currentLanguage] || persona.description['en'] }})
            </option>
          </select>
        </div>
        
        <div v-if="selectedPersonaDetails" class="mt-4 p-3 bg-gray-700 rounded-md">
          <h4 class="font-semibold text-brand-secondary">{{ selectedPersonaDetails.name[languageStore.currentLanguage] }}</h4>
          <p class="text-xs text-gray-400 italic">{{ selectedPersonaDetails.greeting[languageStore.currentLanguage] }}</p>
        </div>

        <button 
          @click="startNewChat" 
          :disabled="!selectedPersona"
          class="w-full py-2 px-4 bg-brand-primary hover:bg-opacity-80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ texts.startChat }}
        </button>
      </div>

      <!-- Panel Kanan: Area Chat -->
      <div class="w-full md:w-2/3 lg:w-3/4 bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
        <div v-if="!activeChat" class="flex-grow flex items-center justify-center">
          <p class="text-gray-500 italic">{{ texts.selectPersonaPrompt }}</p>
        </div>
        <div v-else class="flex-grow overflow-y-auto mb-4 space-y-3 pr-2 h-full" ref="chatArea">
          <!-- Pesan akan muncul di sini -->
          <div v-for="(message, index) in chatMessages" :key="index" 
               :class="['flex', message.sender === 'user' ? 'justify-end' : 'justify-start']">
            <div 
              :class="[
                'max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow',
                message.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
              ]"
            >
              <p class="text-sm">{{ message.text }}</p>
              <p class="text-xs opacity-70 mt-1 text-right">{{ message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            </div>
          </div>
        </div>

        <!-- Input Pesan -->
        <div v-if="activeChat" class="mt-auto pt-4 border-t border-gray-700">
          <form @submit.prevent="sendMessage" class="flex gap-3">
            <input 
              type="text" 
              v-model="userInput"
              :placeholder="texts.typeMessagePlaceholder"
              class="flex-grow bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
              :disabled="isSending"
            />
            <button 
              type="submit"
              :disabled="!userInput.trim() || isSending"
              class="py-2.5 px-5 bg-brand-secondary hover:bg-opacity-80 text-dark-bg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSending ? texts.sending : texts.send }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useLanguageStore } from '@/stores/language';

const languageStore = useLanguageStore();
const chatArea = ref(null);

const texts = computed(() => ({
    pageTitle: {
        id: 'PersonaChat',
        en: 'PersonaChat',
        ja: 'ペルソナチャット'
    }[languageStore.currentLanguage],
    pageSubtitle: {
        id: 'Ngobrol dengan AI yang memiliki kepribadian berbeda',
        en: 'Chat AI personalities',
        ja: '様々な個性を持つAIと会話しましょう。'
    }[languageStore.currentLanguage],
    selectPersona:{
        id: '--- Pilih Karakter ---',
        en: '---Choose a Character ---',
        ja: '--- キャラクターを選択 ---'
    }[languageStore.currentLanguage],
    startChat:{
        id: 'Mulai Obrolan Baru',
        en: 'Start New Chat',
        ja: '新しいチャットを開始'
    }[languageStore.currentLanguage],
    selectPersonaPrompt:{
        id: 'Pilih Persona dan mulai obrolan untuk melihat pesan.',
        en: 'Select a persona and start a chat to see message.',
        ja: 'ペルソナを選択してチャットを開始するとメッセージが表示されます。'
    }[languageStore.currentLanguage],
    typeMessagePlaceholder:{
        id: 'Ketik pesan di sini ...',
        en: 'Type your message here...',
        ja: 'ここにメッセージを入力してください...'
    }[languageStore.currentLanguage],
    send:{
        id: 'Kirim',
        en: 'Send',
        ja: '送信'
    }[languageStore.currentLanguage],
    sending:{
        id: 'Mengirim...',
        en: 'Sending...',
        ja: '送信中...'
    }[languageStore.currentLanguage],
}));

const availablePersonas = ref([
    {
        id: 'guru-jepang',
        name: {
            id: 'Guru Bahasa Jepang',
            en: 'Japanese Teacher',
            ja: '日本語教師'
        },
        description:{
            id: 'Sensei ramah',
            en: 'Friendly Sense',
            ja: '優しい先生'
        },
        greeting:{
            id: 'Konnichiwa! Ada yang bisa saya bantu hari ini ?',
            en: 'Konnichiwa! How can i help you today?',
            ja: 'こんにちは！今日は何をお手伝いしましょうか？'
        }
    },
    {
        id: 'mentor-python',
        name: {
            id: 'Mentor Python',
            en: 'Python Mentor',
            ja: 'Pythonメンター'
        },
        description:{
            id: 'Ahli coding',
            en: 'Coding expert',
            ja: 'コーディング専門家'
        },
        greeting:{
            id: 'Hello! Ready to debug some Python code or learn something new?',
            en: 'Hello! Ready to debug some Python code or learn something new?',
            ja: 'こんにちは！Pythonのコードをデバッグしたり、何か新しいことを学ぶ準備はできていますか？'
        }
    },
    {
        id: 'Ahli Sejarah',
        name: {
            id: 'Ahli Sejarah',
            en: 'History Buff',
            ja: '歴史専門家'
        },
        description:{
            id: 'Penjelajah Waktu',
            en: 'Time Traveler',
            ja: 'タイムトラベラー'
        },
        greeting:{
            id: 'Greetings! What historycal period or event piques your interest?',
            en: 'Greetings! What historycal period or event piques your interest?',
            ja: 'ご挨拶申し上げます！どの歴史時代や出来事に興味がありますか？'
        }
    },
]);

const selectedPersona = ref('');
const activeChat = ref(false); //tanda chat sudah dimulai
const chatMessages = ref([]); //{ sender: 'user/ai', text: '...', timestamp: new Date() }
const userInput = ref('');
const isSending = ref(false);

const selectedPersonaDetails = computed(() => {
    return availablePersonas.value.find(p => p.id === selectedPersona.value);
});

const scrollToBottom = () => {
    nextTick(() => {
        if (chatArea.value) {
            chatArea.value.scrollTop = chatArea.value.scrolHeight;
        }
    });
};
watch(chatMessages, scrollToBottom, { deep:true });

const startNewChat = () => {
    if(!selectedPersona.value) return;
    chatMessages.value = []; //kosongkan chat sebelumnya
    const persona = selectedPersonaDetails.value;
    if (persona) {
        chatMessages.value.push({
            sender: 'ai',
            text: persona.greeting[languageStore.currentLanguage] || persona.greeting['en'],
            timestamp: new Date()
        });
    }
    activeChat.value = true;
    userInput.value = ''; //kosongkan input field
};

const sendMessage = async () => {
    if (!userInput.value.trim() || !activeChat.value) return;

    const messageText = userInput.value;
    chatMessages.value.push({ sender: 'user', text: messageText, timestamp: new Date()});
    userInput.value = '';
    isSending.value = true;

    // --- Placeholder untuk interaksi backend ---
    //panggil API 
    console.log(`Mengirim ke backend: Persona ID: ${selectedPersona.value}, Pesan: ${messageText}`);
    //simulasi balasain dari AI
    await new Promise(resolve => setTimeout(resolve, 1500)); //tunggu 1.5 deting
    const aiResponse = {
        id: 'ai-dummy',
        text: {
            id: `ini balsan dummy "${messageText.substring(0,20)}..." dari ${selectedPersonaDetails.value?.name[languageStore.currentLanguage]}.`,
            en: `This is dummy "${messageText.substring(0,20)}..." from ${selectedPersonaDetails.value?.name['en']}`,
            ja: `「${messageText.substring(0,10)}...」についてのダミー返信です。${selectedPersonaDetails.value?.name['ja']}より。`
        }
    };
    chatMessages.value.push({
        sender: 'ai',
        text: aiResponse.text[languageStore.currentLanguage] || aiResponse.text['en'],
        timestamp: new Date()
    });

    // --- akhir placeholder ---
    isSending.value = false;
};
//reset chat
watch(selectedPersona, (newPersona, oldPersona) => {
    if (newPersona !== oldPersona) {
        //reset status chat aktif
        activeChat.value = false;
        chatMessages.value = []; //kosongkan pesan
    }
});
</script>

<style scoped>

/*.persona-chat-container {
    /* Gaya untuk halaman
    membuat chat area bisa discroll jika lebih tinggi dari area yang tersedia

}*/
/*custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
    background: #4a5568;
    border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #718096;
}
</style>