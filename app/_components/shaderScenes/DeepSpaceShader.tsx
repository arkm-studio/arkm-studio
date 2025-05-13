"use client";

import * as THREE from "three";
import React, {
  useRef,
  useMemo,
  Suspense,
  useEffect,
  useState,
  ReactNode,
  memo,
  useCallback,
} from "react";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
  ReactThreeFiber,
} from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import classNames from "classnames/bind";
import styles from "./DeepSpace.module.scss";

// Registrar GSAP plugin (solo en cliente)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cx = classNames.bind(styles);

// Paleta de colores profesional
const COLORS = {
  primary: "#111827", // Azul muy oscuro
  secondary: "#1F2937", // Gris azulado oscuro
  accent: "#3B82F6", // Azul para acentos sutiles
};

// // VERTEX SHADER PROFESIONAL Y SUTIL
// const vertexShader = `
//   uniform float uTime;
//   uniform float uScrollProgress;
//   uniform vec2 uMouse;
//   uniform float uDistortionFrequency;
//   uniform float uDistortionStrength;
//   uniform float uDepthOffset;
//   uniform bool uDisableAnimation;

//   varying vec2 vUv;
//   varying float vElevation;
//   varying float vDistortion;

//   // Función de ruido sutil optimizada
//   float noise(vec2 p) {
//     return sin(p.x * 0.5 + p.y * 0.5 + uTime * 0.5) *
//            cos(p.x * 0.4 + p.y * 0.3 + uTime * 0.3) * 0.1;
//   }

//   void main() {
//     vUv = uv;

//     // Posición base
//     vec3 pos = position;

//     // Solo aplicar efectos si las animaciones están habilitadas
//     if (!uDisableAnimation) {
//       // Distorsión sutil basada en ruido
//       float distortion = noise(pos.xy * uDistortionFrequency) * uDistortionStrength;

//       // Reducir distorsión gradualmente con scroll
//       distortion *= (1.0 - uScrollProgress * 0.8);

//       // Aplicar distorsión sutil
//       pos.z += distortion;

//       // Descenso suave con aceleración controlada
//       float descent = pow(uScrollProgress, 1.2) * 1.5;

//       // Aplicar descenso y ligero desplazamiento en profundidad
//       pos.y -= descent;
//       pos.z += uScrollProgress * uDepthOffset;

//       // Ligera inclinación basada en scroll
//       float tiltAngle = uScrollProgress * 0.15;
//       pos.z -= sin(tiltAngle) * 0.1;

//       // Variables para fragment shader
//       vElevation = distortion;
//       vDistortion = abs(distortion) * 5.0;
//     } else {
//       // Sin animación, valores por defecto
//       vElevation = 0.0;
//       vDistortion = 0.0;
//     }

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   }
// `;

// // FRAGMENT SHADER PROFESIONAL Y SUTIL
// const fragmentShader = `
//   uniform vec3 uColor;
//   uniform vec3 uSecondaryColor;
//   uniform vec3 uAccentColor;
//   uniform float uTime;
//   uniform sampler2D uTexture;
//   uniform float uColorBalance;
//   uniform float uScrollProgress;
//   uniform float uSharpenStrength;
//   uniform float uVignetteIntensity;
//   uniform bool uDisableAnimation;

//   varying vec2 vUv;
//   varying float vElevation;
//   varying float vDistortion;

//   void main() {
//     // UVs con ligero desplazamiento basado en distorsión
//     vec2 adjustedUV = vUv;

//     if (!uDisableAnimation) {
//       adjustedUV.x += vDistortion * 0.01 * (1.0 - uScrollProgress * 0.5);
//     }

//     // Color base desde textura
//     vec4 texColor = texture2D(uTexture, adjustedUV);
//     vec3 color = texColor.rgb;

//     if (!uDisableAnimation) {
//       // Filtro de nitidez sutil
//       float sharpStrength = uSharpenStrength * (1.0 + uScrollProgress * 0.5);
//       vec3 blurred = (
//         texture2D(uTexture, adjustedUV + vec2(0.001, 0.001)).rgb +
//         texture2D(uTexture, adjustedUV + vec2(-0.001, 0.001)).rgb +
//         texture2D(uTexture, adjustedUV + vec2(0.001, -0.001)).rgb +
//         texture2D(uTexture, adjustedUV + vec2(-0.001, -0.001)).rgb
//       ) * 0.25;
//       color += (color - blurred) * sharpStrength;

