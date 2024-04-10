import React from 'react';
import { createRoot } from 'react-dom/client';
import { MarkdocEditor } from './editor';

const App: React.FC = () => {
  return (
    <div className="App">
      <MarkdocEditor />
    </div>
  )
}

createRoot(document.getElementById('app')).render(<App />);