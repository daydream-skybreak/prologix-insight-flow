import React, {useCallback, useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet CSS is imported
import L, { LatLng } from 'leaflet'; // Import Leaflet and LatLng
import Navbar from "@/components/layout/Navbar"; // Assuming this path is correct
import Sidebar from "@/components/layout/Sidebar"; // Assuming this path is correct

// Fix for marker icon issue
if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/images/marker-icon-2x.png',
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
    });
}

interface Location {
    id: number;
    name: string;
    description: string;
    lat: number;
    lng: number;
    timestamp?: string;
}

function MapClickHandler({ onMapClick }: { onMapClick: (latLng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}


const DynamicMap: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // From new code
    // Initial locations are now static in the new code
    const [locations, setLocations] = useState<Location[]>([
        {
            id: 1,
            name: 'National Museum of Ethiopia',
            description: 'Home of Lucy, the famous hominid fossil.',
            lat: 9.0351,
            lng: 38.7601,
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
            id: 2,
            name: 'Holy Trinity Cathedral',
            description: 'An important Ethiopian Orthodox Tewahedo cathedral.',
            lat: 9.0281,
            lng: 38.7652,
            timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
    ]);
    const [loadingLocations, setLoadingLocations] = useState<boolean>(false); // Renamed from 'loading' for clarity
    const [locationsError, setLocationsError] = useState<string | null>(null); // Renamed from 'error' for clarity

    // State for routing (integrated from Canvas version)
    const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
    const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
    const [pathCoordinates, setPathCoordinates] = useState<L.LatLngTuple[]>([]);
    const [routingLoading, setRoutingLoading] = useState<boolean>(false);
    const [routingError, setRoutingError] = useState<string | null>(null);
    const [routingMessage, setRoutingMessage] = useState<string>('Route will be calculated for the first two locations.'); // Adapted from Canvas (selected code)


    const mapCenter: L.LatLngTuple = [9.025, 38.746];

    const fetchRoute = useCallback(async (start: L.LatLng, end: L.LatLng) => {
        setRoutingLoading(true);
        setRoutingError(null);
        setPathCoordinates([]);
        setRoutingMessage('Fetching route...');

        const osrmRequestUrl = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

        try {
            const response = await fetch(osrmRequestUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OSRM error: ${errorData.message || response.status}`);
            }
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map(
                    (coord: [number, number]) => [coord[1], coord[0]] as L.LatLngTuple // OSRM returns [lng, lat]
                );
                setPathCoordinates(coordinates); // Update pathCoordinates
                setRoutingMessage('Route displayed.'); // Success message
            } else {
                throw new Error("No route found by OSRM.");
            }
        } catch (err: any) {
            setRoutingError(err instanceof Error ? err.message : "Failed to fetch route");
            setPathCoordinates([]); // Clear path on error
            setRoutingMessage('Failed to fetch route.'); // Error message
        } finally {
            setRoutingLoading(false);
        }
    }, []); // Empty dependency array as it doesn't depend on component state directly being changed by user for now

    // Effect for initial setup (modified from new code)
    useEffect(() => {
        // The new code uses static locations, so no fetch is needed here.
        // If you want to fetch locations, uncomment and adapt the following:
        /*
        const fetchInitialLocations = async () => {
            try {
                setLoadingLocations(true);
                // const response = await fetch(yourApiUrl);
                // if (!response.ok) throw new Error('Failed to fetch locations');
                // const data: Location[] = await response.json();
                // setLocations(data);
                setLocationsError(null);
            } catch (err: any) {
                setLocationsError(err instanceof Error ? err.message : "An unknown error occurred fetching locations");
                setLocations([]); // Clear locations on error
            } finally {
                setLoadingLocations(false);
            }
        };
        fetchInitialLocations();
        */
        setLoadingLocations(false);

        if (locations.length >= 2) {
            const startLoc = locations[0];
            const endLoc = locations[1];
            const startLatLng = L.latLng(startLoc.lat, startLoc.lng);
            const endLatLng = L.latLng(endLoc.lat, endLoc.lng);

            setStartPoint(startLatLng);
            setEndPoint(endLatLng);
            fetchRoute(startLatLng, endLatLng);
        } else {
            setRoutingMessage("Not enough locations to draw a default route.");
        }
    }, [locations, fetchRoute]);

    const handleMapClick = (latLng: L.LatLng) => {
        if (routingLoading) return;

        if (!startPoint) {
            setStartPoint(latLng);
            setEndPoint(null);
            setPathCoordinates([]);
            setRoutingError(null);
            setRoutingMessage('Start point set. Click on the map to set an end point.');
        } else if (!endPoint) {
            setEndPoint(latLng);
            // fetchRoute will be called by useEffect when endPoint is set
        } else { // Both points are set, reset
            setStartPoint(latLng);
            setEndPoint(null);
            setPathCoordinates([]);
            setRoutingError(null);
            setRoutingMessage('Start point set. Click on the map to set an end point.');
        }
    };

    const handleClearRoute = () => {
        setStartPoint(null);
        setEndPoint(null);
        setPathCoordinates([]);
        setRoutingError(null);
        setRoutingLoading(false);
        setRoutingMessage('Route cleared. Click map for new start or select from markers.');
    };


    if (loadingLocations) return <p>Loading map data...</p>;
    if (locationsError) return <p>Error loading data: {locationsError}</p>;

    return (
        <div className="flex h-screen overflow-hidden w-sceen">
            <Sidebar isOpen={true} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>
                <main className="flex-1 overflow-auto p-4">
                    <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Route Planner:</p>
                        <p style={{ margin: '5px 0' }}>{routingMessage}</p>
                        {routingLoading && <p style={{ color: 'blue', margin: '5px 0' }}>Loading route...</p>}
                        {routingError && <p style={{ color: 'red', margin: '5px 0' }}>Routing Error: {routingError}</p>}
                        {(startPoint || endPoint || pathCoordinates.length > 0) && (
                            <button onClick={handleClearRoute} style={{ padding: '5px 10px', marginTop: '5px' }}>
                                Clear Route
                            </button>
                        )}
                    </div>

                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={{ height: 'calc(100vh - 250px)', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Routing via OSRM (Demo)'
                        />

                        {/* Uncomment to enable click-to-route */}
                        {/* <MapClickHandler onMapClick={handleMapClick} /> */}

                        {locations.map((location) => (
                            <Marker key={`loc-${location.id}`} position={[location.lat, location.lng]}>
                                <Popup>
                                    <b>{location.name}</b>
                                    <br />
                                    {location.description}
                                    {location.timestamp && (<><br /><small>Recorded: {new Date(location.timestamp).toLocaleString()}</small></>)}
                                </Popup>
                            </Marker>
                        ))}

                        {/* Display markers for start and end points if they are set (e.g., by clicking) */}
                        {startPoint && <Marker position={startPoint} title="Start Point"><Popup>Start Point</Popup></Marker>}
                        {endPoint && <Marker position={endPoint} title="End Point"><Popup>End Point</Popup></Marker>}

                        {/* Display the calculated route path */}
                        {pathCoordinates.length > 0 && (
                            <Polyline
                                pathOptions={{ color: 'blue', weight: 3 }}
                                positions={pathCoordinates}
                            />
                        )}
                    </MapContainer>
                </main>
            </div>
        </div>
    );
};

export default DynamicMap;
