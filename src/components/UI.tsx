import React, { useState } from 'react'
import '../style.css'

interface UIProps {
    onSearch: (query: string) => void
}

export const UI: React.FC<UIProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Debounce search for suggestions
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                fetchSuggestions(query)
            } else {
                setSuggestions([])
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    const fetchSuggestions = async (searchTerm: string) => {
        if (searchTerm.length < 3) {
            setSuggestions([])
            return
        }
        setIsLoading(true)
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/agents/search?q=${encodeURIComponent(searchTerm)}&limit=5`)
            const data = await response.json()
            if (data.data) {
                setSuggestions(data.data.map((agent: any) => agent.title))
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query)
            setSuggestions([]) // Clear suggestions on search
        }
    }

    return (
        <header className="header">
            <h1 className="header__title">Art Heightmap</h1>
            <form id="searchForm" className="search-form" onSubmit={handleSubmit}>
                <input
                    className="search-form__query"
                    type="text"
                    name="query"
                    placeholder="search artist e.g. van gogh"
                    value={query}
                    onChange={handleInputChange}
                    list="artist-suggestions"
                    autoComplete="off"
                />
                {isLoading && <div className="loader" style={{ position: 'absolute', right: '90px', top: '10px' }}></div>}
                
                <datalist id="artist-suggestions">
                    {suggestions.map((s, i) => (
                        <option key={i} value={s} />
                    ))}
                </datalist>
                <button type="submit">Search</button>
            </form>
        </header>
    )
}
