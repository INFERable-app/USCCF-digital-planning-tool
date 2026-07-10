import { createContext, useContext, useState } from 'react';

const WizardNavContext = createContext(null);

export function WizardNavProvider({ nodes, edges, answers, currentNodeId, startNodeId, jumpAlongPath, children }) {
	const [isResourceLibraryOpen, setResourceLibraryOpen] = useState(false);
	const openResourceLibrary = () => setResourceLibraryOpen(true);
	const closeResourceLibrary = () => setResourceLibraryOpen(false);

	const [isFaqOpen, setFaqOpen] = useState(false);
	const openFaq = () => setFaqOpen(true);
	const closeFaq = () => setFaqOpen(false);

	const [isGlossaryOpen, setGlossaryOpen] = useState(false);
	const openGlossary = () => setGlossaryOpen(true);
	const closeGlossary = () => setGlossaryOpen(false);

	return (
		<WizardNavContext.Provider
			value={{
				nodes,
				edges,
				answers,
				currentNodeId,
				startNodeId,
				jumpAlongPath,
				isResourceLibraryOpen,
				openResourceLibrary,
				closeResourceLibrary,
				isFaqOpen,
				openFaq,
				closeFaq,
				isGlossaryOpen,
				openGlossary,
				closeGlossary,
			}}
		>
			{children}
		</WizardNavContext.Provider>
	);
}

export function useWizardNav() {
	return useContext(WizardNavContext);
}
