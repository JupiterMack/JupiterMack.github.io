
class TextScramble {
    constructor(el, autoInit = true) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
        if (autoInit && el.dataset.scramble) {
            this.originalText = el.dataset.scramble;
            this.init();
        }
    }
    
    init() {
        if (this.originalText) {
            this.setText(this.originalText);
        }
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 80);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.10) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const buttonContainer = document.querySelector('.button-container');
    const bottomLeftContent = document.querySelector('.bottom-left-content');
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    const cyclingElement = document.querySelector('[data-cycling]');
    
    // Initial scramble texts
    scrambleElements.forEach((element, index) => {
        setTimeout(() => {
            new TextScramble(element);
        }, index * 800);
    });

    // Fade in elements
    setTimeout(() => {
        header.style.opacity = '1';
        buttonContainer.style.opacity = '1';
        bottomLeftContent.style.opacity = '1';
    }, 1000);

    // Handle cycling text with more reliable cycling
    if (cyclingElement) {
        const cyclingTexts = ['your time', 'your data', 'your money', 'your sanity'];
        let currentIndex = 0;
        const cycleFx = new TextScramble(cyclingElement, false); // Added false parameter

        const nextCycleText = () => {
            cycleFx.setText(cyclingTexts[currentIndex]).then(() => {
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % cyclingTexts.length;
                    nextCycleText();
                }, 2000);
            });
        };

        // Start the cycling after a short delay
        setTimeout(() => {
            nextCycleText();
        }, 1500);
    }
    handleScrollAnimations();
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize circular progress
    document.querySelectorAll('.progress-bar').forEach(circle => {
        const value = circle.dataset.value;
        circle.style.setProperty('--value', value);
    });

    // Initialize bars
    document.querySelectorAll('.bar').forEach(bar => {
        const value = bar.dataset.value;
        bar.style.setProperty('--value', value);
    });
});
