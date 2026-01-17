import React from "react";
import { Loader2 } from "lucide-react";
import tw from "../../utils/tailwindUtil";

const Button = React.forwardRef(({
    children,
    label,
    type = "button",
    variant = "primary",
    size = "md",
    className,
    isLoading = false,
    icon: Icon,
    disabled,
    ...props
}, ref) => {
    const variants = {
        primary: "bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primary-hover hover:to-indigo-700 shadow-lg shadow-blue-500/25",
        secondary: "bg-surface-hover text-text-main hover:bg-surface border border-border",
        outline: "bg-transparent border-2 border-border text-text-secondary hover:border-primary hover:text-white",
        ghost: "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-white",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base font-semibold",
    };

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || isLoading}
            className={tw(
                "relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {!isLoading && Icon && (
                <Icon className={tw("h-4 w-4", size === "lg" && "h-5 w-5")} />
            )}

            <span className="relative">
                {label || children}
            </span>
        </button>
    );
});

Button.displayName = "Button";

export default Button;

