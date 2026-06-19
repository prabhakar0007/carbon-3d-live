// src/types/index.ts
export interface Activity {
  type: string;
  value: number;
  date?: string; // optional date
}

export interface EmissionFactors {
  [key: string]: number;
}