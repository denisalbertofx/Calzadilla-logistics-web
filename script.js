const card = document.getElementById('holographic-card');
const heroSection = document.getElementById('hero');

// Moving Animation Event
heroSection.addEventListener('mousemove', (e) => {
    // Calculate center of the hero section or window
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Animate In
heroSection.addEventListener('mouseenter', (e) => {
    card.style.transition = 'none';
    // Popout
    card.querySelector('.title').style.transform = 'translateZ(50px)';
    card.querySelector('.avatar-container').style.transform = 'translateZ(50px)';
    card.querySelector('.description').style.transform = 'translateZ(40px)';
    card.querySelector('.cta-button').style.transform = 'translateZ(40px)';
});

// Animate Out
heroSection.addEventListener('mouseleave', (e) => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    // Popback
    card.querySelector('.title').style.transform = 'translateZ(30px)';
    card.querySelector('.avatar-container').style.transform = 'translateZ(20px)';
    card.querySelector('.description').style.transform = 'translateZ(20px)';
    card.querySelector('.cta-button').style.transform = 'translateZ(40px)';
});