//       // Balance de color ajustado con scroll
//       float balance = uColorBalance * (1.0 + uScrollProgress * 0.3);
//       vec3 colorTint = mix(uColor, uSecondaryColor, uScrollProgress);
//       color = mix(color, colorTint, balance);

//       // Añadir sutil acento de color basado en elevación
//       vec3 accentHighlight = uAccentColor * vDistortion * 1.5 * (1.0 - uScrollProgress * 0.7);
//       color += accentHighlight;

//       // Viñeta profesional que se intensifica sutilmente con scroll
//       float vignetteStrength = uVignetteIntensity * (1.0 + uScrollProgress * 0.5);
//       float vignette = smoothstep(0.4 - uScrollProgress * 0.1, 0.0, length(vUv - 0.5));
//       color = mix(color, vec3(0.02, 0.02, 0.05), (1.0 - vignette) * vignetteStrength);

//       // Ajuste de brillo basado en scroll (oscurecer gradualmente)
//       color *= max(0.7, 1.0 - uScrollProgress * 0.4);
//     } else {
//       // Aplicar una viñeta básica cuando las animaciones están desactivadas
//       float vignette = smoothstep(0.4, 0.0, length(vUv - 0.5));
//       color = mix(color, vec3(0.02, 0.02, 0.05), (1.0 - vignette) * uVignetteIntensity);
//     }

//     gl_FragColor = vec4(color, 1.0);
//   }
// `;

