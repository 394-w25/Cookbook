import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';

function Questions() {
    const prompts = [
        "Who invented this recipe and when is it usually made?",
        "What is a memory that you associate with this recipe?",
        "What makes this recipe unique in your family?"
    ];

    // https://stackoverflow.com/questions/34937349/javascript-create-empty-array-of-a-given-size
    const [answers, setAnswers] = React.useState(Array(prompts.length).fill(""));

    const [journal, setJournal] = React.useState("");

    const [showFields, setShowFields] = React.useState(true);
    
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await fetch ("https://news-menu.onrender.com/writejournal", {
                method: "POST",
                body: JSON.stringify({ answers }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const entry = await res.json();
            // console.log(entry);
            setJournal(entry.journal || "Could not generate journal entry.");
            setShowFields(false);
            setLoading(false);
        }
        catch (err) {
            console.error('Error creating journal: ' + err);
        }
    }

    return (
        <Container>

    {showFields ? (<Box sx={{ width: 500, maxWidth: '100%' }}>
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
    )}
    </Container>
    );
}

export default Questions