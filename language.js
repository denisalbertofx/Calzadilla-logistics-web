// Language Switcher System
let currentLang = localStorage.getItem('language') || 'en';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    setupLanguageSwitcher();
});

function initLanguage() {
    // Detect browser language if no preference saved
    if (!localStorage.getItem('language')) {
        const browserLang = navigator.language.slice(0, 2);
        currentLang = (browserLang === 'es') ? 'es' : 'en';
    }
    applyTranslations(currentLang);
}

function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            switchLanguage(lang);
        });
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyTranslations(lang);

    // Update active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}

// Export for use in other scripts
window.switchLanguage = switchLanguage;
window.currentLang = () => currentLang;
