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
        // CRT barrel distortion (tube curvature)
        '   vec2 cc = uv - 0.5;',
        '   float d = dot(cc, cc);',
        '   vec2 cuv = uv + cc * d * 0.15;',
        // chromatic aberration
        '   float ab = 0.0018;',
        '   vec3 col;',
        '   col.r = checkerColor(cuv + vec2(ab, 0.0)).r;',
        '   col.g = checkerColor(cuv).g;',
        '   col.b = checkerColor(cuv - vec2(ab, 0.0)).b;',
        // scanlines
        '   float sl = mod(floor(gl_FragCoord.y / 2.0), 2.0);',
        '   col *= (1.0 - 0.14 * sl);',
        // vignette
        '   float vig = smoothstep(0.7, 0.1, d);',
        '   col *= mix(0.15, 1.0, vig);',
        // flicker
        '   col *= 0.97 + 0.03 * sin(u_time * 9.0);',
        // mask outside the tube
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
        console.error('[hero-shader] link error:', gl.getProgramInfoLog(program));
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

    gl.uniform4f(uColor1, 0.55, 0.07, 0.07, 1.0);
    gl.uniform4f(uColor2, 0.70, 0.55, 0.10, 1.0);
    gl.uniform1f(uSpeed, 1.0);
    gl.uniform1f(uScale, 20.0);

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
        gl.uniform1f(uTime, (now - start) / 1000.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.addEventListener('resize', resize);
})();
