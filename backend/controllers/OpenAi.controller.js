import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.QQ,
});
export const chatbot = async (req, res) => {
  try {
    const pp = req.params.pp;
    const myprompt =
      "please i will give you a paragraph " +
      pp +
      "please i will ask you a question later dont give me an answer only only from the paragraph if the paragraph doesnot containe a answer say I dont Know" +
      "the question is : ";

    const prompt = req.params.prompt;
    const prompt1 = myprompt + prompt;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [{ role: "user", content: prompt1 }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
