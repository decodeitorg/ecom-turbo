import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getApiUrl = () => {
    const fromEnv = import.meta.env.VITE_PUBLIC_SITE;
    if (fromEnv) {
        return fromEnv;
    } else {
        //get it from current location
        return window.location.origin;
    }
};
