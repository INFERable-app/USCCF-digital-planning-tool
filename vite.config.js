import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	publicDir: 'static',
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				admin: resolve(__dirname, 'admin.html')
			}
		}
	},
	server: {
		allowedHosts: ['fragmented-shellier-thuy.ngrok-free.dev', 'natou-ubuntu.lan'],
		proxy: {
			'/auth': 'http://localhost:3001',
			'/api': 'http://localhost:3001',
			'^/admin$': 'http://localhost:3001'
		}
	}
});
