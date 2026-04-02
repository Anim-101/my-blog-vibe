const fs = require('fs');
console.log("Memory.jsx size:", fs.statSync('src/pages/Memory.jsx').size);
console.log("Memory.css size:", fs.statSync('src/pages/Memory.css').size);
