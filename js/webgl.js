/*
 * webgl.js
 * Purpose: create the fullscreen Three.js shader background with animated noise and subtle mouse influence.
 * Dependencies: THREE, gsap, PortfolioApp
 */
(function () {
    function initWebgl() {
        const app = window.PortfolioApp;
        if (app.reducedMotion || !window.THREE) {
            return;
        }

        const mount = document.getElementById("webglStage");
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.pointerEvents = "none";
        mount.appendChild(renderer.domElement);

        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };

        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;

                uniform float uTime;
                uniform vec2 uMouse;
                uniform vec2 uResolution;
                varying vec2 vUv;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);

                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));

                    vec2 u = f * f * (3.0 - 2.0 * f);

                    return mix(a, b, u.x) +
                        (c - a) * u.y * (1.0 - u.x) +
                        (d - b) * u.x * u.y;
                }

                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 5; i++) {
                        value += amplitude * noise(st);
                        st *= 2.02;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 mouse = uMouse;
                    vec2 centered = uv - 0.5;
                    float dist = distance(uv, mouse);
                    vec2 warp = centered * (0.08 + dist * 0.18);
                    uv += warp * 0.12;

                    float t = uTime * 0.08;
                    float n1 = fbm(uv * 3.5 + vec2(t, -t * 0.6));
                    float n2 = fbm(uv * 5.2 - vec2(t * 0.7, t * 0.4));
                    float blend = smoothstep(0.18, 0.82, n1 * 0.75 + n2 * 0.45);
                    float glow = 1.0 - smoothstep(0.0, 0.85, dist);

                    vec3 base = vec3(0.02, 0.05, 0.1);
                    vec3 mid = vec3(0.05, 0.16, 0.22);
                    vec3 accent = vec3(0.45, 0.63, 1.0);
                    vec3 mint = vec3(0.45, 0.94, 0.76);

                    vec3 color = mix(base, mid, blend);
                    color += accent * pow(blend, 2.4) * 0.18;
                    color += mint * glow * 0.06;

                    gl_FragColor = vec4(color, 0.95);
                }
            `,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        window.addEventListener("mousemove", function (event) {
            uniforms.uMouse.value.x = event.clientX / window.innerWidth;
            uniforms.uMouse.value.y = 1 - event.clientY / window.innerHeight;
        });

        function render() {
            uniforms.uTime.value += 0.01;
            renderer.render(scene, camera);
        }

        gsap.ticker.add(render);

        window.addEventListener("resize", function () {
            uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            ScrollTrigger.refresh();
        });
    }

    window.PortfolioApp.register(initWebgl);
})();
