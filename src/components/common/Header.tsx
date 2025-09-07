// function Header({ children }: { children: React.ReactNode }) {
function Header({
	title,
	className: classProps,
}: {
	title: string;
	className?: string;
}) {
	return (
		<>
			<p
				className={`py-10 text-2xl text-slate-900 underline font-bold ${classProps}`}
			>
				{title}
			</p>
		</>
	);
}

export default Header;
