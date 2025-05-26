import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
    const currentLanguage = ref(localStorage.getItem('appLanguage') || 'id') //defualt b.indonesia

    const supportedLanguages = [
        { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩'},
        { code: 'en', name: 'English', flag: '🇬🇧'},
        { code: 'ja', name: '日本語', flag: '🇯🇵'},
    ]

    const setLanguage = (langCode) => {
        if (supportedLanguages.some(lang => lang.code === langCode)) {
            currentLanguage.value = langCode
            localStorage.setItem('appLanguage', langCode) //pilih pilihan bahasa
            // document.documentElement.lang = langCode; //update atribut bahasa pada tag <html>
        }
    }

    const t = (translations) => {
        return computed(() => translations[currentLanguage.value] || translations['en'] || '')
    }
    
    return { currentLanguage, supportedLanguages, setLanguage, t }
})