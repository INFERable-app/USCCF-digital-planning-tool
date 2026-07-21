import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import AdminApp from './AdminApp.jsx';

createRoot(document.getElementById('admin-root')).render(
	<StrictMode>
		<AuthProvider>
			<AdminApp />
		</AuthProvider>
	</StrictMode>
);