// VERTEX SHADER: ONDAS FLUIDAS
const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform float uDistortionFrequency;
  uniform float uDistortionStrength;
  uniform float uDepthOffset;
  uniform bool uDisableAnimation;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistortion;
  varying vec3 vNormal;

  // Función de ruido Perlin simplificada para ondas orgánicas
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // Suavizado cúbico
    
    float a = sin(i.x + i.y * 0.57 + uTime * 0.2) * 0.5 + 0.5;
    float b = sin((i.x + 1.0) + i.y * 0.57 + uTime * 0.2) * 0.5 + 0.5;
    float c = sin(i.x + (i.y + 1.0) * 0.57 + uTime * 0.2) * 0.5 + 0.5;
    float d = sin((i.x + 1.0) + (i.y + 1.0) * 0.57 + uTime * 0.2) * 0.5 + 0.5;
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Posición base
    vec3 pos = position;
    
    // Solo aplicar efectos si las animaciones están habilitadas
    if (!uDisableAnimation) {
      // Crear ondas fluidas basadas en el tiempo
      float waveX = sin(uv.x * 5.0 + uTime * 0.5) * 0.02;
      float waveY = cos(uv.y * 4.0 + uTime * 0.4) * 0.02;
      
      // Distorsión orgánica
      float wave = noise(pos.xy * uDistortionFrequency + uTime * 0.1) * uDistortionStrength;
      
      // Disminuir efecto con scroll
      wave *= (1.0 - uScrollProgress * 0.7);
      waveX *= (1.0 - uScrollProgress * 0.8);
      waveY *= (1.0 - uScrollProgress * 0.8);
      
      // Aplicar ondas al eje Z
      pos.z += wave + waveX + waveY;
      
      // Desplazamiento suave con scroll
      float descent = pow(uScrollProgress, 1.3) * 1.5;
      pos.y -= descent;
      pos.z += uScrollProgress * uDepthOffset;
      
      // Leve inclinación
      float tiltAngle = uScrollProgress * 0.12;
      pos.z -= sin(tiltAngle) * 0.1;
      
      // Variables para fragment shader
      vElevation = wave + waveX + waveY;
      vDistortion = abs(wave) * 6.0;
    } else {
      vElevation = 0.0;
      vDistortion = 0.0;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// FRAGMENT SHADER: ONDAS FLUIDAS
const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uAccentColor;
  uniform float uTime;
  uniform sampler2D uTexture;
  uniform float uColorBalance;
  uniform float uScrollProgress;
  uniform float uSharpenStrength;
  uniform float uVignetteIntensity;
  uniform bool uDisableAnimation;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistortion;
  varying vec3 vNormal;

  void main() {
    // UV perturbado para efecto fluido
    vec2 adjustedUV = vUv;
    
    if (!uDisableAnimation) {
      float disturbance = sin(vUv.y * 10.0 + uTime * 0.3) * 0.002 * (1.0 - uScrollProgress);
      adjustedUV.x += disturbance + vDistortion * 0.01;
      adjustedUV.y += vDistortion * 0.005;
    }
    
    // Color base desde textura
    vec4 texColor = texture2D(uTexture, adjustedUV);
    vec3 color = texColor.rgb;
    
    if (!uDisableAnimation) {
      // Mejora de detalle con nitidez
      float sharpStrength = uSharpenStrength * (1.0 + uScrollProgress * 0.4);
      vec3 blurred = (
        texture2D(uTexture, adjustedUV + vec2(0.001, 0.001)).rgb + 
        texture2D(uTexture, adjustedUV + vec2(-0.001, 0.001)).rgb + 
        texture2D(uTexture, adjustedUV + vec2(0.001, -0.001)).rgb + 
        texture2D(uTexture, adjustedUV + vec2(-0.001, -0.001)).rgb
      ) * 0.25;
      color += (color - blurred) * sharpStrength;
      
      // Transición de color suave basada en scroll
      float balance = uColorBalance * (1.0 + uScrollProgress * 0.4);
      vec3 colorTint = mix(uColor, uSecondaryColor, uScrollProgress);
      color = mix(color, colorTint, balance);
      
      // Iluminación suave basada en distorsión
      vec3 light = normalize(vec3(0.5, 0.5, 1.0));
      float diffuse = 0.5 + max(0.0, dot(vNormal, light)) * 0.5;
      color *= 0.9 + diffuse * 0.2 * (1.0 - uScrollProgress * 0.5);
      
      // Destellos de acento sutiles
      float highlight = smoothstep(0.5, 0.8, vDistortion);
      highlight *= (sin(uTime * 0.5) * 0.5 + 0.5) * (1.0 - uScrollProgress * 0.7);
      color = mix(color, uAccentColor, highlight * 0.1);
      
      // Viñeta refinada
      float vignetteStrength = uVignetteIntensity * (1.0 + uScrollProgress * 0.4);
      float vignette = smoothstep(0.5 - uScrollProgress * 0.15, 0.0, length(vUv - 0.5));
      color = mix(color, vec3(0.02, 0.03, 0.06), (1.0 - vignette) * vignetteStrength);
      
      // Ajuste de brillo
      color *= max(0.8, 1.0 - uScrollProgress * 0.35);
    } else {
      // Viñeta básica para modo desactivado
      float vignette = smoothstep(0.5, 0.0, length(vUv - 0.5));
      color = mix(color, vec3(0.02, 0.03, 0.06), (1.0 - vignette) * uVignetteIntensity * 0.8);
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Tipo para el material
export type DeepSpaceMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uColor: THREE.Color;
  uSecondaryColor: THREE.Color;
  uAccentColor: THREE.Color;
  uTexture: THREE.Texture;
  uMouse: THREE.Vector2;
  uScrollProgress: number;
  uDistortionFrequency: number;
  uDistortionStrength: number;
  uDepthOffset: number;
  uColorBalance: number;
  uSharpenStrength: number;
  uVignetteIntensity: number;
  uDisableAnimation: boolean;
};

// Crear material
const DeepSpaceMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(COLORS.primary),
    uSecondaryColor: new THREE.Color(COLORS.secondary),
    uAccentColor: new THREE.Color(COLORS.accent),
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uScrollProgress: 0.0,
    uDistortionFrequency: 2.0,
    uDistortionStrength: 0.05,
    uDepthOffset: 0.2,
    uColorBalance: 0.2,
    uSharpenStrength: 0.3,
    uVignetteIntensity: 0.5,
    uDisableAnimation: false,
  },
  vertexShader,
  fragmentShader
);

extend({ DeepSpaceMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      deepSpaceMaterial: ReactThreeFiber.Object3DNode<
        DeepSpaceMaterialImpl,
        typeof DeepSpaceMaterial
      >;
    }
  }
}

// CONTROLADOR PROFESIONAL CON TRANSICIONES SUAVES
class ProfessionalTransitionController {
  private tl: gsap.core.Timeline | null = null;
  private meshRef: any = null;
  private matRef: any = null;
  private initialScale: number = 1;
  private initialPosition = new THREE.Vector3();
  private disableAnimation: boolean = false;

