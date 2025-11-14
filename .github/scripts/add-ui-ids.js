const fs = require("fs");
const path = require("path");

const files = process.argv[2]
  .trim()
  .split(" ")
  .filter((f) => f);

// HTML elements that typically need IDs
const interactiveElements = [
  "button",
  "input",
  "select",
  "textarea",
  "a",
  "form",
  'div[class*="component"]',
  'div[class*="widget"]',
  "section",
  "article",
  "nav",
  "header",
  "footer",
];

function generateUniqueId(elementType, existingIds) {
  let baseId = elementType.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  let counter = 1;
  let id = `${baseId}-${counter}`;

  while (existingIds.has(id)) {
    counter++;
    id = `${baseId}-${counter}`;
  }

  return id;
}

function addIdsToHtml(filePath) {
  console.log(`Processing HTML file: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  const existingIds = new Set();

  // Extract existing IDs
  const idPattern = /id=["']([^"']+)["']/g;
  let match;
  while ((match = idPattern.exec(content)) !== null) {
    existingIds.add(match[1]);
  }

  // Add IDs to elements without them
  let modified = false;

  // Process different element types - simpler regex
  const patterns = [
    { regex: /<button(?![^>]*\bid=)/gi, type: "button" },
    { regex: /<input(?![^>]*\bid=)/gi, type: "input" },
    { regex: /<select(?![^>]*\bid=)/gi, type: "select" },
    { regex: /<textarea(?![^>]*\bid=)/gi, type: "textarea" },
    { regex: /<a(?![^>]*\bid=)(?=[^>]*href)/gi, type: "link" },
    { regex: /<form(?![^>]*\bid=)/gi, type: "form" },
    { regex: /<nav(?![^>]*\bid=)/gi, type: "nav" },
    { regex: /<section(?![^>]*\bid=)/gi, type: "section" },
    { regex: /<article(?![^>]*\bid=)/gi, type: "article" },
    { regex: /<aside(?![^>]*\bid=)/gi, type: "aside" },
  ];

  patterns.forEach(({ regex, type }) => {
    let counter = 0;
    content = content.replace(regex, (match) => {
      const id = generateUniqueId(type, existingIds);
      existingIds.add(id);
      modified = true;
      counter++;

      // Add both id and data-testid right after the tag name
      return match + ` id="${id}" data-testid="${id}"`;
    });
    if (counter > 0) {
      console.log(`  - Added IDs to ${counter} ${type} elements`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added IDs to: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  No changes needed for: ${filePath}`);
    return false;
  }
}

function addIdsToJsx(filePath) {
  console.log(`Processing JSX/TSX file: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  const existingIds = new Set();

  // Extract existing IDs
  const idPattern =
    /(?:id|data-testid)=(?:["']([^"']+)["']|{["']([^"']+)["']})/g;
  let match;
  while ((match = idPattern.exec(content)) !== null) {
    existingIds.add(match[1] || match[2]);
  }

  let modified = false;

  // Add IDs to JSX elements without them
  const jsxPattern =
    /<([A-Z][a-zA-Z0-9]*|button|input|select|textarea|a|form|div|section)(?![^>]*(?:id|data-testid)=)([^>\/]*)(\/?)/gi;

  content = content.replace(
    jsxPattern,
    (match, tag, attributes, selfClosing) => {
      // Skip if already has an id or data-testid
      if (/(?:id|data-testid)=/.test(attributes)) {
        return match;
      }

      const id = generateUniqueId(tag, existingIds);
      existingIds.add(id);
      modified = true;

      return `<${tag}${attributes} id="${id}" data-testid="${id}"${selfClosing}`;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added IDs to: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  No changes needed for: ${filePath}`);
    return false;
  }
}

// Process each file
let totalModified = 0;

files.forEach((file) => {
  if (!file || file.includes("node_modules")) return;

  const ext = path.extname(file);
  let wasModified = false;

  try {
    if (ext === ".html") {
      wasModified = addIdsToHtml(file);
    } else if ([".jsx", ".tsx"].includes(ext)) {
      wasModified = addIdsToJsx(file);
    } else if (ext === ".vue") {
      // Basic Vue support - can be enhanced
      wasModified = addIdsToHtml(file);
    }

    if (wasModified) totalModified++;
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(
  `\n✨ Processed ${files.length} files, modified ${totalModified} files`
);
