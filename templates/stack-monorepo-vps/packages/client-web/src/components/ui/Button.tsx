import type { Component, JSX } from 'solid-js';
import { splitProps } from 'solid-js';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary',
  secondary:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-2',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

/**
 * HyperUI-based button — primary/secondary/ghost variants, with loading state.
 * @docs getting-started/concepts.md#buttons
 */
export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['variant', 'size', 'loading', 'class', 'children']);

  return (
    <button
      type="button"
      {...rest}
      disabled={local.loading || rest.disabled}
      class={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'outline-none focus-visible:outline-none',
        variantClasses[local.variant ?? 'primary'],
        sizeClasses[local.size ?? 'md'],
        local.class ?? '',
      ].join(' ')}
    >
      {local.loading ? <span aria-hidden="true">⏳</span> : null}
      {local.children}
    </button>
  );
};
