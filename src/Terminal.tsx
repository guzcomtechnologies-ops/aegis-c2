import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io } from 'socket.io-client';

export const GuzcomTerminal: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const socket = useRef(io('http://localhost:3001'));

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            theme: { 
                background: '#0a0a0a', 
                foreground: '#00ff41',
                cursor: '#00ff41'
            }
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        term.writeln('--- Guzcom Universal Co-Pilot Terminal ---');
        term.writeln('Connecting to Termux Backend...');

        socket.current.on('output', (data: string) => {
            term.write(data);
        });

        term.onData(data => {
            socket.current.emit('input', data);
        });

        window.addEventListener('resize', () => fitAddon.fit());

        return () => {
            term.dispose();
            socket.current.disconnect();
        };
    }, []);

    return (
        <div style={{ 
            padding: '10px', 
            background: '#0a0a0a', 
            borderRadius: '4px',
            border: '1px solid #333' 
        }}>
            <div ref={terminalRef} style={{ height: '400px' }} />
        </div>
    );
};
