// function Header({ children }: { children: React.ReactNode }) {
function Header({ title }: { title: string }) {
	return (
		<>
			<p className="py-10 text-2xl underline font-bold">{title}</p>
		</>
	);
}

export default Header;
