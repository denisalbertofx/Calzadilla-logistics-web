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
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    // Basic Validation
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) return;

    // Loading State
    const originalText = submitBtn.textContent;
    submitBtn.textContent = currentLang() === 'es' ? 'Enviando...' : 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate submission
    setTimeout(() => {
        submitBtn.textContent = currentLang() === 'es' ? '¡Enviado!' : 'Sent!';
        submitBtn.style.background = '#27c93f';
        submitBtn.style.borderColor = '#27c93f';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
            closeAllModals();
            form.reset();
            submitBtn.textContent = originalText; // Reset text using original
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
        }, 1500);
    }, 1500);
}

function handleCarrierSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = currentLang() === 'es' ? 'Enviando...' : 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        submitBtn.textContent = currentLang() === 'es' ? '¡Enviado!' : 'Sent!';
        submitBtn.style.background = '#27c93f';
        submitBtn.style.borderColor = '#27c93f';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
            closeAllModals();
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
        }, 1500);
    }, 1500);
}

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
});
