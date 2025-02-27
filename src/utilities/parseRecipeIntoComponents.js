export default function parseMarkdown(mdText) {
    const allowedHeadings = ['title', 'ingredients', 'instructions'];
    const sections = {};
    let currentSection = "title";
    let cur = null;
    sections[currentSection] = [];
    console.log("content from Parse: ", mdText);
    const lines = mdText.split('\n');
    
    lines.forEach(line => {
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            const [, , heading] = headingMatch;
            currentSection = heading.trim();
            console.log("current section: ", currentSection);
            if (!allowedHeadings.includes(currentSection.toLowerCase())) {
                currentSection = "title"; 
            }
            sections[currentSection] = [];
            if (currentSection === "title") {
                sections[currentSection].push(heading.trim());
            }
        } else if (currentSection !== null) {
            sections[currentSection].push(line.trim());
        }
    });
    
    return Object.fromEntries(
        Object.entries(sections).map(([key, value]) => [key.toLowerCase(), value.join('\n').trim()])
    );
}

// module.exports = { parseMarkdown };

// Example usage
const markdownText = `# Samosa's
## Ingredients
- 2 lb. white potatoes
- Salt, to taste
- 1 tsp. red pepper
- ½ tsp. chili flakes
- 2 tsp. cumin seed
- 1 tsp. black pepper
- ½ tsp. turmeric
- ½ cup peas
## Instructions
1. Boil potatoes until soft.
2. Combine rest of ingredients to make filling.
3. Add 2 tbsp of filling into wrap.
4. Deep fry for 3-5 minutes.`;

const parsedResult = parseMarkdown(markdownText);
console.log(parsedResult);
