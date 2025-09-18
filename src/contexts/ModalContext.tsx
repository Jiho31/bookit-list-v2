import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

type ModalComponent<
	Props extends Record<string, unknown> = Record<string, unknown>,
> = (props: Props & { close: () => void }) => JSX.Element;

type OpenArgs = {
	component: ModalComponent<any>;
	props?: Record<string, unknown>;
};

type ModalState = OpenArgs | null;

type ModalContextValue = {
	isOpen: boolean;
	openModal: (args: OpenArgs) => void;
	closeModal: () => void;
	current: ModalState;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
	const [current, setCurrent] = useState<ModalState>(null);

	const closeModal = useCallback(() => setCurrent(null), []);

	const openModal = useCallback((args: OpenArgs) => {
		setCurrent({ component: args.component, props: args.props || {} });
	}, []);

	const value = useMemo<ModalContextValue>(
		() => ({ isOpen: Boolean(current), openModal, closeModal, current }),
		[current, openModal, closeModal],
	);

	return <ModalContext value={value}>{children}</ModalContext>;
};

export const useModal = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error('useModal must be used within ModalProvider');
	return ctx;
};
