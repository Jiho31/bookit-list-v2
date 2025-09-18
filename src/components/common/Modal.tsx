function Modal({
	children,
	isOpen,
	onClose,
}: {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<>
			{isOpen && (
				<>
					<div
						className="no-doc-scroll w-screen h-screen fixed top-0 left-0 z-999 bg-black opacity-50 flex justify-center items-center"
						onClick={onClose}
					></div>
					<div
						className="fixed z-1000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block bg-white rounded-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{children}
					</div>
				</>
			)}
		</>
	);
}

export default Modal;
