import { OrbitControls } from '@react-three/drei'
import { ArtMesh } from './ArtMesh'

interface ExperienceProps {
    imageId: string | number
}

export const Experience: React.FC<ExperienceProps> = ({ imageId }) => {
    return (
        <>
            <OrbitControls 
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI / 2 + 1.5}
                minAzimuthAngle={-Math.PI / 2 + 0.5}
                maxAzimuthAngle={Math.PI / 2 - 0.5}
                enableDamping={true}
            />

            <ambientLight intensity={0.8} />
            <pointLight position={[0, 0, 9]} intensity={0.5} />
            <directionalLight position={[-5, 10, 3]} intensity={1} />

            <ArtMesh imageId={imageId} />
            
            <mesh position-y={-10} rotation-x={-Math.PI / 2} >
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#444444" metalness={0} roughness={1} />
            </mesh>
        </>
    )
}
