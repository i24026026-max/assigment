// Wavy title: split text into spans and add incremental delays
(function initWavyTitle() {
    var titleEl = document.querySelector('.hero-title');
    if (!titleEl) return;
    var text = titleEl.textContent.trim();
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        var span = document.createElement('span');
        span.textContent = ch;
        span.style.animationDelay = (i * 0.08) + 's';
        frag.appendChild(span);
    }
    titleEl.textContent = '';
    titleEl.appendChild(frag);
})();

// Click particle effect: fullscreen canvas
(function clickParticles() {
    var canvas = document.getElementById('clickCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var particles = [];

    function resize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function addBurst(x, y) {
        var count = 24;
        for (var i = 0; i < count; i++) {
            var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
            var speed = 2 + Math.random() * 2.5;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                radius: 2 + Math.random() * 3,
                hue: Math.floor(260 + Math.random() * 80)
            });
        }
    }

    window.addEventListener('pointerdown', function (e) {
        var rect = canvas.getBoundingClientRect();
        addBurst(e.clientX - rect.left, e.clientY - rect.top);
    });

    function step(dt) {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life -= 0.016;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.globalAlpha = Math.max(p.life, 0);
            ctx.fillStyle = 'hsl(' + p.hue + ', 80%, 60%)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    var last = 0;
    function loop(ts) {
        var dt = (ts - last) / 1000;
        last = ts;
        step(dt);
        draw();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();


