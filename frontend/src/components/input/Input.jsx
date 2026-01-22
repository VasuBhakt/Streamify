import React, { useId } from 'react';
import tw from '../../utils/tailwindUtil';

const Input = React.forwardRef(({
    label,
    type = "text",
    className = "",
    placeholder,
    error,
    icon: Icon,
    ...props
}, ref) => {
    const id = useId();

    return (
        <div className='w-full flex flex-col gap-1.5 text-text-main'>
            {label && (
                <label htmlFor={id} className='text-sm font-medium text-text-secondary ml-1'>
                    {label}
                </label>
            )}
            <div className='relative group'>
                {Icon && (
                    <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors duration-200'>
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    ref={ref}
                    placeholder={placeholder}
                    className={tw(
                        "w-full bg-transparent border border-border rounded-xl py-2.5 text-sm transition-all duration-200",
                        "placeholder:text-text-secondary",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-hover",
                        "text-text-main focus:text-text-main",
                        Icon ? "pl-11 pr-4" : "px-4",
                        error ? "border-error/50 focus:ring-error/20 focus:border-error" : "",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-error mt-1 ml-1 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-error" />
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
