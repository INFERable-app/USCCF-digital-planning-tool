import { createContext, useContext, useState } from 'react';

const WizardNavContext = createContext(null);

export function WizardNavProvider({ nodes, edges, answers, currentNodeId, startNodeId, jumpToUnvisited, children }) {
	const [isResourceLibraryOpen, setResourceLibraryOpen] = useState(false);
	const openResourceLibrary = () => setResourceLibraryOpen(true);
	const closeResourceLibrary = () => setResourceLibraryOpen(false);

	return (
		<WizardNavContext.Provider
			value={{
				nodes,
				edges,
				answers,
				currentNodeId,
				startNodeId,
				jumpToUnvisited,
				isResourceLibraryOpen,
				openResourceLibrary,
				closeResourceLibrary,
			}}
		>
			{children}
		</WizardNavContext.Provider>
	);
}

export function useWizardNav() {
	return useContext(WizardNavContext);
}
