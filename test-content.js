import matter from 'gray-matter';
import fs from 'fs';
const raw = fs.readFileSync('src/content/blog/modern-architecture.md', 'utf8');
console.log(matter(raw));
