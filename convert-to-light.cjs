const fs = require('fs');
const path = require('path');

const replacements = [
  [/#0d1117/gi, '#ffffff'],
  [/#161B22/gi, '#ffffff'], // cards go to white
  [/#21262D/gi, '#f6f8fa'], // some backgrounds go to light grey
  [/#30363D/gi, '#d0d7de'], // borders
  [/#C9D1D9/gi, '#1c2128'], // text
  [/#8B949E/gi, '#57606a'], // text
  [/#7D8590/gi, '#57606a'], // text
  [/#58a6ff/gi, '#0969da'], // links
  [/#2ea043/gi, '#1a7f37'], // green
  [/#3fb950/gi, '#2da44e'], // green
  [/text-white/gi, 'text-[#1c2128]'], 
  [/bg-black/gi, 'bg-white'],
  [/border-[#21262D]/gi, 'border-[#d0d7de]'],
  [/bg-[#21262D]/gi, 'bg-[#f6f8fa]'],
  [/shadow-\[0_8px_24px_rgba\(46,160,67,0\.12\)\]/gi, 'shadow-md'],
];

const files = [
  'src/pages/Landing.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Pipeline.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Pricing.tsx',
  'src/pages/Discover.tsx',
  'src/pages/Analytics.tsx',
  'src/pages/Login.tsx',
  'src/pages/Register.tsx',
  'src/components/TopBar.tsx',
  'src/components/ApplicationCard.tsx',
  'src/components/CompanyLogo.tsx',
  'src/components/AddApplicationModal.tsx'
];

const root = 'd:/projects/Jobrixa/jobrixa-frontend';

files.forEach(file => {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    
    // Special case for cards that need shadow
    // Example: bg-[#ffffff] border border-[#d0d7de] -> add shadow
    content = content.replace(/className="(.*)bg-\[#ffffff\](.*)border(.*)"/g, (match, p1, p2, p3) => {
        if (!match.includes('shadow')) {
            return `className="${p1}bg-[#ffffff]${p2}border${p3} shadow-sm"`;
        }
        return match;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
});
