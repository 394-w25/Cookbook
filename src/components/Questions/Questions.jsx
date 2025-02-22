import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Questions({ recipeText }) {
    const [prompts, setPrompts] = useState([]); // ✅ Initialize as an empty array
    const [answers, setAnswers] = useState([]); // ✅ Will be updated dynamically
    const [journal, setJournal] = useState("");
    const [showFields, setShowFields] = useState(true);
    const [loading, setLoading] = useState(false);

    const gpt_prompt = `
        **Your Task:**

        You are an AI designed to generate meaningful family-related questions based on a given recipe. Your goal is to create engaging, reflective questions that encourage storytelling and personal connections around this recipe.

        **Instructions:**

        1. **Analyze the Recipe:**  
        - Review the provided recipe text and extract meaningful aspects related to its origin, cultural significance, and uniqueness.  
        - Use this analysis to generate thoughtful questions that inspire family members to share memories, traditions, or historical context.  

        2. **Generate Structured Questions:**  
        - The output must be **formatted as a valid JSON object** (not enclosed in markdown code blocks).  
        - Ensure it **strictly follows** this JSON structure:  

        {
            "origin": "What is the story behind this recipe? Who first introduced it to the family?",
            "memory": "Do you have any special memories associated with making or eating this dish?",
            "uniqueness": "What makes this recipe unique compared to similar dishes in other families or cultures?"
        }

        3. **Ensure Quality:**  
        - Questions should be open-ended, engaging, and designed to spark meaningful discussions.  
        - Avoid yes/no questions and instead encourage storytelling and reflection.  

        4. **Output Format Guidelines:**  
        - The response **must be a valid JSON object**.  
        - **Do not wrap the JSON output in code block formatting (such as \`\`\`json ... \`\`\`).**  
        - Ensure proper JSON syntax without additional text or explanation.  

        5. **Recipe Input:**  
        The recipe is as follows:  

        ${recipeText}
        `;

    const fetchOpenAIGeneratedQuestions = async () => {
        try {
            const response = await axios.post(
            'https://us-central1-generationalcookbook.cloudfunctions.net/sendOpenAIAPIRequestWOImage',
            { prompt: gpt_prompt }
            );
            if (response.data && response.data.choices) {
                const content = response.data.choices[0]?.message?.content;
                if (content) {
                    console.log("JSON parsed content: ", JSON.parse(content));
                    return JSON.parse(content); // ✅ Parse JSON output
                }
            }
            return null;
        } catch (error) {
          console.error('Axios Network Error:', error);
          throw error;
        }
      };

    const backupPrompts = [
        "Who invented this recipe and when is it usually made?",
        "What is a memory that you associate with this recipe?",
        "What makes this recipe unique in your family?"
    ];

    async function fetchPrompts() {
        try {
            const data = await fetchOpenAIGeneratedQuestions();
            if (data) {
                console.log("Fetched data: ", data);
                const extractedPrompts = Object.values(data); // Extract values from JSON
                setPrompts(extractedPrompts);
                setAnswers(new Array(extractedPrompts.length).fill("")); // ✅ Initialize answers with empty strings
            }
            else {
                console.log("Using backup prompts");
                setPrompts(backupPrompts);
                setAnswers(new Array(backupPrompts.length).fill("")); // ✅ Initialize answers with empty strings
            }
        } catch (err) {
            console.error('Error fetching prompts:', err);
        }
    }
    // Call the function to fetch prompts when the component mounts
    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await axios.post('https://us-central1-generationalcookbook.cloudfunctions.net/writejournal',
                { answers: answers }
            );

            console.log(res);

            setJournal(res.data.journal || "Could not generate journal entry.");
            setShowFields(false);
            setLoading(false);
        }
        catch (err) {
            console.error('Error creating journal: ' + err);
        }
    }

    return (
    showFields ? (<Box sx={{ width: 500, maxWidth: '100%' }}>
        {prompts.map((prompt, index) => (
            <Box key={index}>
                <Typography variant="h6" gutterBottom>{index+1}. {prompt}</Typography>

                {/* Textbox for answers */}
                <TextField fullWidth label="" id="fullWidth" onChange={(e) => {
                    // copy array
                    const newAns = [...answers];
                    // modify the one answer
                    newAns[index] = e.target.value;
                    setAnswers(newAns);
                    
                    // console.log(newAns);
                }} />
            </Box>
        ))}
        <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
    </Box>) : (
        <p>{journal}</p>
    )
    );
}

export default Questions