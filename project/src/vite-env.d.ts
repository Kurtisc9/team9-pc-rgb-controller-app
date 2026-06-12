/// <reference types="vite/client" />

import type { Team9Bridge } from './types/team9';

declare global {
  interface Window {
    team9Bridge?: Team9Bridge;
  }
}

export {};
