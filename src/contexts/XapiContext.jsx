import { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { XapiClient, resolveXapiConfig, sendTestStatement } from '../xapi/index.js';
import { useAuth } from './AuthContext.jsx';

const XapiContext = createContext(null);

export function XapiProvider({ children }) {
	const { user } = useAuth();
	const config = resolveXapiConfig();

	const client = useMemo(() => {
		if (!config.enabled) return null;
		try {
			return new XapiClient({
				url: config.url,
				username: config.username,
				password: config.password
			});
		} catch (err) {
			console.warn('xAPI client init failed:', err.message);
			return null;
		}
	}, [config.enabled, config.url, config.username, config.password]);

	const isEnabled = Boolean(client);

	const sendStatement = useCallback(
		(statement) => {
			if (!client) return;
			client.sendStatement(statement).catch((err) => {
				console.warn('xAPI statement send failed:', err.message);
			});
		},
		[client]
	);

	useEffect(() => {
		if (!import.meta.env.DEV || !isEnabled) return;

		window.__xapiSendTest = () => {
			if (!user) {
				console.warn('xAPI test: sign in first');
				return Promise.reject(new Error('Not signed in'));
			}
			return sendTestStatement({ client, user })
				.then((result) => {
					console.log('xAPI test statement sent:', result);
					return result;
				})
				.catch((err) => {
					console.warn('xAPI test statement failed:', err.message);
					throw err;
				});
		};

		return () => {
			delete window.__xapiSendTest;
		};
	}, [client, isEnabled, user]);

	return (
		<XapiContext.Provider value={{ sendStatement, isEnabled }}>{children}</XapiContext.Provider>
	);
}

export function useXapi() {
	return useContext(XapiContext);
}