  // Configuración profesional con valores sutiles
  private readonly config = {
    // Descenso
    descent: {
      distance: 1.5, // Distancia total de descenso
      curve: "power2.inOut", // Curva de ease para movimiento suave
      depthChange: 0.2, // Cambio de profundidad durante el descenso
    },

    // Escala
    scale: {
      start: 1.0, // Escala inicial
      end: 0.6, // Escala final (60% del original)
      easePoint: 0.6, // Punto donde la escala cambia más rápidamente
    },

    // Rotación
    rotation: {
      maxAngleX: 0.1, // Rotación sutil en X
      maxAngleY: 0.05, // Rotación muy sutil en Y
    },

    // Tiempo de transición
    timing: {
      durationFactor: 0.8, // Suavidad de las transiciones
    },

    // Efectos visuales
    visual: {
      distortionReduction: 0.8, // Reducción de distorsión con scroll
      vignetteFactor: 0.5, // Factor de viñeta
      colorBalance: 0.25, // Balance de color
    },
  };

  // Inicializar controlador
  init(meshRef: any, matRef: any, disableAnimation: boolean = false): void {
    if (typeof window === "undefined") return;

    this.meshRef = meshRef;
    this.matRef = matRef;
    this.disableAnimation = disableAnimation;

    // Guardar escala y posición inicial
    if (meshRef.current) {
      this.initialScale = meshRef.current.scale.x;
      this.initialPosition.copy(meshRef.current.position);
    }

    // Inicializar material con valores profesionales
    if (matRef.current) {
      matRef.current.uDisableAnimation = disableAnimation;
      matRef.current.uDistortionFrequency = 2.0;
      matRef.current.uDistortionStrength = disableAnimation ? 0 : 0.05; // Distorsión muy sutil
      matRef.current.uDepthOffset = this.config.descent.depthChange;
      matRef.current.uColorBalance = this.config.visual.colorBalance;
      matRef.current.uSharpenStrength = 0.3; // Nitidez sutil
      matRef.current.uVignetteIntensity = this.config.visual.vignetteFactor;
    }

    // Solo configurar ScrollTrigger si las animaciones están habilitadas
    if (!disableAnimation) {
      this.setupScrollTrigger();
    }
  }

  // Configurar ScrollTrigger
  private setupScrollTrigger(): void {
    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: this.config.timing.durationFactor, // Transición suave
        onUpdate: (self) => {
          this.updateTransition(self.progress);
        },
      },
    });
  }

  // Actualizar transición
  private updateTransition(progress: number): void {
    if (
      !this.meshRef?.current ||
      !this.matRef?.current ||
      this.disableAnimation
    )
      return;

    const mesh = this.meshRef.current;
    const mat = this.matRef.current;

    // Actualizar uniforms del shader
    mat.uScrollProgress = progress;

    // Aplicar descenso con curva de easing
    let easedProgress: number;
    // Convertir string de ease a función matemática simple
    if (this.config.descent.curve === "power2.inOut") {
      easedProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
    } else {
      easedProgress = progress;
    }

    // Descenso suave
    const descentDistance = easedProgress * this.config.descent.distance;

    // Movimiento sutil en profundidad
    const depthOffset = progress * this.config.descent.depthChange;

    // Posición actualizada
    mesh.position.set(
      this.initialPosition.x,
      this.initialPosition.y - descentDistance,
      this.initialPosition.z + depthOffset
    );

    // Rotación sutil
    const rotX = progress * this.config.rotation.maxAngleX;
    const rotY = Math.sin(progress * Math.PI) * this.config.rotation.maxAngleY;

    mesh.rotation.set(rotX, rotY, 0);

    // Escala que se reduce de forma profesional
    let scaleFactor: number;

    // Usar punto de ease para transición de escala más suave
    if (progress < this.config.scale.easePoint) {
      // Transición suave hasta el punto de ease
      const scaleProgress = progress / this.config.scale.easePoint;
      scaleFactor = this.lerp(
        this.config.scale.start,
        this.config.scale.end,
        scaleProgress * scaleProgress // Ease cuadrático para suavidad
      );
    } else {
      // Mantener escala mínima después del punto de ease
      scaleFactor = this.config.scale.end;
    }

    // Aplicar escala actualizada
    mesh.scale.set(
      this.initialScale * scaleFactor,
      this.initialScale * scaleFactor,
      this.initialScale * scaleFactor
    );

    // Reducir distorsión progresivamente
    mat.uDistortionStrength =
      0.05 * (1.0 - progress * this.config.visual.distortionReduction);

    // Ajustar viñeta
    mat.uVignetteIntensity =
      this.config.visual.vignetteFactor * (1.0 + progress * 0.3);
  }

  // Interpolación lineal
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  // Limpiar recursos
  destroy(): void {
    if (this.tl) this.tl.kill();
    this.meshRef = null;
    this.matRef = null;
  }
}

