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
        heightmapSize: { value: -0.75, min: -5, max: 5 },
        smoothing: { value: 0, min: -10, max: 50, step: 0.1 },
        contrast: { value: 0, min: -200, max: 200, step: 1 },
        invert: { value: false }
    })

    const { rotation } = useControls('Transform', {
        rotation: { value: [0, 0, 0], step: 0.01 }
    })

    const artUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    const texture = useLoader(THREE.TextureLoader, artUrl)

    const [displacementMap, setDisplacementMap] = useState<THREE.Texture | null>(null)


    useEffect(() => {
        if (!heightMapData) return
        
        const loader = new THREE.TextureLoader()
        const dispTexture = loader.load(heightMapData, (t) => {
            t.needsUpdate = true
            setDisplacementMap(t)
        })
        
        return () => {
            dispTexture.dispose()
        }
    }, [heightMapData])

    useEffect(() => {
        generateHeightmap(imageId, { smoothing, contrast, invert })
            .then((data) => {
                setHeightMapData(data)
            })
            .catch((err) => console.error('Heightmap generation error:', err))
    }, [imageId, smoothing, contrast, invert])

    return (
        <mesh position-y={0} rotation={[rotation[0], rotation[1], rotation[2]]} > 
            <planeGeometry args={[10, 10, 256, 256]} />
            <meshStandardMaterial
                key={displacementMap?.uuid || 'no-disp'}
                map={texture}
                displacementMap={displacementMap || undefined}
                displacementScale={heightmapSize}
                side={THREE.DoubleSide}
                needsUpdate={true} // Force update on every render (expensive but safer for debug)
            />
        </mesh>
    )
}
