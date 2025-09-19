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
				className={`py-10 text-2xl text-slate-900 font-semibold ${classProps}`}
			>
				{title}
			</p>
		</>
	);
}

export default Header;
