import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractFields( fields: any[] ) {
  const data: {[key:string]: any} = {}
  fields.forEach((field:any) => {
    data[field.name] = field.value
  })

  return data
}