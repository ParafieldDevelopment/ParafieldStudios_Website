(function () {
    'use strict';

    var canvas = document.getElementById('hero-shader');
    if (!canvas) return;

    var navEl = document.getElementById('nav');

    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        canvas.style.background = '#5a0a0a';
        return;
    }

    // When WebGL works, the nav is drawn inside the shader at the top;
    // hide the real DOM nav until scroll cross-fades it back in.
    if (navEl) navEl.style.opacity = '0';

    var vsSource =
        'attribute vec2 a_position;' +
        'void main() {' +
        '   gl_Position = vec4(a_position, 0.0, 1.0);' +
        '}';

    /* ── Checker + CRT pass ── */
    var checkerFs = [
        'precision mediump float;',
        'uniform vec2 u_resolution;',
        'uniform float u_time;',
        'uniform vec4 u_color1;',
        'uniform vec4 u_color2;',
        'uniform float u_speed;',
        'uniform float u_scale;',
        '',
        'vec3 checkerColor(vec2 uv) {',
        '   uv.x += u_time * u_speed * 0.1;',
        '   uv.y += u_time * u_speed * 0.05;',
        '   uv.x += sin(uv.y * 10.0 + u_time) * 0.02;',
        '   float check = mod(floor(uv.x * u_scale) + floor(uv.y * u_scale), 2.0);',
        '   return mix(u_color1.rgb, u_color2.rgb, check);',
        '}',
        '',
        'void main() {',
        '   vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        '   vec2 cc = uv - 0.5;',
        '   float d = dot(cc, cc);',
        '   vec2 cuv = uv + cc * d * 0.15;',
        '   float ab = 0.0018;',
        '   vec3 col;',
        '   col.r = checkerColor(cuv + vec2(ab, 0.0)).r;',
        '   col.g = checkerColor(cuv).g;',
        '   col.b = checkerColor(cuv - vec2(ab, 0.0)).b;',
        '   float sl = mod(floor(gl_FragCoord.y / 2.0), 2.0);',
        '   col *= (1.0 - 0.14 * sl);',
        '   float vig = smoothstep(0.7, 0.1, d);',
        '   col *= mix(0.15, 1.0, vig);',
        '   col *= 0.97 + 0.03 * sin(u_time * 9.0);',
        '   if (cuv.x < 0.0 || cuv.x > 1.0 || cuv.y < 0.0 || cuv.y > 1.0) col = vec3(0.0);',
        '   gl_FragColor = vec4(col, 1.0);',
        '}'
    ].join('\n');

    /* ── Nav (rendered inside the CRT) pass ── */
    var navFs = [
        'precision mediump float;',
        'uniform sampler2D u_nav;',
        'uniform vec2 u_resolution;',
        'uniform float u_opacity;',
        'void main() {',
        '   vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        '   vec2 cc = uv - 0.5;',
        '   float d = dot(cc, cc);',
        '   vec2 cuv = uv + cc * d * 0.15;',            // same barrel curvature
        '   vec4 nav = texture2D(u_nav, cuv);',
        '   float sl = mod(floor(gl_FragCoord.y / 2.0), 2.0);',
        '   nav.rgb *= (1.0 - 0.12 * sl);',            // scanlines to match
        '   float vig = smoothstep(0.7, 0.1, d);',
        '   nav.rgb *= mix(0.5, 1.0, vig);',           // vignette so it sits in the tube
        '   gl_FragColor = vec4(nav.rgb, nav.a * u_opacity);',
        '}'
    ].join('\n');

    function compile(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('[hero-shader] compile error:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    function makeProgram(fs) {
        var p = gl.createProgram();
        gl.attachShader(p, compile(gl.VERTEX_SHADER, vsSource));
        gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
            console.error('[hero-shader] link error:', gl.getProgramInfoLog(p));
            return null;
        }
        return p;
    }

    var checkerProg = makeProgram(checkerFs);
    var navProg = makeProgram(navFs);
    if (!checkerProg) {
        canvas.style.background = '#5a0a0a';
        return;
    }

    /* ── Quad ── */
    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    function bindQuad(prog) {
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        var loc = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    /* ── Checker uniforms ── */
    var uResC = gl.getUniformLocation(checkerProg, 'u_resolution');
    var uTimeC = gl.getUniformLocation(checkerProg, 'u_time');
    var uCol1 = gl.getUniformLocation(checkerProg, 'u_color1');
    var uCol2 = gl.getUniformLocation(checkerProg, 'u_color2');
    var uSpeedC = gl.getUniformLocation(checkerProg, 'u_speed');
    var uScaleC = gl.getUniformLocation(checkerProg, 'u_scale');
    gl.uniform4f(uCol1, 0.55, 0.07, 0.07, 1.0);
    gl.uniform4f(uCol2, 0.70, 0.55, 0.10, 1.0);
    gl.uniform1f(uSpeedC, 1.0);
    gl.uniform1f(uScaleC, 20.0);

    /* ── Nav uniforms + texture ── */
    var uResN = gl.getUniformLocation(navProg, 'u_resolution');
    var uOpN = gl.getUniformLocation(navProg, 'u_opacity');
    var uNavN = gl.getUniformLocation(navProg, 'u_nav');
    var navTex = gl.createTexture();
    var navReady = false;
    var navCanvas = document.createElement('canvas');
    var navCtx = navCanvas.getContext('2d');
    var logoImg = new Image();
    logoImg.src = 'assets/logo.svg';

    function updateNavTexture() {
        gl.bindTexture(gl.TEXTURE_2D, navTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, navCanvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        navReady = true;
    }

    function drawNav() {
        var w = canvas.width, h = canvas.height;
        if (!w || !h) return;
        navCanvas.width = w;
        navCanvas.height = h;
        var ctx = navCtx;
        ctx.clearRect(0, 0, w, h);

        var dpr = w / Math.max(1, canvas.clientWidth);
        var padX = 48 * dpr;
        var navH = 72 * dpr;
        var cy = navH / 2;

        /* logo (left) */
        var logoH = 42 * dpr;
        if (logoImg.complete && logoImg.naturalWidth) {
            var lw = logoH * (logoImg.naturalWidth / logoImg.naturalHeight);
            ctx.drawImage(logoImg, padX, cy - logoH / 2, lw, logoH);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 ' + (28 * dpr) + 'px Montserrat, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillText('PARAFIELD', padX, cy);
        }

        /* links (right) */
        var items = ['HOME', 'ABOUT', 'CAREERS'];
        var fontSize = 13 * dpr;
        var charGap = 2.5 * dpr;
        var itemGap = 40 * dpr;
        ctx.font = '700 ' + fontSize + 'px Montserrat, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e9e2d0';

        var widths = items.map(function (t) {
            var tw = 0;
            for (var i = 0; i < t.length; i++) tw += ctx.measureText(t[i]).width + charGap;
            return tw;
        });
        var total = 0;
        for (var i = 0; i < items.length; i++) total += widths[i] + (i < items.length - 1 ? itemGap : 0);

        var x = w - padX - total;
        for (var j = 0; j < items.length; j++) {
            var t = items[j];
            for (var k = 0; k < t.length; k++) {
                var ch = t[k];
                var cw = ctx.measureText(ch).width;
                ctx.fillText(ch, x, cy);
                x += cw + charGap;
            }
            x += itemGap;
        }

        updateNavTexture();
    }

    logoImg.onload = drawNav;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawNav);

    /* ── Resize ── */
    function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            drawNav();
        }
        gl.uniform2f(uResC, canvas.width, canvas.height);
        if (navProg) gl.uniform2f(uResN, canvas.width, canvas.height);
    }

    /* ── Render ── */
    var start = performance.now();
    function render(now) {
        resize();

        /* checker + CRT */
        gl.disable(gl.BLEND);
        bindQuad(checkerProg);
        gl.uniform1f(uTimeC, (now - start) / 1000.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        /* nav rendered inside the CRT, fading with scroll */
        var sy = window.scrollY || window.pageYOffset || 0;
        var navOp = 1.0 - Math.min(Math.max(sy / 220, 0), 1);
        if (navProg && navReady && navOp > 0.002) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            bindQuad(navProg);
            gl.uniform1f(uOpN, navOp);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, navTex);
            gl.uniform1i(uNavN, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        /* cross-fade the real DOM nav (interactive) */
        if (navEl) {
            navEl.style.opacity = (1 - navOp).toFixed(3);
            // Hacky clickability: the DOM nav stays clickable even while
            // invisible at the top, so its real <a> links capture clicks
            // over the WebGL-drawn nav. On scroll it fades in as the normal nav.
            navEl.style.pointerEvents = 'auto';
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.addEventListener('resize', resize);
})();
