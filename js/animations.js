/*
 * animations.js
 * Purpose: initialize GSAP timelines for section reveals, project cards, SVG drawing, and form behavior.
 * Dependencies: gsap, ScrollTrigger, PortfolioApp
 */
(function () {
    function initHeroScene() {
        gsap.set(".reveal-block", { visibility: "visible" });

        gsap.from(".hero-description, .hero-actions", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out"
        });

        gsap.from(".hero-portrait, .hero-signal", {
            y: 70,
            opacity: 0,
            scale: 0.94,
            duration: 1.1,
            stagger: 0.12,
            ease: "power3.out"
        });

        gsap.to(".hero-copy", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            }
        });

        gsap.to(".hero-portrait", {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            }
        });
    }

    function initProjectsSection() {
        const cards = gsap.utils.toArray(".project-card");
        const images = gsap.utils.toArray(".project-image");

        cards.forEach((card, index) => {
            gsap.fromTo(card,
                { y: 70, opacity: 0, scale: 0.97 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    delay: index * 0.04,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 82%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        images.forEach((image) => {
            gsap.fromTo(image,
                { yPercent: -6, scale: 1.08 },
                {
                    yPercent: 6,
                    scale: 1.03,
                    ease: "none",
                    scrollTrigger: {
                        trigger: image.closest(".project-card"),
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2
                    }
                }
            );
        });
    }

    function initProcessSection() {
        const processItems = gsap.utils.toArray(".process-card");

        gsap.from(".process-section .section-heading-wrap", {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".process-section",
                start: "top 76%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.from(processItems, {
            y: 60,
            opacity: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".process-panels",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }

    function initProjectHover() {
        if (window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        gsap.utils.toArray(".project-card").forEach((card) => {
            card.addEventListener("mousemove", function (event) {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                gsap.to(card, {
                    rotateX: y * -4,
                    rotateY: x * 4,
                    y: -4,
                    transformPerspective: 900,
                    duration: 0.35,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", function () {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    y: 0,
                    duration: 0.45,
                    ease: "power3.out"
                });
            });
        });
    }

    function initProjectShowcase() {
        gsap.from(".projects-header", {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".projects-section",
                start: "top 78%",
                toggleActions: "play none none reverse"
            }
        });

        initProjectsSection();
        initProjectHover();
    }

    function initEntryAnimations() {
        gsap.utils.toArray(".about-card, .skill-card, .contact-copy, .contact-form").forEach((element) => {
            gsap.set(element, { visibility: "visible" });
            gsap.from(element, {
                y: 60,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        gsap.utils.toArray(".skill-fill").forEach((bar) => {
            gsap.fromTo(bar,
                { width: "0%" },
                {
                    width: bar.dataset.width,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bar.closest(".skill-card"),
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    function initSvgDraw() {
        document.querySelectorAll(".draw-path").forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            gsap.to(path, {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: path,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: true
                }
            });
        });
    }

    function initContactForm() {
        const form = document.querySelector(".contact-form");
        const status = form.querySelector(".form-status");
        const button = form.querySelector("button");

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            status.textContent = "Sending...";
            button.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { Accept: "application/json" }
                });

                if (!response.ok) {
                    throw new Error("Request failed");
                }

                form.reset();
                status.textContent = "Message sent successfully.";
            } catch (error) {
                status.textContent = "Message failed to send. Please try again.";
            } finally {
                button.disabled = false;
            }
        });
    }

    function initReducedMotionFallback() {
        document.querySelectorAll(".reveal-block, .about-card, .skill-card, .contact-copy, .contact-form").forEach((element) => {
            element.style.visibility = "visible";
        });

        document.querySelectorAll(".skill-fill").forEach((bar) => {
            bar.style.width = bar.dataset.width;
        });
    }

    window.PortfolioApp.register(function () {
        if (window.PortfolioApp.reducedMotion) {
            initReducedMotionFallback();
            initContactForm();
            return;
        }

        if (window.ScrollTrigger) {
            initHeroScene();
            initProjectShowcase();
            initProcessSection();
            initEntryAnimations();
            initSvgDraw();
        } else {
            initReducedMotionFallback();
        }

        initContactForm();
    });
})();
