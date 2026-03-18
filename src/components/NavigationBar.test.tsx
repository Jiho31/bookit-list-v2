import { fireEvent, logRoles, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { NavigationBar } from './NavigationBar';

const MockNavigationBar = () => (
	<BrowserRouter>
		<NavigationBar />
	</BrowserRouter>
);

vi.mock('@/contexts/AuthContext', () => ({
	useAuth: () => ({
		userInfo: undefined,
		isAuthenticated: false,
		isLoading: false,
		handleRegister: vi.fn(),
		handleLogout: vi.fn(),
		requestSocialLogin: vi.fn(),
	}),
}));

describe('NavigationBar', () => {
	it('should render navigation bar', () => {
		const { container } = render(<MockNavigationBar />);
		logRoles(container);
		const header = screen.getByRole('banner');
		expect(header).toBeInTheDocument();
	});

	it('should render navigation link "Home"', () => {
		render(<MockNavigationBar />);

		const homeLink = screen.getAllByRole('link', { name: /home/i });
		homeLink.forEach((item) => expect(item).toBeInTheDocument());
	});

	it('should navigate to "/" when user clicks "Home"', () => {
		render(<MockNavigationBar />);

		const homeLink = screen.getAllByRole('link', { name: /home/i });
		expect(homeLink[0]).toHaveAttribute('href', '/');
		fireEvent.click(homeLink[0]);
		expect(location.pathname).toBe('/');
	});

	it('should render navigation link "My Shelves"', () => {
		render(<MockNavigationBar />);

		const libraryLink = screen.getAllByRole('link', { name: /my shelves/i });
		libraryLink.forEach((item) => expect(item).toBeInTheDocument());
	});

	it('should navigate to "/library" when user clicks "My Shelves"', () => {
		render(<MockNavigationBar />);

		const libraryLink = screen.getAllByRole('link', { name: /my shelves/i });
		expect(libraryLink[0]).toHaveAttribute('href', '/library');
		fireEvent.click(libraryLink[0]);
		expect(location.pathname).toBe('/library');
	});

	it('should render navigation link "Search"', () => {
		render(<MockNavigationBar />);

		const searchLink = screen.getAllByRole('link', { name: /search/i });
		searchLink.forEach((item) => expect(item).toBeInTheDocument());
	});

	it('should navigate to "/search" when user clicks "Search"', () => {
		render(<MockNavigationBar />);

		const searchLink = screen.getAllByRole('link', { name: /search/i });
		expect(searchLink[0]).toHaveAttribute('href', '/search');
		fireEvent.click(searchLink[0]);
		expect(location.pathname).toBe('/search');
	});
});
