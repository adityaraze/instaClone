import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        reject(new Error("File could not be read as Data URL"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error occurred while reading file"));
    };

    reader.readAsDataURL(file);
  });
};
