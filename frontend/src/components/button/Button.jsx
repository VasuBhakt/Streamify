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
        primary: "bg-gradient-to-r from-primary to-primary-hover text-white hover:from-primary hover:to-primary-hover shadow-lg shadow-primary/25",
        secondary: "bg-surface-hover text-text-main hover:bg-surface border border-border",
        outline: "bg-transparent border-2 border-border text-text-secondary hover:border-primary hover:text-white",
        ghost: "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-white",
        danger: "bg-error/10 text-error border border-error/20 hover:bg-error hover:text-text-main",
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
                "relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:active:scale-100",
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
