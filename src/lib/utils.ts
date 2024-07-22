import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(inputDate: string | number | Date) {
  const date = new Date(inputDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function debounce<T extends Function>(cb: T, wait = 1000) {
  let h = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = window.setTimeout(() => cb(...args), wait);
  };
  return callable as unknown as T;
}
