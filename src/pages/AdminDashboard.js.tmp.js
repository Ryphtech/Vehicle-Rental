const fs = require('fs');
const file = 'c:\\Users\\thanz\\Ryph-Tech\\car rental platform\\src\\pages\\AdminDashboard.jsx';

const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

let stack = [];
let lineNo = 0;

for (let line of lines) {
    lineNo++;
    // Extremely simplistic tag matches (ignores strings, comments, etc, but good enough to see pairs)
    let match;
    const tagRegex = /<\/?([a-zA-Z0-9]+)(\s|>)/g;
    while ((match = tagRegex.exec(line)) !== null) {
        let tag = match[1];
        let isClose = match[0].startsWith('</');
        if (['img', 'input', 'br', 'hr'].includes(tag.toLowerCase())) continue; // self closing mostly
        if (match[0].endsWith('/>')) continue; // self closing
        
        if (isClose) {
            if (stack.length > 0) {
                let last = stack.pop();
                // console.log(`Line ${lineNo}: Closing ${tag}, opened at line ${last.line} (${last.tag})`);
                if (last.tag !== tag) {
                    console.log(`Mismatch at line ${lineNo}: tag ${tag} closed, but expected ${last.tag} (opened at line ${last.line})`);
                    // process.exit(1);
                }
            } else {
                console.log(`Extra closing tag at line ${lineNo}: ${tag}`);
            }
        } else {
            stack.push({ tag, line: lineNo });
        }
    }
}

console.log('Unclosed tags remaining:', stack.map(s => `${s.tag} on line ${s.line}`));
