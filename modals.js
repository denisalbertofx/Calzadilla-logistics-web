// Modal System
document.addEventListener('DOMContentLoaded', () => {
    setupModals();
});

function setupModals() {
    // Get all modal triggers
    const quoteBtn = document.querySelectorAll('[data-modal="quote"]');
    const carrierBtn = document.querySelectorAll('[data-modal="carrier"]');
    const techBtn = document.querySelectorAll('[data-modal="tech"]');

    quoteBtn.forEach(btn => btn.addEventListener('click', () => openModal('quote')));
    carrierBtn.forEach(btn => btn.addEventListener('click', () => openModal('carrier')));
    techBtn.forEach(btn => btn.addEventListener('click', () => openModal('tech')));

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Click outside to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAllModals();
        });
    });

    // Form submissions
    document.getElementById('quote-form')?.addEventListener('submit', handleQuoteSubmit);
    document.getElementById('carrier-form')?.addEventListener('submit', handleCarrierSubmit);
}

function openModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function handleQuoteSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Simulate submission
    submitBtn.textContent = currentLang() === 'es' ? '¡Enviado!' : 'Sent!';
    submitBtn.style.background = '#27c93f';

    setTimeout(() => {
        closeAllModals();
        form.reset();
        submitBtn.textContent = translations[currentLang()]['modal.quote.submit'];
        submitBtn.style.background = '';
    }, 2000);
}

function handleCarrierSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.textContent = currentLang() === 'es' ? '¡Enviado!' : 'Sent!';
    submitBtn.style.background = '#27c93f';

    setTimeout(() => {
        closeAllModals();
        form.reset();
        submitBtn.textContent = translations[currentLang()]['modal.carrier.submit'];
        submitBtn.style.background = '';
    }, 2000);
}

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
});
