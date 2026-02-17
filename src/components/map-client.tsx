"use client"

import { useEffect, useState, useRef, Fragment } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
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
const createEmojiIcon = (emoji: string, size: number = 32) => {
    return L.divIcon({
        html: `<div style="font-size: ${size}px;">${emoji}</div>`,
        className: 'custom-emoji-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    })
}

// Welfare Centers (거점) with 500m radius
const WELFARE_CENTERS = [
    { id: 1, position: [37.5665, 126.9780] as [number, number], name: '마포노인복지관', emoji: '🏢' },
    { id: 2, position: [37.5690, 126.9810] as [number, number], name: '서대문복지관', emoji: '🏢' },
]

// Senior providers near welfare centers (distributed within 500m radius)
const SENIOR_MARKERS = [
    // 마포노인복지관 소속 (북, 동, 남, 서 방향으로 분산)
    { id: 1, position: [37.5685, 126.9780] as [number, number], emoji: '👴', name: '김철수 선생님', center: '마포노인복지관' },  // 북쪽
    { id: 2, position: [37.5665, 126.9810] as [number, number], emoji: '👵', name: '이영희 선생님', center: '마포노인복지관' },  // 동쪽
    { id: 3, position: [37.5645, 126.9780] as [number, number], emoji: '👴', name: '박상훈 선생님', center: '마포노인복지관' },  // 남쪽
    { id: 4, position: [37.5665, 126.9750] as [number, number], emoji: '👵', name: '윤태식 선생님', center: '마포노인복지관' },  // 서쪽

    // 서대문복지관 소속 (북동, 남동, 남서, 북서 방향으로 분산)
    { id: 5, position: [37.5710, 126.9830] as [number, number], emoji: '👴', name: '최미숙 선생님', center: '서대문복지관' },  // 북동
    { id: 6, position: [37.5670, 126.9830] as [number, number], emoji: '👵', name: '정동욱 선생님', center: '서대문복지관' },  // 남동
    { id: 7, position: [37.5670, 126.9790] as [number, number], emoji: '👴', name: '강순자 선생님', center: '서대문복지관' },  // 남서
    { id: 8, position: [37.5710, 126.9790] as [number, number], emoji: '👵', name: '한명희 선생님', center: '서대문복지관' },  // 북서
]

// Demander location
const DEMANDER_LOCATION = { position: [37.5675, 126.9795] as [number, number], emoji: '🏠', name: '요청자 위치' }

export default function MapClient() {
    const [isClient, setIsClient] = useState(false)
    const mapInitialized = useRef(false)

    useEffect(() => {
        if (!mapInitialized.current) {
            setIsClient(true)
            mapInitialized.current = true
        }
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
            key="senior-map"
            center={[37.5675, 126.9795]}
            zoom={15}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Welfare Centers with 500m radius circles */}
            {WELFARE_CENTERS.map(center => (
                <Fragment key={`center-${center.id}`}>
                    <Circle
                        key={`circle-${center.id}`}
                        center={center.position}
                        radius={500}
                        pathOptions={{
                            color: '#F97316',
                            fillColor: '#F97316',
                            fillOpacity: 0.1,
                            weight: 2,
                            dashArray: '5, 5'
                        }}
                    />
                    <Marker
                        key={`center-${center.id}`}
                        position={center.position}
                        icon={createEmojiIcon(center.emoji, 36)}
                    >
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-orange-600">{center.name}</p>
                                <p className="text-xs text-stone-500">서비스 반경 500m</p>
                            </div>
                        </Popup>
                    </Marker>
                </Fragment>
            ))}

            {/* Senior providers */}
            {SENIOR_MARKERS.map(marker => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={createEmojiIcon(marker.emoji)}
                >
                    <Popup>
                        <div className="text-center">
                            <p className="font-bold">{marker.name}</p>
                            <p className="text-xs text-stone-500">{marker.center} 소속</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Demander location */}
            <Marker
                position={DEMANDER_LOCATION.position}
                icon={createEmojiIcon(DEMANDER_LOCATION.emoji, 36)}
            >
                <Popup>
                    <div className="text-center">
                        <p className="font-bold text-blue-600">{DEMANDER_LOCATION.name}</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    )
}
