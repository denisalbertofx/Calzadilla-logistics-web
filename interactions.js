document.addEventListener('DOMContentLoaded', () => {
    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');

    // Simulate loading time (or wait for window load)
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                startCounters(); // Start counters after loading
            }, 500);
        }, 1500); // Minimum 1.5s load time for effect
    });

    // --- Number Counters ---
    const stats = document.querySelectorAll('.stat-num');
    let started = false;

    function startCounters() {
        if (started) return;
        started = true;

        stats.forEach(stat => {
            const targetText = stat.innerText;
            const isPercent = targetText.includes('%');
            const isTime = targetText.includes('/');

            if (isTime) return; // Skip 24/7 for now or handle differently

            const target = parseFloat(targetText);
            let current = 0;
            const increment = target / 50; // 50 steps

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.innerText = current.toFixed(1) + (isPercent ? '%' : '');
            }, 30);
        });
    }

    // --- Form Feedback ---
    const form = document.querySelector('.neon-form');
    const emailInput = form.querySelector('input');
    const submitBtn = form.querySelector('button');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (emailInput.value.trim() === '') return;

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sent!';
        submitBtn.style.background = '#27c93f'; // Green
        submitBtn.style.color = '#fff';
        submitBtn.style.borderColor = '#27c93f';
        submitBtn.style.boxShadow = '0 0 20px #27c93f';

        emailInput.value = '';

        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.boxShadow = '';
        }, 3000);
    });
});
