
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Console log to check if the application is loading
console.log('Application starting...');

createRoot(document.getElementById("root")!).render(<App />);
