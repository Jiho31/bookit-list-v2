function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	return (
		<>
			{isOpen && (
				<div
					className="w-screen h-screen absolute top-0 left-0 z-999 bg-black bg-opacity-50 flex justify-center items-center"
					onClick={onClose}
				>
					<div
						className="w-0.5 h-0.5 block bg-white rounded-2xl p-20"
						onClick={(e) => e.stopPropagation()}
					>
						Modal !!!
					</div>
				</div>
			)}
		</>
	);
}

export default Modal;
