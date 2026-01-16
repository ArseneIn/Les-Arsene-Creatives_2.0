let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slide-dot');
let slideInterval;

function showSlide(index) {
    if (!slides.length) return; // Guard clause if no slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
    resetInterval();
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
    resetInterval();
}

function autoSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 5000);
}

// Start automatic slideshow if slides exist
if (slides.length > 0) {
    slideInterval = setInterval(autoSlide, 5000);
}

// Hamburger Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Optional: Toggle icon between bars and times (X)
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}


// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const thankYouMessage = document.getElementById('thankYouMessage');
const sendAnotherBtn = document.getElementById('sendAnother');

if (contactForm && thankYouMessage) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    thankYouMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    alert('Oops! There was a problem submitting your form');
                }
            })
            .catch(error => {
                alert('Oops! There was a problem submitting your form');
            });
    });

    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            thankYouMessage.style.display = 'none';
            contactForm.style.display = 'block';
        });
    }
}
