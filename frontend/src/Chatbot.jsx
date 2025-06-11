import { useState } from "react";
import axios from "axios";
import { Container, Box, Typography, TextField, Button } from "@mui/material";

const ChatbotFrontend = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const paragraph = "Building A Overview: On the ground floor, upon entering the main entrance, the Secretary's office is located to the left, while the Church is to the right. The Principal’s office is situated behind the staircase, and the Admission office is next to the Principal's office. The Theatre is also on the ground floor, located next to the cafeteria. Moving up to the first floor, you will find the Robotics Lab in room 100, the Amphitheatre in room 104, the Office of Student Affairs in room 110, and the Office of Management in room 106. On the second floor, Room 203 houses the IT department, Room 204 is the Library, Room 207 is Mirna Akchouty’s office, Room 210 is the Learning Lab, Room 200 is designated for Cuisine, and Room 201 is the Cisco Lab. Finally, the third floor features Room 304 for the Electronics Lab, Room 303 for the School of Music, Room 301 for the Multimedia Lab, and Room 300 for the Telecom Lab.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const encodedParagraph = encodeURIComponent(paragraph);
      const encodedQuestion = encodeURIComponent(question);

      const url = `http://localhost:5000/api/chatbot/gpt/${encodedParagraph}/${encodedQuestion}`;

      const res = await axios.get(url);
      setResponse(res.data.response);
    } catch (error) {
      console.error("Axios GET error:", error);
      setResponse("Error fetching response. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chatbot About University
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            margin="normal"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit" disabled={!question}>
            Submit
          </Button>
        </form>
        {response && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Response:</Typography>
            <Typography variant="body1">{response}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ChatbotFrontend;
