// Mobile detection and performance optimization
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
let totalParticles = isMobile ? 20 : 50;
const particleSize = isMobile ? 2 : 3;

// Logo Animation Script
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');
    const particlesContainer = document.getElementById('particles');
    let animationId;
    let isAnimating = true;
    let rotationAngle = 0;
    let opacity = 1;
    let scale = 1;
    let bounceFactor = 0;
    let lastTime = 0;
    const animationDuration = 6000; // 6 second rotation

    // Gold color variations
    const goldColors = [
        '#D4AF37', // Primary gold
        '#FFD700', // Bright gold
        '#F5D76E', // Light gold
        '#E6C200', // Deep gold
        '#FFDF00'  // Vivid gold
    ];

    // Create particle system
    const particles = [];
    for (let i = 0; i < totalParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size with some larger ones
        const size = i % 20 === 0 ? 
            6 + Math.random() * 6 : // 5% chance for larger particles
            1 + Math.random() * 4;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random gold color variation
        const goldColor = goldColors[Math.floor(Math.random() * goldColors.length)];
        particle.style.background = `radial-gradient(circle at center, ${goldColor} 0%, ${goldColor}00 100%)`;
        
        // Position randomly in the container
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
        
        particles.push({
            element: particle,
            size: size,
            baseX: Math.random() * window.innerWidth,
            baseY: Math.random() * window.innerHeight,
            speed: 0.2 + Math.random() * 0.8,
            angle: Math.random() * Math.PI * 2,
            distance: 10 + Math.random() * 80,
            life: 0,
            maxLife: 3000 + Math.random() * 5000,
            color: goldColor
        });
    }

    // Simplified particle animation for mobile
    function animateParticles(timestamp) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        particles.forEach(particle => {
            particle.life += 16; // ~60fps
            
            if (particle.life > particle.maxLife) {
                // Reset particle with new gold color
                particle.life = 0;
                particle.baseX = Math.random() * window.innerWidth;
                particle.baseY = Math.random() * window.innerHeight;
                particle.distance = 10 + Math.random() * 80;
                particle.color = goldColors[Math.floor(Math.random() * goldColors.length)];
                particle.element.style.background = `radial-gradient(circle at center, ${particle.color} 0%, ${particle.color}00 100%)`;
            }
            
            const lifeProgress = particle.life / particle.maxLife;
            const waveFactor = Math.sin(lifeProgress * Math.PI * 2) * 0.5 + 0.5;
            
            // Calculate position with gentle movement
            const moveX = Math.cos(particle.angle + lifeProgress * Math.PI) * 
                          particle.distance * waveFactor;
            const moveY = Math.sin(particle.angle + lifeProgress * Math.PI) * 
                          particle.distance * waveFactor;
            
            // Apply movement with parallax effect (reduced on mobile)
            const parallaxFactor = isMobile ? 0.02 : 0.05;
            const parallaxX = (particle.baseX - centerX) * parallaxFactor * waveFactor;
            const parallaxY = (particle.baseY - centerY) * parallaxFactor * waveFactor;
            
            particle.element.style.transform = `translate(${moveX + parallaxX}px, ${moveY + parallaxY}px)`;
            
            // Fade in/out based on life cycle
            if (lifeProgress < 0.1) {
                particle.element.style.opacity = lifeProgress * 10;
            } else if (lifeProgress > 0.9) {
                particle.element.style.opacity = (1 - lifeProgress) * 10;
            } else {
                particle.element.style.opacity = isMobile ? 0.5 * waveFactor : 0.7 * waveFactor;
            }
            
            // Scale slightly
            particle.element.style.width = `${particle.size * (0.8 + waveFactor * 0.3)}px`;
            particle.element.style.height = particle.element.style.width;
        });
    }

    // Main animation function
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        lastTime = timestamp;

        if (isAnimating) {
            const progress = (timestamp % animationDuration) / animationDuration;
            
            // Slow rotation
            rotationAngle = progress * 360;
            
            // Gradual fade
            opacity = 1 - Math.pow(Math.abs(Math.sin(progress * Math.PI)), 0.5);
            
            // Subtle scale changes
            scale = 0.95 + (0.1 * Math.abs(Math.sin(progress * Math.PI * 2)));
            
            // Gentle bounce effect
            if (progress > 0.9) {
                bounceFactor = Math.sin((progress - 0.9) * Math.PI * 2 / 0.1) * 0.05;
                scale += bounceFactor;
            }
            
            // Apply transformations with smooth easing
            logo.style.transform = `
                perspective(${isMobile ? 1000 : 1500}px)
                rotateX(${rotationAngle}deg)
                scale(${scale})
            `;
            logo.style.opacity = opacity;
        }
        
        // Always animate particles (even when logo is paused)
        animateParticles(timestamp);
        
        animationId = requestAnimationFrame(animate);
    }

    // Handle window resize
    function handleResize() {
        particles.forEach(particle => {
            particle.baseX = Math.random() * window.innerWidth;
            particle.baseY = Math.random() * window.innerHeight;
        });
    }

    window.addEventListener('resize', handleResize);

    // Start animation
    animationId = requestAnimationFrame(animate);

    // Toggle animation on click
    logo.addEventListener('click', function() {
        isAnimating = !isAnimating;
        if (isAnimating) {
            lastTime = 0; // Reset animation timing
        }
    });

    // Night/Day Mode Toggle
    const modeToggle = document.getElementById('modeToggle');
    const body = document.body;
    const icon = modeToggle.querySelector('i');

    // Check for saved user preference
    if (localStorage.getItem('nightMode') === 'enabled') {
        body.classList.add('night-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        modeToggle.textContent = ' Day Mode';
        modeToggle.insertBefore(icon, modeToggle.firstChild);
    }

    modeToggle.addEventListener('click', () => {
        body.classList.toggle('night-mode');
        
        if (body.classList.contains('night-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            modeToggle.textContent = ' Day Mode';
            localStorage.setItem('nightMode', 'enabled');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            modeToggle.textContent = ' Night Mode';
            localStorage.setItem('nightMode', 'disabled');
        }
        
        modeToggle.insertBefore(icon, modeToggle.firstChild);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .about-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .about-content').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});

// Video Slider Functionality
const sliderContainer = document.querySelector('.video-slider-container');
const slides = document.querySelectorAll('.video-slide');
const videos = document.querySelectorAll('.video-slide video');
const dots = document.querySelectorAll('.nav-dot');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const loadingOverlay = document.querySelector('.loading-overlay');
const progressBar = document.querySelector('.progress');

let currentIndex = 0;
let isAutoPlaying = true;
let isUserInteracted = false;
const slideCount = slides.length;
let autoPlayInterval;

// Initialize the slider
function initSlider() {
    setupVolumeControls();
    
    // Set all videos to contain mode
    videos.forEach(video => {
        video.style.objectFit = 'cover';
    });
    
    // Start with first video
    playVideo(currentIndex);
    
    // Start autoplay
    startAutoPlay();
    
    // Add event listeners to videos
    videos.forEach((video, index) => {
        // When video ends, go to next slide
        video.addEventListener('ended', function() {
            if (isAutoPlaying && !isUserInteracted) {
                goToNextSlide();
            }
        });
        
        // Show loading when video is buffering
        video.addEventListener('waiting', function() {
            if (index === currentIndex) {
                showLoading();
            }
        });
        
        video.addEventListener('playing', function() {
            hideLoading();
        });
        
        // Update progress bar
        video.addEventListener('timeupdate', function() {
            if (index === currentIndex) {
                const percent = (video.currentTime / video.duration) * 100;
                progressBar.style.width = percent + '%';
            }
        });
    });
    
    // Add click event to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            isUserInteracted = true;
            const targetIndex = parseInt(this.getAttribute('data-index'));
            goToSlide(targetIndex);
        });
    });
    
    // Add click event to arrows
    arrowLeft.addEventListener('click', function() {
        isUserInteracted = true;
        goToPrevSlide();
    });
    
    arrowRight.addEventListener('click', function() {
        isUserInteracted = true;
        goToNextSlide();
    });
    
    // Add click event to slides to pause/play video
    slides.forEach((slide, index) => {
        slide.addEventListener('click', function(e) {
            // Don't trigger if clicking on content or controls
            if (e.target.closest('.slide-content') || e.target.closest('.video-controls')) return;
            
            isUserInteracted = true;
            const video = slide.querySelector('video');
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
}

function startAutoPlay() {
    clearInterval(autoPlayInterval);
    if (isAutoPlaying && !isMobile) { // Disable autoplay on mobile
        autoPlayInterval = setInterval(() => {
            if (!isUserInteracted) {
                goToNextSlide();
            }
        }, 8000); // Change slide every 8 seconds
    }
}

// Volume controls functionality
function setupVolumeControls() {
    const volumeBtns = document.querySelectorAll('.volume-btn');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    
    volumeBtns.forEach((btn, index) => {
        const video = videos[index];
        const volumeSlider = btn.nextElementSibling;
        
        // Initialize volume
        video.volume = 1;
        
        // Mute/unmute toggle
        btn.addEventListener('click', () => {
            video.muted = !video.muted;
            updateVolumeIcon(btn, video);
        });
        
        // Volume slider change
        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value;
            video.muted = false;
            updateVolumeIcon(btn, video);
        });
        
        // Update icon based on initial state
        updateVolumeIcon(btn, video);
    });
}

function updateVolumeIcon(btn, video) {
    const icon = btn.querySelector('i');
    if (video.muted || video.volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (video.volume > 0.5) {
        icon.className = 'fas fa-volume-up';
    } else {
        icon.className = 'fas fa-volume-down';
    }
}

function playVideo(index) {
    // Pause all videos first
    videos.forEach(video => video.pause());
    
    // Play the current video
    videos[index].currentTime = 0;
    videos[index].play().catch(e => {
        console.error("Video play failed:", e);
        showLoading();
    });
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
    progressBar.style.width = '0%';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Go to specific slide
function goToSlide(index) {
    // Pause current video
    videos[currentIndex].pause();
    
    // Update current index
    currentIndex = index;
    
    // Update slider position
    updateSlider();
    
    // Play new video
    playVideo(currentIndex);
    
    // Reset autoplay timer
    startAutoPlay();
}

// Go to next slide
function goToNextSlide() {
    const nextIndex = (currentIndex + 1) % slideCount;
    goToSlide(nextIndex);
}

// Go to previous slide
function goToPrevSlide() {
    const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
    goToSlide(prevIndex);
}

// Update slider position and UI
function updateSlider() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100 / slideCount}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    
    // Update active slide
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
        if (index === currentIndex) {
            slide.querySelector('.slide-content').style.opacity = '1';
            slide.querySelector('.slide-content').style.transform = isMobile ? 
                'translateX(-50%) translateY(0)' : 'translateY(0)';
        } else {
            slide.querySelector('.slide-content').style.opacity = '0';
            slide.querySelector('.slide-content').style.transform = isMobile ? 
                'translateX(-50%) translateY(20px)' : 'translateY(20px)';
        }
    });
}

// Initialize the slider
initSlider();

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        isUserInteracted = true;
        goToNextSlide();
    } else if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        isUserInteracted = true;
        goToPrevSlide();
    }
}