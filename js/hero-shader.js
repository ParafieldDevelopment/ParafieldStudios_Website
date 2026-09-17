(function () {
    'use strict';

    var canvas = document.getElementById('hero-shader');
    if (!canvas) return;

    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        canvas.style.background = '#5a0a0a';
        return;
    }

    var vsSource =
        'attribute vec2 a_position;' +
        'void main() {' +
        '   gl_Position = vec4(a_position, 0.0, 1.0);' +
        '}';

    var fsSource = [
        'precision mediump float;',
        'uniform vec2 u_resolution;',
        'uniform float u_time;',
        'uniform vec4 u_color1;',
        'uniform vec4 u_color2;',
        'uniform float u_speed;',
        'uniform float u_scale;',
        'uniform float u_pixel;',
        'uniform float u_from;',
        'uniform float u_to;',
        'uniform float u_trans;',
        'uniform float u_flash;',
        '',
        'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
        'float noise(vec2 p) {',
        '   vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);',
        '   return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), f.x),',
        '              mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x), f.y);',
        '}',
        'float fbm(vec2 p) {',
        '   float v = 0.0; float a = 0.5;',
        '   mat2 rot = mat2(0.877582, 0.479426, -0.479426, 0.877582);',
        '   for (int i = 0; i < 5; i++) {',
        '       v += a * noise(p);',
        '       p = rot * p * 2.0 + vec2(10.0);',
        '       a *= 0.5;',
        '   }',
        '   return v;',
        '}',
        '',
        'vec3 checkerColor(vec2 uv) {',
        '   uv.x += u_time * u_speed * 0.1;',
        '   uv.y += u_time * u_speed * 0.05;',
        '   uv.x += sin(uv.y * 10.0 + u_time) * 0.02;',
        '   float check = mod(floor(uv.x * u_scale) + floor(uv.y * u_scale), 2.0);',
        '   return mix(u_color1.rgb, u_color2.rgb, check);',
        '}',
        '',
        'vec3 plainsSky(vec2 uv) {',
        '   vec3 skyTop = vec3(0.30, 0.55, 0.92);',
        '   vec3 skyBot = vec3(0.80, 0.92, 1.0);',
        '   vec3 sky = mix(skyBot, skyTop, uv.y);',
        '   float ratio = u_resolution.y / u_resolution.x;',
        '   vec2 sun_pos = vec2(0.78, 0.25);',
        '   float sun_d = length((uv - sun_pos) * vec2(1.0, ratio));',
        '   float sun_core = step(sun_d, 0.09);',
        '   float sun_halo = step(sun_d, 0.16) * 0.4;',
        '   float sun_outer = step(sun_d, 0.28) * 0.15;',
        '   sky = mix(sky, vec3(1.0, 1.0, 0.9), clamp(sun_core + sun_halo + sun_outer, 0.0, 1.0));',
        '   vec2 cloud_uv = uv * 3.0;',
        '   cloud_uv.x += u_time * 0.04;',
        '   float c = fbm(cloud_uv);',
        '   float cloud_zone = smoothstep(0.7, 0.2, uv.y);',
        '   float cloud_mask = step(0.55, c);',
        '   float cloud_highlight = step(0.65, c);',
        '   if (cloud_mask > 0.0 && cloud_zone > 0.0) {',
        '       vec3 base_c = vec3(0.9, 0.95, 1.0);',
        '       vec3 high_c = vec3(1.0, 1.0, 1.0);',
        '       vec3 final_c = mix(base_c, high_c, cloud_highlight);',
        '       if (fbm(cloud_uv + vec2(0.0, -0.05)) < 0.55) final_c *= 0.85;',
        '       sky = mix(sky, final_c, cloud_zone * 0.95);',
        '   }',
        '   return sky;',
        '}',
        '',
        'vec3 snowySky(vec2 uv) {',
        '   vec3 sky_top = vec3(0.60, 0.25, 0.45);',
        '   vec3 sky_bottom = vec3(0.95, 0.55, 0.25);',
        '   vec3 sky = mix(sky_top, sky_bottom, uv.y);',
        '   float asp = u_resolution.x / u_resolution.y;',
        '   vec2 sun_pos = vec2(0.78, 0.45);',
        '   vec2 sun_d = (uv - sun_pos) * vec2(asp, 1.0);',
        '   float sun_dist = length(sun_d);',
        '   float sun_r = 0.075;',
        '   float sun_mask = step(sun_dist, sun_r);',
        '   float glow = smoothstep(sun_r * 3.5, sun_r * 1.05, sun_dist) * 0.3;',
        '   sky = mix(sky, vec3(1.0, 0.95, 0.80) * 0.8, glow);',
        '   sky = mix(sky, vec3(1.0, 0.95, 0.80), sun_mask);',
        '   float t = u_time * 0.03;',
        '   float n = noise(vec2(uv.x * 3.0 - t, uv.y * 6.0));',
        '   float n2 = noise(vec2(uv.x * 6.0 - t * 1.5, uv.y * 12.0));',
        '   float cloud_val = n * 0.7 + n2 * 0.3;',
        '   float cloud_zone = smoothstep(0.7, 0.2, uv.y);',
        '   if (cloud_zone > 0.0 && cloud_val > 0.55) {',
        '       float highlight = step(0.65, cloud_val);',
        '       vec3 c_col = mix(vec3(0.85, 0.45, 0.35), vec3(0.95, 0.65, 0.30), highlight);',
        '       sky = mix(sky, c_col, step(0.55, cloud_val) * cloud_zone * 0.9);',
        '   }',
        '   float ridge1 = 0.72 + 0.10 * sin(uv.x * 5.5) + 0.05 * sin(uv.x * 13.0 + 0.8);',
        '   float ridge2 = 0.80 + 0.07 * cos(uv.x * 8.0) + 0.04 * cos(uv.x * 19.0 + 1.2);',
        '   float py = floor(uv.y / (u_pixel / u_resolution.y)) * (u_pixel / u_resolution.y);',
        '   if (py > ridge1) sky = mix(sky, vec3(0.35, 0.15, 0.25), 0.95);',
        '   if (py > ridge2) sky = mix(sky, vec3(0.20, 0.08, 0.15), 0.98);',
        '   return sky;',
        '}',
        '',
        'vec3 computeScene(float s, vec2 cuv, vec2 scuv) {',
        '   float ab = 0.0018;',
        '   if (s < 0.5) {',
        '       vec3 c;',
        '       c.r = checkerColor(cuv + vec2(ab, 0.0)).r;',
        '       c.g = checkerColor(cuv).g;',
        '       c.b = checkerColor(cuv - vec2(ab, 0.0)).b;',
        '       return c;',
        '   } else if (s < 1.5) {',
        '       return plainsSky(scuv);',
        '   }',
        '   return snowySky(scuv);',
        '}',
        '',
        'void main() {',
        '   vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        '   vec2 cc = uv - 0.5; float d = dot(cc, cc);',
        '   vec2 cuv = uv + cc * d * 0.15;',
        '',
        '   vec2 block = floor(gl_FragCoord.xy / u_pixel) * u_pixel;',
        '   vec2 suv = block / u_resolution.xy;',
        '   vec2 scc = suv - 0.5; float sd = dot(scc, scc);',
        '   vec2 scuv = suv + scc * sd * 0.15;',
        '',
        '   vec3 fromC = computeScene(u_from, cuv, scuv);',
        '   vec3 toC = computeScene(u_to, cuv, scuv);',
        '   vec3 col = mix(fromC, toC, u_trans);',
        '',
        '   float sl = mod(floor(gl_FragCoord.y / 2.0), 2.0);',
        '   col *= (1.0 - 0.14 * sl);',
        '   float vig = smoothstep(0.7, 0.1, d);',
        '   col *= mix(0.15, 1.0, vig);',
        '   col *= 0.97 + 0.03 * sin(u_time * 9.0);',
        '',
        '   col = mix(col, vec3(1.0), u_flash);',
        '',
        '   if (cuv.x < 0.0 || cuv.x > 1.0 || cuv.y < 0.0 || cuv.y > 1.0) col = vec3(0.0);',
        '   gl_FragColor = vec4(col, 1.0);',
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

    var program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('[hero-shader] link error:', gl.getShaderInfoLog(program));
        canvas.style.background = '#5a0a0a';
        return;
    }
    gl.useProgram(program);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(program, 'u_resolution');
    var uTime = gl.getUniformLocation(program, 'u_time');
    var uColor1 = gl.getUniformLocation(program, 'u_color1');
    var uColor2 = gl.getUniformLocation(program, 'u_color2');
    var uSpeed = gl.getUniformLocation(program, 'u_speed');
    var uScale = gl.getUniformLocation(program, 'u_scale');
    var uPixel = gl.getUniformLocation(program, 'u_pixel');
    var uFrom = gl.getUniformLocation(program, 'u_from');
    var uTo = gl.getUniformLocation(program, 'u_to');
    var uTrans = gl.getUniformLocation(program, 'u_trans');
    var uFlash = gl.getUniformLocation(program, 'u_flash');

    gl.uniform4f(uColor1, 0.55, 0.07, 0.07, 1.0);
    gl.uniform4f(uColor2, 0.70, 0.55, 0.10, 1.0);
    gl.uniform1f(uSpeed, 1.0);
    gl.uniform1f(uScale, 20.0);
    gl.uniform1f(uPixel, 4.0);

    var SCENES = [0.0, 1.0, 2.0];   // 0 = checkerboard, 1 = Plains, 2 = Snowy
    var HOLD = 11.0;                // seconds each scene is shown
    var FLASH = 1.8;                // white flash / crossfade length
    var CYCLE = HOLD + FLASH;

    function smoothstep(a, b, x) {
        var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
    }

    function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
        }
        gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    var start = performance.now();
    function render(now) {
        resize();
        var elapsed = (now - start) / 1000.0;
        gl.uniform1f(uTime, elapsed);

        var stepIndex = Math.floor(elapsed / CYCLE);
        var local = elapsed - stepIndex * CYCLE;
        var fromScene = SCENES[stepIndex % 3];
        var toScene = SCENES[(stepIndex + 1) % 3];

        var flash = 0.0;
        var trans = 0.0;
        if (local > HOLD) {
            var p = Math.min(1, (local - HOLD) / FLASH);
            flash = Math.sin(p * Math.PI);          // white flash 0 -> 1 -> 0
            trans = smoothstep(0.15, 0.85, p);       // crossfade between scenes
        }

        gl.uniform1f(uFrom, fromScene);
        gl.uniform1f(uTo, toScene);
        gl.uniform1f(uTrans, trans);
        gl.uniform1f(uFlash, flash);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.addEventListener('resize', resize);
})();
