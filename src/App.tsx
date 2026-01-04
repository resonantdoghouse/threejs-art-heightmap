import { Canvas } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { Experience } from './components/Experience'
import { UI } from './components/UI'



export const App = () => {
    const [imageId, setImageId] = useState<string | null>(null)

    const fetchArt = async (id: number) => {
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
            const data = await response.json()
            setImageId(data.data.image_id)
        } catch (error) {
            console.error('Error fetching art:', error)
        }
    }

    const handleSearch = async (query: string) => {
        try {
            const queryObj = {
                q: query,
                query: {
                    term: {
                        is_public_domain: true,
                    },
                },
            }
            const response = await fetch(
                `https://api.artic.edu/api/v1/artworks/search?params=${JSON.stringify(queryObj)}`
            )
            const data = await response.json()
            if (data.data && data.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.data.length)
                const id = data.data[randomIndex].id
                fetchArt(id)
            }
        } catch (error) {
            console.error('Error searching art:', error)
        }
    }

    useEffect(() => {
        // Initial load (default query 'monet')
        handleSearch('monet')
    }, [])

    return (
        <>
            <UI onSearch={handleSearch} />
            <Canvas
                className="webgl"
                shadows
                camera={{
                    position: [0, 0, 9],
                    fov: 75,
                    near: 0.1,
                    far: 100
                }}
            >
                <color attach="background" args={['skyblue']} />
                <fog attach="fog" args={['skyblue', 10, 100]} />
                {imageId && <Experience imageId={imageId} />}
            </Canvas>
        </>
    )
}
