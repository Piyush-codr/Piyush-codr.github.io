$(document).ready(function(){
    $('.slider').slick({
arrows:false,
dots:true,
appendDots:'.slider-dots',
dotsClass:'dots'
});


let hamberger = document.querySelector('.hamberger');
let times = document.querySelector('.times');
let mobileNav= document.querySelector('.mobile-nav');

hamberger.addEventListener('click', function(){
mobileNav.classList.add('open');

});
times.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

});
// Animated data-specific background wallpaper.
(function () {
    const canvas = document.getElementById('data-bg-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const tokens = ['SQL', 'ETL', 'ELT', 'GCP', 'AI', 'API', 'JSON', 'DAG', 'LOAD', 'JOIN', '0', '1', 'Δ', 'λ'];
    let time = 0;
    let width = 0;
    let height = 0;
    let particles = [];
    let streams = [];
    let rafId = null;

    function particleCount() {
        if (window.innerWidth < 600) return 28;
        if (window.innerWidth < 1000) return 44;
        return 64;
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles = Array.from({ length: particleCount() }, createParticle);
        streams = Array.from({ length: width < 600 ? 18 : 34 }, createStream);
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.34,
            vy: (Math.random() - 0.5) * 0.34,
            r: Math.random() * 1.8 + 1,
            token: tokens[Math.floor(Math.random() * tokens.length)],
            tokenAlpha: Math.random() * 0.28 + 0.12
        };
    }

    function drawGrid() {
        ctx.strokeStyle = themeInk().grid;
        ctx.lineWidth = 1;
        const gap = width < 600 ? 54 : 72;
        for (let x = 0; x < width; x += gap) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gap) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }



    function createStream() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            speed: Math.random() * 0.7 + 0.35,
            text: tokens[Math.floor(Math.random() * tokens.length)],
            alpha: Math.random() * 0.2 + 0.08
        };
    }

    function themeInk() {
        return document.body.getAttribute('data-theme') === 'light'
            ? { grid: 'rgba(2, 132, 199, 0.08)', line: 'rgba(2, 132, 199, 0.18)', alt: 'rgba(124, 58, 237, 0.16)', text: 'rgba(15, 23, 42, ', node: 'rgba(2, 132, 199, 0.62)' }
            : { grid: 'rgba(148, 163, 184, 0.055)', line: 'rgba(0, 229, 255, 0.2)', alt: 'rgba(124, 58, 237, 0.18)', text: 'rgba(226, 232, 240, ', node: 'rgba(0, 229, 255, 0.62)' };
    }

    function drawDataStreams() {
        const ink = themeInk();
        ctx.font = '11px JetBrains Mono, monospace';
        streams.forEach((stream, index) => {
            stream.y += stream.speed;
            if (stream.y > height + 24) {
                stream.y = -24;
                stream.x = Math.random() * width;
                stream.text = tokens[Math.floor(Math.random() * tokens.length)];
            }
            ctx.fillStyle = `${ink.text}${stream.alpha})`;
            ctx.fillText(stream.text, stream.x, stream.y);

            if (index % 4 === 0) {
                const barHeight = 12 + Math.sin(time * 0.002 + index) * 8;
                ctx.fillStyle = document.body.getAttribute('data-theme') === 'light' ? 'rgba(2, 132, 199, 0.14)' : 'rgba(34, 197, 94, 0.16)';
                ctx.fillRect(stream.x + 28, stream.y - barHeight, 3, barHeight);
                ctx.fillRect(stream.x + 34, stream.y - barHeight * 0.65, 3, barHeight * 0.65);
                ctx.fillRect(stream.x + 40, stream.y - barHeight * 1.2, 3, barHeight * 1.2);
            }
        });
    }
    function drawPipelines() {
        const routes = [
            [[-40, height * 0.22], [width * 0.22, height * 0.22], [width * 0.22, height * 0.38], [width * 0.58, height * 0.38], [width + 40, height * 0.2]],
            [[-30, height * 0.68], [width * 0.18, height * 0.68], [width * 0.18, height * 0.82], [width * 0.72, height * 0.82], [width + 30, height * 0.62]],
            [[width * 0.78, -30], [width * 0.78, height * 0.3], [width * 0.62, height * 0.3], [width * 0.62, height + 30]],
            [[width * 0.08, -30], [width * 0.08, height * 0.48], [width * 0.38, height * 0.48], [width * 0.38, height + 30]]
        ];

        routes.forEach((route, routeIndex) => {
            ctx.lineWidth = routeIndex % 2 === 0 ? 2 : 1.5;
            ctx.strokeStyle = routeIndex % 2 === 0 ? themeInk().line : themeInk().alt;
            ctx.beginPath();
            route.forEach(([x, y], index) => {
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            const packetCount = width < 600 ? 2 : 4;
            for (let k = 0; k < packetCount; k++) {
                const progress = (time * 0.00013 + k / packetCount + routeIndex * 0.13) % 1;
                const point = pointOnRoute(route, progress);
                const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 18);
                glow.addColorStop(0, routeIndex % 2 === 0 ? 'rgba(0, 229, 255, 0.75)' : 'rgba(124, 58, 237, 0.72)');
                glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 18, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#e0f2fe';
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function pointOnRoute(route, progress) {
        const segments = [];
        let total = 0;
        for (let i = 0; i < route.length - 1; i++) {
            const [x1, y1] = route[i];
            const [x2, y2] = route[i + 1];
            const length = Math.hypot(x2 - x1, y2 - y1);
            segments.push({ x1, y1, x2, y2, length });
            total += length;
        }
        let distance = progress * total;
        for (const segment of segments) {
            if (distance <= segment.length) {
                const t = distance / segment.length;
                return {
                    x: segment.x1 + (segment.x2 - segment.x1) * t,
                    y: segment.y1 + (segment.y2 - segment.y1) * t
                };
            }
            distance -= segment.length;
        }
        const last = route[route.length - 1];
        return { x: last[0], y: last[1] };
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawGrid();
        time = performance.now();
        drawDataStreams();
        drawPipelines();

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const limit = width < 600 ? 92 : 135;
                if (dist < limit) {
                    ctx.strokeStyle = `rgba(0, 229, 255, ${0.13 * (1 - dist / limit)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }

            ctx.fillStyle = themeInk().node;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            if (i % 5 === 0) {
                ctx.font = '11px JetBrains Mono, monospace';
                ctx.fillStyle = `rgba(226, 232, 240, ${p.tokenAlpha})`;
                ctx.fillText(p.token, p.x + 8, p.y - 8);
            }
        }

        rafId = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('beforeunload', function () {
        if (rafId) cancelAnimationFrame(rafId);
    });
})();

// Floating portfolio assistant.
document.addEventListener('DOMContentLoaded', function () {
    const widget = document.querySelector('.portfolio-agent');
    if (!widget) return;

    const launcher = widget.querySelector('.agent-launcher');
    const panel = widget.querySelector('.agent-panel');
    const close = widget.querySelector('.agent-close');
    const body = widget.querySelector('.agent-body');
    const form = widget.querySelector('.agent-input-row');
    const input = widget.querySelector('.agent-input');
    const suggestions = widget.querySelectorAll('[data-question]');
    const scrollNews = widget.querySelector('.agent-scroll-news');
    let newsShown = false;

    const profile = {
        linkedin: 'https://www.linkedin.com/in/piyush-kumar-7ab1951b8/',
        email: 'hellopiyushsingh12345@gmail.com',
        phone: '+91 8340183196',
        whatsapp: 'https://wa.me/918340183196',
        resume: 'resume/Piyush DE (1).pdf',
        location: 'Gurugram, Haryana',
        latitude: 28.4595,
        longitude: 77.0266
    };

    function openAgent() {
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        setTimeout(() => input.focus(), 50);
    }

    function closeAgent() {
        panel.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
    }

    function addMessage(text, type) {
        const message = document.createElement('div');
        message.className = `agent-message ${type}`;
        message.innerHTML = text;
        body.appendChild(message);
        body.scrollTop = body.scrollHeight;
    }

    async function answer(question) {
        const gptReply = await askBabuGPT(question);
        if (gptReply) return gptReply;
        const q = question.toLowerCase();
        if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
            return 'Piyush works with <b>Python, SQL, BigQuery, Airflow, Pub/Sub, Snowflake, Talend, Qlik, Databricks, Spark, GCP, ETL/ELT, data pipelines, APIs, Git, CI/CD, and GenAI concepts</b>.';
        }
        if (q.includes('experience') || q.includes('accenture') || q.includes('work')) {
            return 'Piyush is a <b>Data Engineer at Accenture</b>, working on cloud data solutions, data onboarding, metadata migration, ETL/ELT workflows, validation, production support, and enterprise data operations. He also has internship experience with The Sparks Foundation, SmartInternz, and Lagozon.';
        }
        if (q.includes('project') || q.includes('pipeline') || q.includes('talend') || q.includes('qlik')) {
            return 'His featured data engineering projects include <b>Talend & Qlik Data Integration</b>, <b>Qlik & Snowflake Data Pipeline</b>, and <b>Talend REST API Integration</b>. He also has ML, dashboarding, and web projects such as RPS, SSP, Sales Dashboard, and Text Summarization.';
        }
        if (q.includes('cert') || q.includes('achievement')) {
            return 'Piyush has certifications and achievements across <b>Google Cloud, Snowflake, Qlik Talend, Generative AI, Cloud Digital Leader, and data practitioner tracks</b>. You can view them in the Certifications section.';
        }
        if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('hire')) {
            return `You can contact Piyush at <a href="mailto:${profile.email}">${profile.email}</a>, call <a href="tel:+918340183196">${profile.phone}</a>, or message on <a href="${profile.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>. His resume is available from the Download CV button.`;
        }
        if (q.includes('weather') || q.includes('temperature') || q.includes('gurugram')) {
            return await getGurugramWeather();
        }
        if (q.includes('news') || q.includes('update') || q.includes('cloud')) {
            return '<b>Two quick data/cloud updates:</b><br>1. Data engineering teams are focusing more on pipeline observability, automated data quality checks, and metadata-driven ingestion.<br>2. Cloud platforms are increasingly combining data warehouses, orchestration, streaming, and AI services into unified analytics workflows.';
        }
        if (q.includes('about') || q.includes('piyush')) {
            return 'Piyush Kumar is a Data Engineer focused on building cloud-native data pipelines and reliable enterprise workflows. He is based in India, works at Accenture, and enjoys learning modern data, cloud, and AI technologies.';
        }
        return 'I am BABU, Piyush Kumar\'s portfolio assistant. I can answer from his portfolio about his Data Engineering experience, Accenture role, GCP/BigQuery/Airflow/Snowflake/Talend skills, projects, certifications, resume, LinkedIn, and contact details. For this question, the closest useful answer is: Piyush builds cloud-ready data pipelines and enterprise data workflows, with strong hands-on exposure to ETL/ELT, validation, metadata migration, and production support.';
    }


    async function getGurugramWeather() {
        const fallback = `<b>Weather in ${profile.location}</b><br>I couldn't fetch live weather right now, but I know Piyush's current location is ${profile.location}.`;

        try {
            const params = new URLSearchParams({
                latitude: String(profile.latitude),
                longitude: String(profile.longitude),
                current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
                timezone: 'auto'
            });
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
            if (!response.ok) return fallback;

            const data = await response.json();
            const current = data.current || {};
            const code = Number(current.weather_code);
            const conditions = {
                0: 'Clear sky',
                1: 'Mainly clear',
                2: 'Partly cloudy',
                3: 'Cloudy',
                45: 'Foggy',
                48: 'Foggy',
                51: 'Light drizzle',
                53: 'Drizzle',
                55: 'Heavy drizzle',
                61: 'Light rain',
                63: 'Rain',
                65: 'Heavy rain',
                71: 'Light snow',
                73: 'Snow',
                75: 'Heavy snow',
                80: 'Light showers',
                81: 'Showers',
                82: 'Heavy showers',
                95: 'Thunderstorm'
            };

            const temperature = current.temperature_2m;
            const humidity = current.relative_humidity_2m;
            const wind = current.wind_speed_10m;
            const condition = conditions[code] || 'Weather data available';

            return `<b>Weather in ${profile.location}</b><br>${condition}<br>Temperature: ${temperature} deg C<br>Humidity: ${humidity}%<br>Wind: ${wind} km/h<br><span class="agent-note">Live data from Open-Meteo free weather API.</span>`;
        } catch (error) {
            return fallback;
        }
    }
    async function askBabuGPT(question) {
        // Optional backend hook. Create /api/babu-chat on a server to connect BABU to GPT securely.
        // Never put an OpenAI API key directly in this frontend file.
        try {
            const endpoint = window.BABU_GPT_ENDPOINT;
            if (!endpoint) return '';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    assistantName: 'BABU',
                    profile: {
                        name: 'Piyush Kumar',
                        role: 'Data Engineer at Accenture',
                        linkedin: 'https://www.linkedin.com/in/piyush-kumar-7ab1951b8/',
                        focus: 'GCP, BigQuery, Airflow, Pub/Sub, Snowflake, Talend, Qlik, Databricks, Spark, SQL, Python, ETL/ELT, data pipelines, cloud data platforms'
                    }
                })
            });
            if (!response.ok) return '';
            const data = await response.json();
            return data.answer || data.message || '';
        } catch (error) {
            return '';
        }
    }
    launcher.addEventListener('click', function () {
        if (panel.hidden) openAgent();
        else closeAgent();
    });
    close.addEventListener('click', closeAgent);

    suggestions.forEach((button) => {
        button.addEventListener('click', function () {
            const question = button.dataset.question;
            addMessage(question, 'user');
            answer(question).then((reply) => addMessage(reply, 'bot'));
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        addMessage(question, 'user');
        input.value = '';
        setTimeout(() => answer(question).then((reply) => addMessage(reply, 'bot')), 180);
    });
    window.addEventListener('scroll', function () {
        if (!scrollNews || newsShown || window.scrollY < 420 || !panel.hidden) return;
        newsShown = true;
        scrollNews.hidden = false;
        setTimeout(() => {
            scrollNews.hidden = true;
        }, 7000);
    }, { passive: true });
});






