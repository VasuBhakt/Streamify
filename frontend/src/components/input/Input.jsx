import React, { useId } from 'react';
import tw from '../../utils/tailwindUtil';

const Input = React.forwardRef(({
    label,
    type = "text",
    className = "",
    containerClassName = "",
    placeholder,
    error,
    icon: Icon,
    rightElement,
    ...props
}, ref) => {
    const id = useId();

    return (
        <div className={tw('w-full flex flex-col gap-2', containerClassName)}>
            {label && (
                <label
                    htmlFor={id}
                    className='text-sm font-semibold text-text-secondary ml-1 tracking-wide flex items-center justify-between'
                >
                    {label}
                    {props.required && <span className="text-primary text-[10px] uppercase font-bold">Required</span>}
                </label>
            )}

            <div className='relative group'>
                {/* Left Icon */}
                {Icon && (
                    <div className={tw(
                        'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10',
                        'text-text-muted group-focus-within:text-primary group-focus-within:scale-110',
                        error ? 'text-error/70' : ''
                    )}>
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={id}
                    type={type}
                    ref={ref}
                    placeholder={placeholder}
                    className={tw(
                        // Base Styles
                        "w-full bg-surface/30 border-2 border-border/50 rounded-2xl py-3 text-sm transition-all duration-300",
                        "placeholder:text-text-muted/60 placeholder:font-medium",
                        "text-text-main",

                        // Focus Styles - Glow and shift
                        "focus:outline-none focus:border-primary/50 focus:bg-surface/60 focus:ring-4 focus:ring-primary/10",
                        "focus:shadow-[0_0_20px_rgba(37,99,235,0.1)]",

                        // Icon Padding logic
                        Icon ? "pl-12" : "pl-5",
                        rightElement ? "pr-12" : "pr-5",

                        // Error States
                        error ? "border-error/30 focus:border-error/50 focus:ring-error/10 focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "hover:border-border",

                        // Custom Class
                        className
                    )}
                    {...props}
                />

                {/* Right Element (Clear button, password toggle, etc) */}
                {rightElement && (
                    <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center'>
                        {rightElement}
                    </div>
                )}

                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 pointer-events-none transition-colors duration-300" />
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-error" />
                    <p className="text-xs font-bold text-error uppercase tracking-tight">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
