import { useEffect, useRef, useState } from 'react';

export function useTrackingWebSocket(deliveryId) {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!deliveryId) return;

    // Connect to Django Channels ASGI server
    const wsUrl = `ws://localhost:8000/ws/tracker/${deliveryId}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'location_update') {
        setLocation({ lat: data.latitude, lng: data.longitude, riderId: data.rider_id });
      } else if (data.type === 'status_update') {
        setStatus(data.status);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, [deliveryId]);

  const sendLocation = (latitude, longitude, riderId) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'location_update',
        latitude,
        longitude,
        rider_id: riderId
      }));
    }
  };

  const sendStatus = (newStatus, notes = '') => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'status_update',
        status: newStatus,
        notes
      }));
    }
  };

  return { location, status, sendLocation, sendStatus };
}