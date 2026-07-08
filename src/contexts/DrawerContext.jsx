import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);

export function DrawerProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(v => !v);
	const close = () => setIsOpen(false);
	return (
		<DrawerContext.Provider value={{ isOpen, toggle, close }}>
			{children}
		</DrawerContext.Provider>
	);
}

export function useDrawer() {
	return useContext(DrawerContext);
}
