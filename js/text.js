/*
 * text.js
 * Purpose: handle SplitText-driven heading and subheading animations with cleanup via revert().
 * Dependencies: gsap, ScrollTrigger, SplitText, PortfolioApp
 */
(function () {
    function initText() {
        const app = window.PortfolioApp;

        const heroTitle = document.querySelector(".hero-title");
        const heroSplit = new SplitText(heroTitle, { type: "chars,words" });
        gsap.set(heroTitle, { visibility: "visible" });
        gsap.set(heroSplit.chars, { y: 80, opacity: 0, rotation: 6 });

        gsap.timeline({
            defaults: { ease: "power4.out" },
            onComplete: function () {
                heroSplit.revert();
            }
        }).to(heroSplit.chars, {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            stagger: 0.03
        });

        document.querySelectorAll(".section-heading").forEach((heading) => {
            const split = new SplitText(heading, { type: "chars" });
            gsap.set(heading, { visibility: "visible" });
            gsap.set(split.chars, { y: 80, opacity: 0, rotation: 6 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: heading,
                    start: "top 78%",
                    toggleActions: "play none none reverse"
                },
                onComplete: function () {
                    split.revert();
                }
            }).to(split.chars, {
                y: 0,
                opacity: 1,
                rotation: 0,
                duration: 0.9,
                stagger: 0.03,
                ease: "power4.out"
            });
        });

        document.querySelectorAll(".section-subheading").forEach((subheading) => {
            const split = new SplitText(subheading, { type: "words" });
            gsap.set(subheading, { visibility: "visible" });
            gsap.set(split.words, { y: 36, opacity: 0 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: subheading,
                    start: "top 82%",
                    toggleActions: "play none none reverse"
                },
                onComplete: function () {
                    split.revert();
                }
            }).to(split.words, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.06,
                ease: "power3.out"
            });
        });
    }

    function initReducedMotionText() {
        document.querySelectorAll(".hero-title, .section-heading, .section-subheading").forEach((element) => {
            element.style.visibility = "visible";
        });
    }

    window.PortfolioApp.register(function () {
        if (window.PortfolioApp.reducedMotion || !window.SplitText) {
            initReducedMotionText();
            return;
        }

        initText();
    });
})();
