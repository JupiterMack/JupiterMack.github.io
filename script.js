// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Carousel Variables and Functions
    const container = document.querySelector(".container");
    const containercarrossel = container?.querySelector(".container-carrossel");
    const carrossel = container?.querySelector(".carrossel");
    const carrosselItems = carrossel?.querySelectorAll(".carrossel-item");

    let isMouseDown = false;
    let currentMousePos = 0;
    let lastMousePos = 0;
    let lastMoveTo = 0;
    let moveTo = 0;

    // Carousel Helper Functions
    const lerp = (a, b, n) => {
        return n * (a - b) + b;
    };

    const distanceZ = (widthElement, length, gap) => {
        return widthElement / 2 / Math.tan(Math.PI / length) + gap;
    };

    const calculateHeight = (z) => {
        const t = Math.atan((90 * Math.PI) / 180 / 2);
        return t * 2 * z;
    };

    const calculateFov = (carrosselProps) => {
        if (!containercarrossel) return 0;
        const perspective = window
            .getComputedStyle(containercarrossel)
            .perspective.split("px")[0];

        const length =
            Math.sqrt(carrosselProps.w * carrosselProps.w) +
            Math.sqrt(carrosselProps.h * carrosselProps.h);
        return 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
    };

    const getPosX = (x) => {
        currentMousePos = x;
        moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;
        lastMousePos = currentMousePos;
    };

    const update = () => {
        if (carrossel) {
            lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
            carrossel.style.setProperty("--rotatey", lastMoveTo + "deg");
            requestAnimationFrame(update);
        }
    };

    const onResize = () => {
        if (!containercarrossel) return null;
        const boundingcarrossel = containercarrossel.getBoundingClientRect();
        return {
            w: boundingcarrossel.width,
            h: boundingcarrossel.height,
        };
    };

    const createcarrossel = () => {
        if (!container || !carrosselItems) return;
        
        const carrosselProps = onResize();
        if (!carrosselProps) return;

        const length = carrosselItems.length;
        const degress = 360 / length;
        const gap = 20;
        const tz = distanceZ(carrosselProps.w, length, gap);
        const height = calculateHeight(tz);

        container.style.width = tz * 2 + gap * length + "px";
        container.style.height = height + "px";

        carrosselItems.forEach((item, i) => {
            const degressByItem = degress * i + "deg";
            item.style.setProperty("--rotatey", degressByItem);
            item.style.setProperty("--tz", tz + "px");
        });
    };

    // Initialize Carousel Events
    const initCarouselEvents = () => {
        if (carrossel && container) {
            carrossel.addEventListener("mousedown", () => {
                isMouseDown = true;
                carrossel.style.cursor = "grabbing";
            });
            carrossel.addEventListener("mouseup", () => {
                isMouseDown = false;
                carrossel.style.cursor = "grab";
            });
            container.addEventListener("mouseleave", () => (isMouseDown = false));
            carrossel.addEventListener("mousemove", (e) => isMouseDown && getPosX(e.clientX));

            // Touch events
            carrossel.addEventListener("touchstart", () => {
                isMouseDown = true;
                carrossel.style.cursor = "grabbing";
            });
            carrossel.addEventListener("touchend", () => {
                isMouseDown = false;
                carrossel.style.cursor = "grab";
            });
            container.addEventListener("touchmove", (e) => isMouseDown && getPosX(e.touches[0].clientX));
        }

        window.addEventListener("resize", createcarrossel);
        update();
        createcarrossel();
    };

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }

    // Form Handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');
            alert('Thank you for your message. We will get back to you soon!');
            form.reset();
        });
    }

    // Lazy Loading Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserverConfig = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    const imageObserver = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                preloadImage(entry.target);
                self.unobserve(entry.target);
            }
        });
    }, imageObserverConfig);

    images.forEach(image => {
        imageObserver.observe(image);
    });

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        img.src = src;
    }

    // Card Scroll Animations
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => animationObserver.observe(el));

    // Initialize Carousel
    initCarouselEvents();
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled', 'collapsed');
        } else {
            header.classList.remove('scrolled', 'collapsed');
        }
    }
});