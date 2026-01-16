let slideIndex = 0;
showSlides(slideIndex);

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("slide-dot");

    if (n >= slides.length) { slideIndex = 0 }
    if (n < 0) { slideIndex = slides.length - 1 }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex].style.display = "block";
    slides[slideIndex].classList.add("active");
    dots[slideIndex].className += " active";
}

// Auto slide every 5 seconds
setInterval(() => {
    changeSlide(1);
}, 5000);

// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('nav').classList.toggle('active');
});
