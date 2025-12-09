import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import { gsap } from "gsap";


type RippleGridProps = {
    enableRainbow?: boolean;
    gridColor?: string;
    rippleIntensity?: number;
    gridSize?: number;
    gridThickness?: number;
    fadeDistance?: number;
    vignetteStrength?: number;
    glowIntensity?: number;
    opacity?: number;
    gridRotation?: number;
    mouseInteraction?: boolean;
    mouseInteractionRadius?: number;
};

const RippleGrid: React.FC<RippleGridProps> = ({
    enableRainbow = false,
    gridColor = '#ffffff',
    rippleIntensity = 0.05,
    gridSize = 10.0,
    gridThickness = 15.0,
    fadeDistance = 1.5,
    vignetteStrength = 2.0,
    glowIntensity = 0.1,
    opacity = 1.0,
    gridRotation = 0,
    mouseInteraction = true,
    mouseInteractionRadius = 1
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
    const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
    const mouseInfluenceRef = useRef(0);
    const uniformsRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const hexToRgb = (hex: string): [number, number, number] => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
                : [1, 1, 1];
        };

        const renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio, 2),
            alpha: true
        });
        const gl = renderer.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.canvas.style.width = '100%';
        gl.canvas.style.height = '100%';
        containerRef.current.appendChild(gl.canvas);

        const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

        const frag = `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    if (gridRotation != 0.0) {
        uv = rotate(gridRotation * pi / 180.0) * uv;
    }

    float dist = length(uv);
    float func = sin(pi * (iTime - dist));
    vec2 rippleUv = uv + uv * func * rippleIntensity;

    if (mouseInteraction && mouseInfluence > 0.0) {
        vec2 mouseUv = (mousePosition * 2.0 - 1.0);
        mouseUv.x *= iResolution.x / iResolution.y;
        float mouseDist = length(uv - mouseUv);
        
        float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));
        
        float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
    }

    vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
    vec2 b = abs(a);

    float aaWidth = 0.5;
    vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
    );

    vec3 color = vec3(0.0);
    color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
    color += exp(-gridThickness * smoothB.y);
    color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
    color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

    if (glowIntensity > 0.0) {
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
    }

    float ddd = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));
    
    vec2 vignetteCoords = vUv - 0.5;
    float vignetteDistance = length(vignetteCoords);
    float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
    vignette = clamp(vignette, 0.0, 1.0);
    
    vec3 t;
    if (enableRainbow) {
        t = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
        ) + 0.5;
    } else {
        t = gridColor;
    }

    float finalFade = ddd * vignette;
    float alpha = length(color) * finalFade * opacity;
    gl_FragColor = vec4(color * t * finalFade * opacity, alpha);
}`;

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: [1, 1] },
            enableRainbow: { value: enableRainbow },
            gridColor: { value: hexToRgb(gridColor) },
            rippleIntensity: { value: rippleIntensity },
            gridSize: { value: gridSize },
            gridThickness: { value: gridThickness },
            fadeDistance: { value: fadeDistance },
            vignetteStrength: { value: vignetteStrength },
            glowIntensity: { value: glowIntensity },
            opacity: { value: opacity },
            gridRotation: { value: gridRotation },
            mouseInteraction: { value: mouseInteraction },
            mousePosition: { value: [0.5, 0.5] },
            mouseInfluence: { value: 0 },
            mouseInteractionRadius: { value: mouseInteractionRadius }
        };

        uniformsRef.current = uniforms;

        const geometry = new Triangle(gl);
        const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
            const { clientWidth: w, clientHeight: h } = containerRef.current!;
            renderer.setSize(w, h);
            uniforms.iResolution.value = [w, h];
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!mouseInteraction || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            targetMouseRef.current = { x, y };
        };

        const handleMouseEnter = () => {
            if (!mouseInteraction) return;
            mouseInfluenceRef.current = 1.0;
        };

        const handleMouseLeave = () => {
            if (!mouseInteraction) return;
            mouseInfluenceRef.current = 0.0;
        };

        window.addEventListener('resize', resize);
        if (mouseInteraction) {
            containerRef.current.addEventListener('mousemove', handleMouseMove);
            containerRef.current.addEventListener('mouseenter', handleMouseEnter);
            containerRef.current.addEventListener('mouseleave', handleMouseLeave);
        }
        resize();

        const render = (t: number) => {
            uniforms.iTime.value = t * 0.001;

            const lerpFactor = 0.1;
            mousePositionRef.current.x += (targetMouseRef.current.x - mousePositionRef.current.x) * lerpFactor;
            mousePositionRef.current.y += (targetMouseRef.current.y - mousePositionRef.current.y) * lerpFactor;

            const currentInfluence = uniforms.mouseInfluence.value;
            const targetInfluence = mouseInfluenceRef.current;
            uniforms.mouseInfluence.value += (targetInfluence - currentInfluence) * 0.05;

            uniforms.mousePosition.value = [mousePositionRef.current.x, mousePositionRef.current.y];

            renderer.render({ scene: mesh });
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            if (mouseInteraction && containerRef.current) {
                containerRef.current.removeEventListener('mousemove', handleMouseMove);
                containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
                containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
            renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
            containerRef.current?.removeChild(gl.canvas);
        };
    }, []);

    useEffect(() => {
        if (!uniformsRef.current) return;

        const hexToRgb = (hex: string): [number, number, number] => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
                : [1, 1, 1];
        };

        uniformsRef.current.enableRainbow.value = enableRainbow;
        uniformsRef.current.gridColor.value = hexToRgb(gridColor);
        uniformsRef.current.rippleIntensity.value = rippleIntensity;
        uniformsRef.current.gridSize.value = gridSize;
        uniformsRef.current.gridThickness.value = gridThickness;
        uniformsRef.current.fadeDistance.value = fadeDistance;
        uniformsRef.current.vignetteStrength.value = vignetteStrength;
        uniformsRef.current.glowIntensity.value = glowIntensity;
        uniformsRef.current.opacity.value = opacity;
        uniformsRef.current.gridRotation.value = gridRotation;
        uniformsRef.current.mouseInteraction.value = mouseInteraction;
        uniformsRef.current.mouseInteractionRadius.value = mouseInteractionRadius;
    }, [
        enableRainbow,
        gridColor,
        rippleIntensity,
        gridSize,
        gridThickness,
        fadeDistance,
        vignetteStrength,
        glowIntensity,
        opacity,
        gridRotation,
        mouseInteraction,
        mouseInteractionRadius
    ]);

    return <div ref={containerRef} className="w-full h-full relative overflow-hidden [&_canvas]:block" />;
};

