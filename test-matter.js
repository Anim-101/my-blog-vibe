import matter from 'gray-matter';
const fileContent = `---\ntitle: "Test Title"\ndate: "October 15, 2023"\n---\n\n# Test`;
console.log(matter(fileContent));
