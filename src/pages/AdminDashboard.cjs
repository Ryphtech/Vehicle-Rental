const fs = require('fs');
const file = 'c:\\Users\\thanz\\Ryph-Tech\\car rental platform\\src\\pages\\AdminDashboard.jsx';

let content = fs.readFileSync(file, 'utf-8');

// Strip single line comments
content = content.replace(/\/\/.*$/gm, '');
// Strip multi line comments
content = content.replace(/\/\*[\s\S]*?\*\//g, '');
// Strip JSX comments `{/* ... */}`
content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

// Strip strings (not perfect but good)
content = content.replace(/"([^"\\]|\\.)*"/g, '""');
content = content.replace(/'([^'\\]|\\.)*'/g, "''");
content = content.replace(/`([^`\\]|\\.)*`/g, "``");

const lines = content.split('\n');
let parenStack = [];
let braceStack = [];
let lineNo = 0;

for (let line of lines) {
    lineNo++;
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === '(') parenStack.push(lineNo);
        else if (char === ')') {
            if (parenStack.length > 0) parenStack.pop();
            else console.log(`Extra ) at line ${lineNo}`);
        }
        else if (char === '{') braceStack.push(lineNo);
        else if (char === '}') {
            if (braceStack.length > 0) braceStack.pop();
            else console.log(`Extra } at line ${lineNo}`);
        }
    }
}

console.log('Unclosed ( count:', parenStack.length);
if (parenStack.length > 0) console.log('(', parenStack);
console.log('Unclosed { count:', braceStack.length);
if (braceStack.length > 0) console.log('{', braceStack);
    
let tagStack = [];
lineNo = 0;
for (let line of lines) {
    lineNo++;
    let match;
    const tagRegex = /<\/?([a-zA-Z0-9]+)(\s|>)/g;
    while ((match = tagRegex.exec(line)) !== null) {
        let tag = match[1];
        let isClose = match[0].startsWith('</');
        if (['img', 'input', 'br', 'hr'].includes(tag.toLowerCase())) continue;
        if (match[0].endsWith('/>')) continue; 
        
        if (isClose) {
            if (tagStack.length > 0) {
                let last = tagStack.pop();
                if (last.tag.toLowerCase() !== tag.toLowerCase()) {
                    console.log(`Mismatch at line ${lineNo}: tag ${tag} closed, expected ${last.tag} (opened at line ${last.line})`);
                }
            }
        } else {
            tagStack.push({ tag, line: lineNo });
        }
    }
}
console.log('Unclosed tags:', tagStack.map(s => `${s.tag} on line ${s.line}`));