interface AnimatedButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
    ease?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    onClick,
    children,
    className = '',
    baseColor = '#ffffff',
    pillColor = '#060010',
    hoveredPillTextColor = '#000000',
    pillTextColor = '#ffffff',
    ease = 'power3.easeOut'
}) => {
    const circleRef = useRef<HTMLSpanElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const activeTweenRef = useRef<gsap.core.Tween | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const labelHoverRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const layout = () => {
            if (!buttonRef.current || !circleRef.current || !labelRef.current || !labelHoverRef.current) return;

            const pill = buttonRef.current;
            const circle = circleRef.current;
            const label = labelRef.current;
            const labelHover = labelHoverRef.current;

            const rect = pill.getBoundingClientRect();
            const { width: w, height: h } = rect;
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;

            gsap.set(circle, {
                xPercent: -50,
                scale: 0,
                transformOrigin: `50% ${originY}px`
            });

            if (label) gsap.set(label, { y: 0 });
            if (labelHover) gsap.set(labelHover, { y: h + 12, opacity: 0 });

            tlRef.current?.kill();
            const tl = gsap.timeline({ paused: true });

            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

            if (label) {
                tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
            }

            if (labelHover) {
                gsap.set(labelHover, { y: Math.ceil(h + 100), opacity: 0 });
                tl.to(labelHover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
            }

            tlRef.current = tl;
        };

        layout();

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (document.fonts) {
            document.fonts.ready.then(layout).catch(() => { });
        }

        return () => window.removeEventListener('resize', onResize);
    }, [ease]);

    const handleEnter = () => {
        const tl = tlRef.current;
        if (!tl) return;
        activeTweenRef.current?.kill();
        activeTweenRef.current = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = () => {
        const tl = tlRef.current;
        if (!tl) return;
        activeTweenRef.current?.kill();
        activeTweenRef.current = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const cssVars = {
        ['--base']: baseColor,
        ['--pill-bg']: pillColor,
        ['--hover-text']: hoveredPillTextColor,
        ['--pill-text']: pillTextColor,
    } as React.CSSProperties;

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className={`relative overflow-hidden inline-flex items-center justify-center h-12 no-underline rounded-full box-border font-semibold text-[16px] leading-[0] tracking-[0.2px] whitespace-nowrap cursor-pointer px-8 ${className}`}
            style={{
                ...cssVars,
                background: 'var(--pill-bg, #000)',
                color: 'var(--pill-text, #fff)',
            }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <span
                ref={circleRef}
                className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] pointer-events-none"
                style={{
                    background: 'var(--base, #fff)',
                    willChange: 'transform'
                }}
                aria-hidden="true"
            />
            <span className="label-stack relative inline-block leading-[1] z-[2] h-full flex items-center justify-center">
                <span
                    ref={labelRef}
                    className="pill-label relative z-[2] inline-block leading-[1]"
                    style={{
                        color: 'var(--pill-text, #fff)',
                        willChange: 'transform'
                    }}
                >
                    {children}
                </span>
                <span
                    ref={labelHoverRef}
                    className="pill-label-hover absolute left-0 top-0 w-full h-full flex items-center justify-center z-[3]"
                    style={{
                        color: 'var(--hover-text, #000)',
                        willChange: 'transform, opacity'
                    }}
                    aria-hidden="true"
                >
                    {children}
                </span>
            </span>
        </button>
    );
};

