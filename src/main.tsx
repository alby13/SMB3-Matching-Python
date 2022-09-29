import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import fontUrl from './assets/smb3_font.woff2'

const myFont = new FontFace('SMB3', `url(${fontUrl})`);
myFont.load().then(() => {
  document.fonts.add(myFont);
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode> // Commented out to allow one-time useEffect hooks to work
    <App />
  // </React.StrictMode> // Commented out to allow one-time useEffect hooks to work
)
