import React from 'react'
import { useState } from 'react';
import { useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import Questions from '../Questions/Questions'
import { Card, CardContent } from '@mui/material';

// function PromptsScreen() {
//   const location = useLocation();
//     const data = location.state?.data; // Retrieve the passed data safely

//     const [sentRequest, setSentRequest] = useState(false);
//     const [showQuestions, setShowQuestions] = useState(false);

//     console.log("Received data:", data); // Debugging: check if data is received
  
//   return (
//     <Card>
//       <CardContent>
//         {data ? 
//           <pre className='markdown-output'>
//             <ReactMarkdown>{data}</ReactMarkdown>
//           </pre> : sentRequest ?
//           <Box sx={{ display: 'flex' }}>
//             <CircularProgress />
//           </Box> : null
//         }
//         {showQuestions && (
//           <Questions />
//         )} 
//       </CardContent>
//     </Card>
//   )
// }

function PromptsScreen() {
  const location = useLocation();
  const data = location.state?.data || "No data received"; // ✅ Safe fallback

  console.log("Received data:", data); // Debugging output

  return (
    <div className='container'>
      <Card className='prompt-card'> {/* ✅ Apply class here for margin */}
        <CardContent className='prompt-content'> {/* ✅ Apply class here for padding */}
          {data && data.trim() !== "" ? (
            <pre>
              <ReactMarkdown>{data}</ReactMarkdown>
            </pre>
          ) : (
            <p>No recipe data available. Please go back and try again.</p>
          )}
          <Questions recipeText={data}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default PromptsScreen;