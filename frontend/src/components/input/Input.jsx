import React, { useId } from "react";
import tw from "../../utils/tailwindUtil";

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
        <div className="w-full flex flex-col gap-1.5 text-slate-200">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-slate-700 ml-1"
                >
                    {label}
                </label>
            )}

            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors duration-200">
                        <Icon size={18} />
                    </div>
                )}

                <input
                    id={id}
                    type={type}
                    ref={ref}
                    placeholder={placeholder}
                    className={tw(
                        "w-full bg-transparent border border-slate-800 rounded-xl py-2.5 text-sm transition-all duration-200",
                        "placeholder:text-slate-600",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-neutral-100",
                        "text-slate-700 focus:text-slate-900",
                        Icon ? "pl-11 pr-4" : "px-4",
                        error ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500" : "",
                        className
                    )}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
