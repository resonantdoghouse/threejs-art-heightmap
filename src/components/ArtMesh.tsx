import { useLoader } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { convertBW } from '../utils/imageUtils'

interface ArtMeshProps {
    imageId: string | number
}

export const ArtMesh: React.FC<ArtMeshProps> = ({ imageId }) => {
    const [heightMapData, setHeightMapData] = useState<string | null>(null)
    const { heightmapSize, metalness, roughness } = useControls('Height Map', {
        heightmapSize: { value: -0.75, min: -2, max: 2 },
        metalness: { value: 0, min: 0, max: 1 },
        roughness: { value: 1, min: 0, max: 1 }
    })

    const artUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    const texture = useLoader(THREE.TextureLoader, artUrl)
    texture.crossOrigin = 'Anonymous'

    useEffect(() => {
        convertBW(imageId).then(setHeightMapData).catch(console.error)
    }, [imageId])

    const displacementMap = heightMapData ? new THREE.TextureLoader().load(heightMapData) : null

    return (
        <mesh position-y={0} rotation-x={-Math.PI / 2 + Math.PI / 2} > 
            <planeGeometry args={[10, 10, 128, 128]} />
            <meshStandardMaterial
                map={texture}
                displacementMap={displacementMap || undefined}
                displacementScale={heightmapSize}
                metalness={metalness}
                roughness={roughness}
                metalnessMap={texture} 
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}
