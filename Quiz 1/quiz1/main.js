// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar hide/show on scroll
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scroll down - hide navbar
        navbar.style.top = "-100px"; // Adjust to be off-screen
    } else {
        // Scroll up - show navbar
        navbar.style.top = "0";
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});

// Fade-in effect for sections when scrolling
const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null,
    threshold: 0.1,  // When 10% of the section is visible
};

const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Stop observing once the section has faded in
        }
    });
}, observerOptions);

sections.forEach(section => {
    fadeInOnScroll.observe(section);
});

// Fade-in effect for the header on page load
window.addEventListener('load', function() {
    const header = document.querySelector('header');
    header.classList.add('fade-in');
});
