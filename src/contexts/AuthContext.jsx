import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			return (
				JSON.parse(localStorage.getItem('auth_user')) ||
				JSON.parse(sessionStorage.getItem('auth_user'))
			);
		} catch { return null; }
	});

	// profile: { name, email, picture, sub }
	// rememberMe: true → localStorage (persists across sessions), false → sessionStorage
	const signIn = useCallback((profile, rememberMe = true) => {
		const u = { name: profile.name, email: profile.email, picture: profile.picture, sub: profile.sub };
		setUser(u);
		if (rememberMe) {
			localStorage.setItem('auth_user', JSON.stringify(u));
			sessionStorage.removeItem('auth_user');
		} else {
			sessionStorage.setItem('auth_user', JSON.stringify(u));
			localStorage.removeItem('auth_user');
		}
	}, []);

	const signOut = useCallback(() => {
		setUser(null);
		localStorage.removeItem('auth_user');
		sessionStorage.removeItem('auth_user');
	}, []);

	return (
		<AuthContext.Provider value={{ user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
