document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

const navbarHeight = navbar.offsetHeight;
let isScrolling;

window.addEventListener("scroll", function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    window.clearTimeout(isScrolling);

    navbar.style.top = `-${navbarHeight}px`;  

    isScrolling = setTimeout(function() {
        navbar.style.top = "0"; 
    }, 500);  

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});



const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null,
    threshold: 0.1, 
};

const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

sections.forEach(section => {
    fadeInOnScroll.observe(section);
});

window.addEventListener('load', function() {
    const header = document.querySelector('header');
    header.classList.add('fade-in');
});
