import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useModal } from '../../contexts/ModalContext';

export default function ModalRoot() {
	const { isOpen, closeModal, current } = useModal();
	const [container, setContainer] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const target =
			document.getElementById('app-container') ||
			(typeof document !== 'undefined' ? document.body : null);
		setContainer(target);
	}, []);

	if (!isOpen || !current) return null;

	const { component: Component, props } = current;

	if (!container) {
		return (
			<Modal isOpen={isOpen} onClose={closeModal}>
				<Component {...(props || {})} close={closeModal} />
			</Modal>
		);
	}

	return createPortal(
		<Modal isOpen={isOpen} onClose={closeModal}>
			<Component {...(props || {})} close={closeModal} />
		</Modal>,
		container,
	);
}
