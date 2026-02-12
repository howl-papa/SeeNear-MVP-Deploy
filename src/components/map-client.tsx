"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom emoji icons
const createEmojiIcon = (emoji: string) => {
    return L.divIcon({
        html: `<div style="font-size: 32px;">${emoji}</div>`,
        className: 'custom-emoji-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    })
}

const MOCK_MARKERS = [
    { id: 1, position: [37.5665, 126.9780] as [number, number], emoji: '👴', name: '김철수 선생님', type: 'senior' },
    { id: 2, position: [37.5675, 126.9790] as [number, number], emoji: '👵', name: '이영희 선생님', type: 'senior' },
    { id: 3, position: [37.5670, 126.9785] as [number, number], emoji: '🏠', name: '요청자 위치', type: 'demander' },
]

export default function MapClient() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 rounded-2xl">
                <p className="text-stone-500">지도 로딩 중...</p>
            </div>
        )
    }

    return (
        <MapContainer
            center={[37.5670, 126.9785]}
            zoom={15}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_MARKERS.map(marker => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={createEmojiIcon(marker.emoji)}
                >
                    <Popup>
                        <div className="text-center">
                            <p className="font-bold">{marker.name}</p>
                            <p className="text-sm text-stone-500">{marker.type === 'senior' ? '선생님' : '요청자'}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
