import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    publicDir: 'static',
    server: {
        allowedHosts: ['fragmented-shellier-thuy.ngrok-free.dev', 'natou-ubuntu.lan'],
        proxy: {
            '/auth': 'http://localhost:3001',
            '/api': 'http://localhost:3001',
        },
    },
});
