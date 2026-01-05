import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { VideoCard } from './VideoCard';

// Función para calcular posiciones de las canchas en una grilla
const calculatePositions = (count) => {
  const positions = [];
  const spacing = 3.5;
  const cols = Math.ceil(Math.sqrt(count));

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = (col - (cols - 1) / 2) * spacing;
    const z = (row - (count / cols - 1) / 2) * spacing;
    positions.push([x, 0.1, z]);
  }

  return positions;
};

// Mapeo de videos por deporte
const getVideoUrl = (sport, index) => {
  const videoMap = {
    soccer: ['/soccer-1.mp4', '/soccer-2.mp4'],
    basketball: ['/basketball-1.mp4', '/basketball-2.mp4', '/basketball-3.mp4'],
    volleyball: ['/volleyball-1.mp4'],
  };
  const videos = videoMap[sport] || videoMap.basketball;
  return videos[index % videos.length];
};

export function CourtCard3D({ courts, selectedCourt, onCourtSelect, sport }) {
  const positions = calculatePositions(courts.length);

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#f4f6f8',
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        shadows
        camera={{ position: [-8, 8, 8], fov: 35, near: 0.1, far: 100 }}
        onCreated={(state) => state.gl.setClearColor('#f4f6f8')}
      >
        <Environment preset="sunset" />

        {courts.map((court, i) => (
          <VideoCard
            key={court.id}
            position={positions[i]}
            rotation={[-Math.PI / 2, 0, 0]}
            videoUrl={getVideoUrl(sport, i)}
            label={court.name}
            available={court.available}
            surfaceType={court.surfaceType}
            capacity={court.capacity}
            onSelect={() => onCourtSelect(court)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minDistance={8}
          maxDistance={12}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

