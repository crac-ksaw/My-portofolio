/*
 * core.js
 * Purpose: initialize global app state, loader, Lenis, header behavior, navigation, and startup sequence.
 * Dependencies: gsap, ScrollTrigger, SplitText, Lenis
 */
(function () {
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    if (window.SplitText) {
        gsap.registerPlugin(SplitText);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;
    const loader = document.getElementById("loader");
    const loaderCounter = document.getElementById("loaderCounter");
    const header = document.getElementById("siteHeader");
    const nav = document.getElementById("siteNav");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = Array.from(nav.querySelectorAll("a"));

    const app = {
        reducedMotion,
        lenis: null,
        isReady: false,
        initQueue: [],
        register(callback) {
            this.initQueue.push(callback);
        },
        runInitializers() {
            this.initQueue.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error("Initializer failed:", error);
                }
            });
            this.isReady = true;
        }
    };

    window.PortfolioApp = app;

    function initLenis() {
        if (reducedMotion) {
            return;
        }

        if (!window.Lenis || !window.ScrollTrigger) {
            return;
        }

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true
        });

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        app.lenis = lenis;
    }

    function initHeader() {
        function setHeaderState() {
            const scrolled = window.scrollY > 24;
            header.classList.toggle("is-solid", scrolled);
        }

        function closeMenu() {
            nav.classList.remove("is-open");
            header.classList.remove("is-open");
            menuToggle.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        }

        menuToggle.addEventListener("click", function () {
            const willOpen = !nav.classList.contains("is-open");
            nav.classList.toggle("is-open", willOpen);
            header.classList.toggle("is-open", willOpen);
            menuToggle.classList.toggle("is-open", willOpen);
            menuToggle.setAttribute("aria-expanded", String(willOpen));
        });

        document.addEventListener("click", function (event) {
            if (!header.contains(event.target)) {
                closeMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", function (event) {
                const target = document.querySelector(link.getAttribute("href"));
                if (!target) {
                    return;
                }

                event.preventDefault();
                closeMenu();

                if (app.lenis) {
                    app.lenis.scrollTo(target, {
                        offset: -100,
                        duration: 1.4
                    });
                } else {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });

        window.addEventListener("scroll", setHeaderState, { passive: true });
        setHeaderState();

        navLinks.forEach((link) => {
            const section = document.querySelector(link.getAttribute("href"));
            if (!section) {
                return;
            }

            if (!window.ScrollTrigger) {
                return;
            }

            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onToggle: function (self) {
                    if (!self.isActive) {
                        return;
                    }

                    navLinks.forEach((item) => {
                        item.classList.toggle("is-active", item === link);
                    });
                }
            });
        });
    }

    function initResizeHandling() {
        window.addEventListener("resize", function () {
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        });
    }

    function startExperience() {
        body.classList.add("is-ready");
        app.runInitializers();
        if (window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    function runLoader() {
        if (reducedMotion) {
            if (loader) {
                loader.remove();
            }
            startExperience();
            return;
        }

        const counter = { value: 0 };

        gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: function () {
                loader.remove();
                startExperience();
            }
        })
            .to(counter, {
                value: 100,
                duration: 2,
                onUpdate: function () {
                    loaderCounter.textContent = String(Math.round(counter.value));
                }
            })
            .to(loader, {
                yPercent: -100,
                duration: 1.1,
                ease: "expo.inOut"
            }, "-=0.1");
    }

    document.addEventListener("DOMContentLoaded", function () {
        app.register(initLenis);
        app.register(initHeader);
        app.register(initResizeHandling);
        runLoader();
    });

    window.addEventListener("error", function () {
        if (loader && document.body.contains(loader)) {
            loader.remove();
            body.classList.add("is-ready");
        }
    });
})();
