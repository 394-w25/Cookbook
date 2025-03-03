import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';

describe('counter tests', () => {
    
  // test("Sign in text", () => {
  //   render(<App />);
  //   expect(screen.getByText('Sign in with Google')).toBeDefined();
  // });

  test("Sign in button", async () => {
    render(<App />);
    const signIn = screen.getByRole('button');
    // fireEvent.click(counter);
    expect(await screen.getByText('Sign in with Google')).toBeDefined();
  });

});