// Instancia del controlador
const deepSpaceController = new ProfessionalTransitionController();

function MeshWithOverlay({ children }: { children: ReactNode }) {
  return <group>{children}</group>;
}

function DeepSpace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [meshDimensions, setMeshDimensions] = useState({ top: 0, height: 0 });

  // Detectar tablet
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkTablet = () => setIsTablet(window.innerWidth <= 1024);
    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  // Detectar móvil específicamente para la cámara
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fade in
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" }
    );
  }, []);

  // Callback para recibir dimensiones del mesh desde FloatingDeepSpace
  const updateMeshDimensions = useCallback(
    (dimensions: { top: number; height: number }) => {
      setMeshDimensions(dimensions);
    },
    []
  );

  return (
    <div ref={containerRef} className={cx("container")}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
          precision: isTablet ? "mediump" : "highp",
        }}
        dpr={[1, isTablet ? 1.5 : 2]}
        camera={{
          position: [0, 0, isMobile ? 3 : 2.5],
          fov: isMobile ? 35 : 30,
          near: 0.1,
          far: 100,
        }}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <FloatingDeepSpace
            isTablet={isTablet}
            isMobile={isMobile}
            onMeshUpdate={updateMeshDimensions}
          />
        </Suspense>
      </Canvas>

      {/* Gradient overlay posicionado encima de la textura */}
      {isTablet && meshDimensions.height > 0 && (
        <div
          className={cx("image-gradient-overlay")}
          style={{
            top: `${meshDimensions.top}%`,
            height: `${meshDimensions.height}%`,
          }}
        ></div>
      )}
    </div>
  );
}

function FloatingDeepSpace({
  isTablet,
  isMobile,
  onMeshUpdate,
}: {
  isTablet: boolean;
  isMobile: boolean;
  onMeshUpdate: (dimensions: { top: number; height: number }) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<DeepSpaceMaterialImpl>(null);
  const { mouse, viewport, size } = useThree();

  // Geometría y dimensiones
  const geometry = useMemo(() => new THREE.PlaneGeometry(3, 2, 10, 10), []);
  const baseScale = isMobile ? 0.9 : 0.4;
  const responsiveScale = Math.min(1, size.width / 1200) * baseScale;
  const yOffset = viewport.height / 2 - (2 * responsiveScale) / 2;

  // Calcular y reportar dimensiones para el overlay
  useEffect(() => {
    if (!meshRef.current) return;

    // Convertir posición y escala 3D a porcentaje de pantalla para el overlay DOM
    const meshHeight = 2 * responsiveScale; // height of plane * scale
    const viewportHeightPercent = (meshHeight / viewport.height) * 100;

    // Calcular la posición top como porcentaje
    const topPositionPercent =
      50 - (yOffset / viewport.height) * 100 - viewportHeightPercent / 2;

    onMeshUpdate({
      top: topPositionPercent,
      height: viewportHeightPercent,
    });
  }, [viewport, responsiveScale, yOffset, onMeshUpdate]);

  // Inicializar controlador
  useEffect(() => {
    if (!matRef.current) return;

    if (!isTablet) {
      gsap.from(matRef.current, {
        uDistortionStrength: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }

    deepSpaceController.init(meshRef, matRef, isTablet);

    return () => {
      deepSpaceController.destroy();
    };
  }, [isTablet]);

  // Frame loop
  useFrame(({ clock }) => {
    if (matRef.current && !isTablet) {
      matRef.current.uTime = clock.getElapsedTime() * 0.5;
      matRef.current.uMouse.set(mouse.x * 0.5 + 0.5, -mouse.y * 0.5 + 0.5);
    }
  });

  // Cargar textura
  const [texture] = useLoader(THREE.TextureLoader, [
    "/images/home/gradient.jpg",
  ]);

  return (
    <MeshWithOverlay>
      <mesh
        ref={meshRef}
        scale={[responsiveScale, responsiveScale, responsiveScale]}
        position={[0, yOffset, 0]}
      >
        <primitive object={geometry} attach="geometry" />
        <deepSpaceMaterial
          ref={matRef}
          uTexture={texture}
          uDisableAnimation={isTablet}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </MeshWithOverlay>
  );
}

export default memo(DeepSpace);
