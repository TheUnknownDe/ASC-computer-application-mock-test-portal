// ======================================
// Navbar Shadow on Scroll
// ======================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.classList.add("shadow");

    } else {

        navbar.classList.remove("shadow");

    }

});


// ======================================
// Smooth Scroll for Navigation Links
// ======================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});


// ======================================
// Statistics Counter Animation
// ======================================

const counters = document.querySelectorAll(".stats-section h2");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.5

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});


function animateCounter(counter) {

    let text = counter.innerText;

    let target = parseInt(text.replace(/\D/g, ""));

    let suffix = text.replace(/[0-9]/g, "");

    let current = 0;

    let increment = Math.ceil(target / 80);

    let timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        counter.innerText = current + suffix;

    }, 25);

}


// ======================================
// Fade Animation on Scroll
// ======================================

const animatedItems = document.querySelectorAll(

    ".about-card,.course-card,.feature-box,.step-box"

);

const animationObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0)";

        }

    });

}, {

    threshold: 0.2

});

animatedItems.forEach(item => {

    item.style.opacity = "0";

    item.style.transform = "translateY(40px)";

    item.style.transition = "all .7s ease";

    animationObserver.observe(item);

});


// ======================================
// Scroll To Top Button
// ======================================

const topButton = document.createElement("button");

topButton.innerHTML = '<i class="bi bi-arrow-up"></i>';

topButton.id = "scrollTopBtn";

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.bottom = "25px";
topButton.style.right = "25px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#1E3A5F";
topButton.style.color = "#fff";
topButton.style.fontSize = "22px";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "999";

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


// ======================================
// Active Navigation Link
// ======================================

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


// ======================================
// Console Welcome Message
// ======================================

console.log("========================================");
console.log(" AASRAA Skillability Centre ");
console.log(" Computer Application Mock Test Portal ");
console.log(" Home Page Loaded Successfully ");
console.log("========================================");