export default function TimeOut() {
    const navigate = useNavigate();

    const handleRetry = () => {
        const lastPage = localStorage.getItem('lastPage') || '/';
        navigate(lastPage);
    };

    const handleCandVagas = () => {
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 relative overflow-hidden">
            <div className="absolute inset-0">
                <RippleGrid
                    enableRainbow={false}
                    gridColor="#7e22ce"
                    rippleIntensity={0.05}
                    gridSize={10}
                    gridThickness={15}
                    mouseInteraction={true}
                    mouseInteractionRadius={1.2}
                    opacity={0.8}
                />
            </div>

            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 max-w-2xl">
                <div className="mb-8">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-white/70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl font-bold mb-4 text-white">
                    Tempo Esgotado
                </h1>

                <p className="text-xl text-gray-200 mb-6">
                    A página demorou demais para carregar
                </p>

                <p className="text-gray-300 mb-10 max-w-md mx-auto">
                    Verifique sua conexão com a internet ou tente novamente mais tarde.
                </p>

                <div className="flex justify-center gap-6 mb-10">
                    <AnimatedButton
                        onClick={handleRetry}
                        baseColor="#7e22ce"
                        pillColor="#000000"
                        hoveredPillTextColor="#000000"
                        pillTextColor="#ffffff"
                        ease="power2.easeOut"
                        className="border border-white/30 backdrop-blur-sm"
                    >
                        Tentar novamente
                    </AnimatedButton>

                    <AnimatedButton
                        onClick={handleCandVagas}
                        baseColor="#7e22ce"
                        pillColor="#000000"
                        hoveredPillTextColor="#000000"
                        pillTextColor="#ffffff"
                        ease="power2.easeOut"
                        className="border border-white/30 backdrop-blur-sm"
                    >
                        Voltar à tela inicial
                    </AnimatedButton>
                </div>

                <p className="mt-10 text-sm text-gray-400">
                    Se o problema persistir, entre em contato com o suporte técnico.
                </p>
            </div>

            <style>{`
        .label-stack {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .pill-label-hover {
          opacity: 0;
          transform: translateY(100%);
        }
        
        .pill-label {
          position: relative;
          transition: none;
        }
        
        button {
          position: relative;
          isolation: isolate;
        }
        
        .hover-circle {
          mix-blend-mode: normal;
          z-index: 1;
        }
        
        .pill-label-hover {
          z-index: 3;
        }
        
        .pill-label {
          z-index: 2;
        }
      `}</style>
        </div>
    );
}