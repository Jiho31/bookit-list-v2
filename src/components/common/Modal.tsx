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
						className="w-screen h-screen absolute top-0 left-0 z-999 bg-black opacity-50 flex justify-center items-center"
						onClick={onClose}
					></div>
					<div
						className="w-1/2 min-w-1/2 h-1/2 absolute z-1000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block bg-white rounded-2xl p-20"
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
