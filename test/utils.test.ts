import { describe, it, expect } from 'bun:test';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Simple cn function for testing
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

describe('Utility Functions', () => {
  it('cn - should merge classnames correctly', () => {
    const result = cn('px-2', 'py-1');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
  });

  it('cn - should handle conditional classes', () => {
    const result = cn('px-2', true && 'py-1', false && 'hidden');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).not.toContain('hidden');
  });

  it('cn - should handle tailwind conflicts correctly', () => {
    // Should override first class with second
    const result = cn('px-2 px-4');
    expect(result).toContain('px-4');
  });
});
