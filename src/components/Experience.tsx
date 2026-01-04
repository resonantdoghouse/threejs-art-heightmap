import { OrbitControls, useHelper, TransformControls, Environment, ContactShadows } from '@react-three/drei'
import { ArtMesh } from './ArtMesh'
import { useRef } from 'react'
import * as THREE from 'three' // For DirectionalLightHelper
import { useControls, button } from 'leva'
import { useFrame } from '@react-three/fiber'

interface ExperienceProps {
    imageId: string | number
}

export const Experience: React.FC<ExperienceProps> = ({ imageId }) => {
    const light = useRef<THREE.DirectionalLight>(null!)
    const controlsRef = useRef<any>(null)


    useControls('Help', {
        'Rotate': { value: 'Left Click + Drag', editable: false },
        'Zoom': { value: 'Scroll / Pinch', editable: false },
        'Pan': { value: 'Right Click + Drag', editable: false },
        'Heightmap': { value: 'Use "Height Map" panel', editable: false }
    }, { collapsed: true })

    const { lightPosition, lightIntensity, ambientIntensity, debugLights, followCamera } = useControls('Lighting', {
        lightPosition: { value: [0, 0, 10], step: 1 },
        lightIntensity: { value: 1, min: 0, max: 20 },
        ambientIntensity: { value: 0.5, min: 0, max: 5 },
        followCamera: true,
        debugLights: false
    })

    const { autoRotate, autoRotateSpeed, enableDamping } = useControls('Orbit Controls', {
        autoRotate: false,
        autoRotateSpeed: { value: 2, min: 0.1, max: 10 },
        enableDamping: true,
        'Reset View': button(() => {
            controlsRef.current?.reset()
        })
    })

    useHelper(debugLights && light, THREE.DirectionalLightHelper, 1)

    // Update light position to follow camera if enabled
    useFrame(({ camera }) => {
        if (followCamera && light.current) {
            light.current.position.copy(camera.position)
        }
    })

    return (
        <>
            <OrbitControls 
                ref={controlsRef}
                enableDamping={enableDamping}
                autoRotate={autoRotate}
                autoRotateSpeed={autoRotateSpeed} 
                makeDefault={!debugLights} // Disable orbit controls when debugging lights to avoid conflict
                minDistance={2}
                maxDistance={20}
            />

            <ambientLight intensity={ambientIntensity} />
            <pointLight position={[0, 10, 0]} intensity={1.5} />
            <directionalLight 
                ref={light}
                position={followCamera ? undefined : lightPosition} 
                intensity={lightIntensity} 
            />
            {debugLights && <TransformControls object={light} />}

            <Environment preset="studio" />

            <ArtMesh imageId={imageId} />
            
            <ContactShadows 
                position-y={-2} 
                opacity={0.4} 
                scale={40} 
                blur={2.5} 
                far={4.5} 
            />
        </>
    )
}
