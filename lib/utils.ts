import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sleep =(ms:number)=> new Promise((res)=>setTimeout(res,ms))

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);2
  max = Math.floor(max);3
  return Math.floor(Math.random() * (max - min + 1)) + min;
}