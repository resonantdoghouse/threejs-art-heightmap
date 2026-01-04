import { useLoader } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { generateHeightmap } from '../utils/imageUtils'

interface ArtMeshProps {
    imageId: string | number
}

export const ArtMesh: React.FC<ArtMeshProps> = ({ imageId }) => {
    const [heightMapData, setHeightMapData] = useState<string | null>(null)
    const { heightmapSize, smoothing, contrast, invert } = useControls('Height Map', {
        heightmapSize: { value: -0.75, min: -2, max: 2 },
        smoothing: { value: 0, min: 0, max: 10, step: 0.1 },
        contrast: { value: 0, min: -100, max: 100, step: 1 },
        invert: { value: false }
    })

    const artUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    const texture = useLoader(THREE.TextureLoader, artUrl)


    const [displacementMap, setDisplacementMap] = useState<THREE.Texture | null>(null)

    useEffect(() => {
        if (!heightMapData) return
        
        console.log('Loading displacement map texture...')
        const loader = new THREE.TextureLoader()
        const dispTexture = loader.load(heightMapData, (t) => {
            console.log('Displacement map texture loaded.', t)
            t.needsUpdate = true
            setDisplacementMap(t)
        })
        
        return () => {
            dispTexture.dispose()
        }
    }, [heightMapData])

    // Effect to handle manual material updates if needed, though R3F usually handles this.
    // We add a key to the material to force re-construction if strictly needed, 
    // but better to trust the prop update with the new texture reference.

    useEffect(() => {
        console.log('Generating heightmap with options:', { smoothing, contrast, invert })
        generateHeightmap(imageId, { smoothing, contrast, invert })
            .then((data) => {
                console.log('Heightmap data generated (length):', data.length)
                setHeightMapData(data)
            })
            .catch((err) => console.error('Heightmap generation error:', err))
    }, [imageId, smoothing, contrast, invert])

    return (
        <mesh position-y={0} rotation-x={-Math.PI / 2 + Math.PI / 2} > 
            <planeGeometry args={[10, 10, 256, 256]} />
            <meshStandardMaterial
                map={texture}
                displacementMap={displacementMap || undefined}
                displacementScale={heightmapSize}
                side={THREE.DoubleSide}
                needsUpdate={true} // Force update on every render (expensive but safer for debug)
            />
        </mesh>
    )
}
