const fs = require('fs');
const content = `
import { createRoot } from 'react-dom/client';
import React from 'react';
import Memory from './src/pages/Memory';
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));
root.render(<BrowserRouter><Memory /></BrowserRouter>);
console.log("Rendered!");
`;
fs.writeFileSync('test_render.js', content);
