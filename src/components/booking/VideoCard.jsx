import { useState, useRef, useEffect } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import {
  useVideoTexture,
  shaderMaterial,
  Html,
  ContactShadows,
  useCursor,
} from '@react-three/drei';
import * as THREE from 'three';

// Definición del Shader (B/N a Color con boost de brillo)
const CardMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uHover: 0,
    uOpacity: 1,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uHover;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      // Escala de grises
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      gray *= 0.5;   // 0.5 = 50% más oscuro
      // Mezcla suave
      vec3 finalColor = mix(vec3(gray), color.rgb, uHover);
      // Boost de brillo al activarse
      finalColor = mix(finalColor, finalColor * 1.1, uHover);
      gl_FragColor = vec4(finalColor, color.a);
    }
  `
);

extend({ CardMaterial });

export function VideoCard({
  videoUrl,
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  available = true,
  surfaceType,
  capacity,
  onSelect,
}) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [cursorLocal, setCursorLocal] = useState(new THREE.Vector3());

  // Cambia el cursor del mouse a "pointer"
  useCursor(hovered && available);

  const texture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
    crossOrigin: 'Anonymous',
  });

  // Reproducir/Pausar video
  useEffect(() => {
    if (texture.image) {
      if (hovered && available) {
        texture.image.play();
      } else {
        texture.image.pause();
      }
    }
  }, [hovered, texture, available]);

  // Animaciones suaves (Posición y Color)
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Desplazamiento en el eje Z (hacia adelante/atrás)
      const baseZ = 0;
      const hoverZ = hovered && available ? 0.5 : baseZ;
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        hoverZ,
        0.15
      );
    }
    // Transición de shader
    if (materialRef.current) {
      const targetHover = hovered && available ? 1 : 0;
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value,
        targetHover,
        0.25
      );
    }
  });

  const labelOffset = new THREE.Vector3(0.6, 0.6, 0.15);

  const handleClick = () => {
    if (available && onSelect) {
      onSelect();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (available) {
            setHovered(true);
          }
        }}
        onPointerOut={() => setHovered(false)}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (available) {
            setCursorLocal(e.object.worldToLocal(e.point.clone()));
          }
        }}
        onClick={handleClick}
      >
        <planeGeometry args={[3.2, 1.8]} />
        <cardMaterial
          ref={materialRef}
          uTexture={texture}
          transparent
          opacity={available ? 1 : 0.5}
        />

        {hovered && available && (
          <Html
            position={cursorLocal.clone().add(labelOffset)}
            style={{ pointerEvents: 'none' }}
            center
            distanceFactor={10}
          >
            <div className="label-container">
              <div className="label-content">
                <h3 className="label-title">{label}</h3>
                {(surfaceType || capacity) && (
                  <div className="label-specs">
                    {surfaceType && <span className="label-spec-item">{surfaceType}</span>}
                    {capacity && (
                      <span className="label-spec-item">
                        <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        {capacity} players
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="label-pointer"></div>
            </div>
          </Html>
        )}
      </mesh>

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={1}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

