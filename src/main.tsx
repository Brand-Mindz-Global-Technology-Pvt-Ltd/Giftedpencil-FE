import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// React 19 polyfill for libraries expecting ReactDOM.findDOMNode (e.g. react-quill)
if (typeof (ReactDOM as any).findDOMNode !== 'function') {
  (ReactDOM as any).findDOMNode = (node: any) => {
    if (!node) return null;
    if (node instanceof HTMLElement) return node;
    return node._reactInternals?.stateNode || null;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
