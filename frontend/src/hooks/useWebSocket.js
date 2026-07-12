import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url) {
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => console.log("🔌 Connected to EcoSphere Real-Time Hub");
        
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📥 Real-Time Event Received:", data);
            
            // Example: Trigger a toast notification if a badge is unlocked
            if (data.type === 'BADGE_UNLOCKED') {
                alert(`🏆 Achievement Unlocked: ${data.data.badge_name}`);
            }

            setMessages((prev) => [...prev, data]);
        };

        ws.current.onclose = () => console.log("🔌 Disconnected from Hub");

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url]);

    return { messages };
}