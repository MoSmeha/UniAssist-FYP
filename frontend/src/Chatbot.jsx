import { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";

const ChatbotFrontend = () => {
  const [paragraph, setParagraph] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setParagraph("Anontine University is a private university located in the city of Anontine. It was established in 1990 and has since grown to become one of the leading institutions of higher education in the region. The university offers a wide range of undergraduate and postgraduate programs across various fields, including business, engineering, arts, and sciences. Anontine University is known for its commitment to academic excellence, research, and community engagement. The campus is equipped with modern facilities, libraries, and laboratories to support students' learning experiences. it have two Building In Zahle A and B, in B Have a Library and a Gym, and in A have a Computer Lab and a big Hall for the students to study. The university also has a vibrant student life, with numerous clubs, organizations, and extracurricular activities that encourage personal growth and development. Anontine University is dedicated to preparing its students for successful careers and making a positive impact on society. Hmsa hasrouni is a Docter some time it in room 301 she is the head of computer science ,mirna ashouty is supervisor of computer science and CCE it is in glass room in 3rd floor and the head of CCE . Antonie Tanoury might be in last roof room 501 and he is some time in room with mirna .");
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
          Chatbot About University
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* <TextField
            label="Paragraph"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            
          /> */}
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
