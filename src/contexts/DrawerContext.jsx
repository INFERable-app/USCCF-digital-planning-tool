import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);

export function DrawerProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(v => !v);
	return (
		<DrawerContext.Provider value={{ isOpen, toggle }}>
			{children}
		</DrawerContext.Provider>
	);
}

export function useDrawer() {
	return useContext(DrawerContext);
}
