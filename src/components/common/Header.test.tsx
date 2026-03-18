// import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Header from './Header';

describe('Header', () => {
	it('should render Header component', () => {
		render(<Header title="title" />);

		expect(screen.getByText('title')).toBeInTheDocument();
	});
});
