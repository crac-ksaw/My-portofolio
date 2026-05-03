/*
 * cursor.js
 * Purpose: create the custom magnetic cursor, hover states, click feedback, and footer magnetic behavior.
 * Dependencies: gsap, PortfolioApp
 */
(function () {
    function initCursor() {
        const app = window.PortfolioApp;
        if (app.reducedMotion || window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        const dot = document.getElementById("cursor-dot");
        const ring = document.getElementById("cursor-ring");
        const interactives = document.querySelectorAll("a, button");
        const footerMagnet = document.getElementById("footerMagnet");

        const ringXTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
        const ringYTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

        document.addEventListener("mousemove", function (event) {
            gsap.set(dot, {
                x: event.clientX,
                y: event.clientY,
                opacity: 1
            });

            ringXTo(event.clientX);
            ringYTo(event.clientY);
            gsap.set(ring, { opacity: 1 });
        });

        document.addEventListener("mouseleave", function () {
            gsap.set([dot, ring], { opacity: 0 });
        });

        document.addEventListener("mousedown", function () {
            gsap.to(dot, { scale: 0.5, duration: 0.2, ease: "power2.out" });
        });

        document.addEventListener("mouseup", function () {
            gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out" });
        });

        interactives.forEach((element) => {
            element.addEventListener("mouseenter", function () {
                gsap.to(ring, {
                    scale: 2.5,
                    opacity: 0.35,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            element.addEventListener("mouseleave", function () {
                gsap.to(ring, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        footerMagnet.addEventListener("mousemove", function (event) {
            const rect = footerMagnet.getBoundingClientRect();
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);

            gsap.to(footerMagnet, {
                x: dx * 0.3,
                y: dy * 0.3,
                scale: 1.04,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        footerMagnet.addEventListener("mouseleave", function () {
            gsap.to(footerMagnet, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: "elastic.out(1, 0.4)"
            });
        });
    }

    window.PortfolioApp.register(initCursor);
})();
