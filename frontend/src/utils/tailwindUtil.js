/*import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}*/

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function tailwindUtil(...inputs) {
    return twMerge(clsx(inputs))
}

export default tailwindUtil;
