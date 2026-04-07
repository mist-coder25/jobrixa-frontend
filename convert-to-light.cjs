const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  [/#0d1117/gi, '#ffffff'],
  [/#161B22/gi, '#ffffff'], 
  [/#1C2128/gi, '#f6f8fa'],
  
  // Borders
  [/#21262D/gi, '#eaeef2'],
  [/#30363D/gi, '#d0d7de'],
  
  // Text
  [/#E6EDF3/gi, '#1c2128'],
  [/#C9D1D9/gi, '#1c2128'],
  [/#8B949E/gi, '#57606a'],
  [/#7D8590/gi, '#57606a'],
  [/#484F58/gi, '#8c959f'],
  
  // Accents
  [/#58a6ff/gi, '#0969da'],
  [/#2ea043/gi, '#1a7f37'],
  [/#3fb950/gi, '#2da44e'],
  [/#F85149/gi, '#cf222e'],
  [/#D29922/gi, '#9a6700'],
  
  // Tailwind classes
  [/text-white/gi, 'text-[#1c2128]'], 
  [/bg-black/gi, 'bg-white'],
  [/bg-primary/gi, 'bg-[#ffffff]'],
  [/text-textPrimary/gi, 'text-[#1c2128]'],
  [/text-textSecondary/gi, 'text-[#57606a]'],
  [/bg-surface/gi, 'bg-[#ffffff] shadow-sm'],
  [/border-border/gi, 'border-[#d0d7de]'],
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
  'src/components/AddApplicationModal.tsx',
  'src/components/QuickAddModal.tsx',
  'src/components/MissedTracker.tsx',
  'src/components/FilterPanel.tsx',
  'src/components/NotificationCenter.tsx',
  'src/layouts/DashboardLayout.tsx',
  'src/App.tsx'
];

const root = 'd:/projects/Jobrixa/jobrixa-frontend';

files.forEach(file => {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    
    // Safety check for buttons that should stay white text
    content = content.replace(/bg-\[#1a7f37\] (.*) text-\[#1c2128\]/g, 'bg-[#1a7f37] $1 text-white');
    content = content.replace(/bg-\[#0969da\] (.*) text-\[#1c2128\]/g, 'bg-[#0969da] $1 text-white');
    content = content.replace(/bg-\[#cf222e\] (.*) text-\[#1c2128\]/g, 'bg-[#cf222e] $1 text-white');

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
});
