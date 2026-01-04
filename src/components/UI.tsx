import React, { useState } from 'react'
import '../style.css'

interface UIProps {
    onSearch: (query: string) => void
}

export const UI: React.FC<UIProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])

    const fetchSuggestions = async (searchTerm: string) => {
        if (searchTerm.length < 3) {
            setSuggestions([])
            return
        }
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/agents/search?q=${encodeURIComponent(searchTerm)}&limit=5`)
            const data = await response.json()
            if (data.data) {
                setSuggestions(data.data.map((agent: any) => agent.title))
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        // Simple debounce could be added here, but for now direct call on input is acceptable for low traffic
        fetchSuggestions(val)
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
