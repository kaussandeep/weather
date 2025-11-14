const fs = require('fs');
const path = require('path');

const files = process.argv[2].trim().split(' ');

function generateTestTemplate(filePath) {
  const fileName = path.basename(filePath, '.js');
  const testFileName = `${fileName}.test.js`;
  const testFilePath = path.join(path.dirname(filePath), testFileName);

  // Read the source file
  let sourceCode = '';
  try {
    sourceCode = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return;
  }

  // Extract function names
  const functionPattern = /(?:const|let|var|function)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
  const namedFunctionPattern = /(?:async\s+)?function\s+(\w+)\s*\([^)]*\)/g;
  
  const functions = [];
  let match;

  while ((match = functionPattern.exec(sourceCode)) !== null) {
    functions.push(match[1]);
  }

  while ((match = namedFunctionPattern.exec(sourceCode)) !== null) {
    functions.push(match[1]);
  }

  // Generate test content
  const testContent = `/**
 * Auto-generated unit tests for ${fileName}.js
 * Generated on: ${new Date().toISOString()}
 * 
 * ⚠️ IMPORTANT: Please review and customize these tests
 * These are template tests and may need adjustment based on actual implementation
 */

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock jQuery if needed
global.$ = jest.fn((selector) => ({
  val: jest.fn(),
  append: jest.fn(),
  empty: jest.fn(),
  click: jest.fn(),
  css: jest.fn(),
}));

describe('${fileName}', () => {
${functions.map(funcName => `
  describe('${funcName}', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should be defined', () => {
      expect(${funcName}).toBeDefined();
      expect(typeof ${funcName}).toBe('function');
    });

    test('should handle normal execution', async () => {
      // TODO: Add specific test implementation
      // This is a template - customize based on function behavior
      const result = await ${funcName}();
      expect(result).toBeDefined();
    });

    test('should handle errors gracefully', async () => {
      // TODO: Add error handling test
      // Mock error conditions and verify proper handling
    });
  });
`).join('\n')}
  
  // Integration tests
  describe('Integration tests', () => {
    test('should work together correctly', () => {
      // TODO: Add integration tests if multiple functions interact
    });
  });
});
`;

  // Write test file
  try {
    fs.writeFileSync(testFilePath, testContent);
    console.log(`✅ Generated test file: ${testFilePath}`);
  } catch (error) {
    console.error(`Error writing test file ${testFilePath}:`, error);
  }
}

// Generate tests for all files without tests
files.forEach(file => {
  if (file && !file.includes('node_modules')) {
    generateTestTemplate(file);
  }
});

console.log('\n✨ Test generation complete!');
