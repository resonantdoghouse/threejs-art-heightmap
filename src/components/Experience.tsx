import { OrbitControls, useHelper, TransformControls } from '@react-three/drei'
import { ArtMesh } from './ArtMesh'
import { useRef } from 'react'
import * as THREE from 'three' // For DirectionalLightHelper
import { useControls } from 'leva'

interface ExperienceProps {
    imageId: string | number
}

export const Experience: React.FC<ExperienceProps> = ({ imageId }) => {
    const light = useRef<THREE.DirectionalLight>(null!)
    const { lightPosition, lightIntensity, debugLights } = useControls('Lighting', {
        lightPosition: { value: [3, 3, 10], step: 1 },
        lightIntensity: { value: 1, min: 0, max: 10 },
        debugLights: false
    })

    useHelper(debugLights && light, THREE.DirectionalLightHelper, 1)

    return (
        <>
            <OrbitControls 
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI / 2 + 1.5}
                minAzimuthAngle={-Math.PI / 2 + 0.5}
                maxAzimuthAngle={Math.PI / 2 - 0.5}
                enableDamping={true}
                makeDefault={!debugLights} // Disable orbit controls when debugging lights to avoid conflict
            />

            <ambientLight intensity={0.5} />
            <pointLight position={[0, 10, 0]} intensity={0.5} />
            <directionalLight 
                ref={light}
                position={lightPosition} 
                intensity={lightIntensity} 
            />
            {debugLights && <TransformControls object={light} />}

            <ArtMesh imageId={imageId} />
            
            <mesh position-y={-10} rotation-x={-Math.PI / 2} >
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#444444" />
            </mesh>
        </>
    )
}
