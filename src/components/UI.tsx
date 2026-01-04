import React, { useState } from 'react'
import '../style.css'

interface UIProps {
    onSearch: (query: string) => void
}

export const UI: React.FC<UIProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query)
        }
    }

    return (
        <header className="header">
            <form id="searchForm" className="search-form" onSubmit={handleSubmit}>
                <input
                    className="search-form__query"
                    type="text"
                    name="query"
                    placeholder="search artist e.g. van gogh"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <p className="header__info">
                Move the camera using your mouse or track-pad. Click, hold and drag to rotate. <br />
                You can use the tool top right to change height-map values. 💡
            </p>
        </header>
    )
}
