document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // 2. Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Typing Effect
    const typedTextSpan = document.querySelector('.typed');
    const cursorSpan = document.querySelector('.cursor');
    const textArray = ["AI & Data Science Engineer", "Full Stack Developer", "Machine Learning Enthusiast", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    if(typedTextSpan && cursorSpan) {
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        if (textArray.length) setTimeout(type, newTextDelay + 250);
    }

    // 4. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. Skill Tabs (Fixed and Simplified for reliable display)
    const tabs = document.querySelectorAll('.skill-tab');
    const contents = document.querySelectorAll('.skills-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Remove active from all contents and hide them instantly
            contents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });

            // Add active to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                targetContent.style.display = 'grid';
                // Trigger a reflow to ensure the display change registers before opacity changes
                void targetContent.offsetWidth;
                targetContent.classList.add('active');
            }
        });
    });

    // 6. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - (navbar ? navbar.offsetHeight : 80) - 50)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 8. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    if(counters.length > 0) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = +counter.getAttribute('data-target');
                            const count = +counter.innerText;
                            const isDecimal = counter.getAttribute('data-decimal') === 'true';
                            
                            const inc = target / 100;
                            
                            if (count < target) {
                                if (isDecimal) {
                                    counter.innerText = (count + inc).toFixed(1);
                                } else {
                                    counter.innerText = Math.ceil(count + inc);
                                }
                                setTimeout(updateCount, 20);
                            } else {
                                if (isDecimal) {
                                    counter.innerText = target.toFixed(1);
                                } else {
                                    counter.innerText = target;
                                }
                            }
                        };
                        updateCount();
                    });
                    counted = true; 
                }
            });
        }, { threshold: 0.5 });

        const highlightsSection = document.querySelector('.highlights');
        if (highlightsSection) {
            countObserver.observe(highlightsSection);
        }
    }

    // 9. Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending... ⏳';
            submitBtn.style.opacity = '0.7';
            
            const formData = new FormData(contactForm);
            
            // WEB3FORMS CONFIGURATION:
            // 1. Go to https://web3forms.com/
            // 2. Enter your email (s.thakur6794@gmail.com) and click "Create Access Key"
            // 3. You will receive an Access Key in your email.
            // 4. Paste that Access Key below inside the quotes, replacing YOUR_ACCESS_KEY_HERE
            formData.append("access_key", "4521fd9f-3b73-462c-b3b5-161cbf7b1320");
            
            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();
                
                if (data.success) {
                    submitBtn.innerHTML = 'Message Sent! ✅';
                    submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                    submitBtn.style.opacity = '1';
                    contactForm.reset();
                } else {
                    submitBtn.innerHTML = 'Error! ❌';
                    submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
                    alert(data.message || 'Something went wrong.');
                }
            } catch (error) {
                submitBtn.innerHTML = 'Error! ❌';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
                alert('Something went wrong. Please email me directly.');
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        });
    }
});
