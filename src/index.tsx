import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GuzcomTerminal } from './Terminal';

class KernelOrchestrator {
    private locks: Map<string, Promise<any>> = new Map();

    async atomicExecute<T>(id: string, action: () => Promise<T>): Promise<T> {
        const existingLock = this.locks.get(id) || Promise.resolve();
        const currentLock = existingLock.then(async () => {
            try {
                return await action();
            } catch (error) {
                console.error(`[Kernel-Error] ${id}:`, error);
                throw error;
            }
        });
        this.locks.set(id, currentLock.then(() => {}, () => {}));
        return currentLock as Promise<T>;
    }
}

const kernel = new KernelOrchestrator();

const App = () => {
    const [status, setStatus] = useState("Initializing Kernel...");
    const [booted, setBooted] = useState(false);

    useEffect(() => {
        const bootSequence = async () => {
            await kernel.atomicExecute('fs', async () => {
                setStatus("Mounting Workspace...");
                await new Promise(res => setTimeout(res, 300));
            });

            await kernel.atomicExecute('network', async () => {
                setStatus("Connecting to Terminal Backend...");
                await new Promise(res => setTimeout(res, 300));
            });

            setBooted(true);
        };

        bootSequence();
    }, []);

    if (!booted) {
        return (
            <div style={{
                background: '#0a0a0a', color: '#00ff41', height: '100vh', 
                display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', fontFamily: 'monospace'
            }}>
                <div>GUZCOM-IDE-V3</div>
                <div style={{ border: '1px solid #00ff41', padding: '10px', marginTop: '10px' }}>
                    [STATUS]: {status}
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
            <header style={{ borderBottom: '1px solid #333', marginBottom: '20px', paddingBottom: '10px' }}>
                <h1 style={{ color: '#00ff41', margin: 0 }}>GUZCOM IDE V3</h1>
                <small>System Status: <span style={{color: '#00ff41'}}>RESILIENT</span></small>
            </header>
            
            <main>
                <section>
                    <h3 style={{ color: '#00ff41' }}>Universal Co-Pilot Terminal</h3>
                    <GuzcomTerminal />
                </section>
            </main>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
