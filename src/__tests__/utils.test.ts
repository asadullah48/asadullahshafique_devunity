// Utility function tests
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', true ? 'bar' : 'baz')).toBe('foo bar');
  });

  it('should handle falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('should merge tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle complex objects', () => {
    expect(cn('base', { conditional: true }, ['array', 'class'])).toBe(
      'base conditional array class'
    );
  });
});
