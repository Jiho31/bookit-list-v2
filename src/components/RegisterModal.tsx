import { Link } from 'react-router';
function RegisterModal({ close }: { close: () => void }) {
	return (
		<div className="flex flex-col gap-2 w-[350px] h-auto max-h-2/3 overflow-scroll bg-slate-200 p-5 rounded-2xl">
			<h2 className="text-lg font-bold py-1 mb-5">
				📢 Please sign in to continue
			</h2>
			<p className="text-center mb-2">
				Get started
				<Link className="underline mx-1 text-indigo-700" to="/auth">
					here
				</Link>
				😊
			</p>
			<button
				className="text-slate-800 bg-slate-200 absolute top-5 right-5 p-2"
				onClick={close}
			>
				X
			</button>
		</div>
	);
}

export default RegisterModal;
