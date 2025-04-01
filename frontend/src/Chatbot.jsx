import { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";

const ChatbotFrontend = () => {
  const [paragraph, setParagraph] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // URL encode the paragraph and question
      const encodedParagraph = encodeURIComponent(paragraph);
      const encodedQuestion = encodeURIComponent(question);
      const url = `http://localhost:3000/api/chatbot/gpt/${encodedParagraph}/${encodedQuestion}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error fetching response. Please try again.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chatbot Frontend
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Paragraph"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
          />
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            margin="normal"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
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
