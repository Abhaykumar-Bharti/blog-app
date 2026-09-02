/// <reference types="react-scripts" />

// Ensure React is properly typed
declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react-dom/client' {
  import { Root } from 'react-dom/client';
  export function createRoot(container: HTMLElement): Root;
}
