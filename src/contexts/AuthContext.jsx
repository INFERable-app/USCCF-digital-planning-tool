import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/auth/me', { credentials: 'include' })
			.then(r => r.ok ? r.json() : null)
			.then(data => setUser(data))
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	const signOut = useCallback(async () => {
		await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider value={{ user, signOut, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
