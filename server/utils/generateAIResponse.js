import axios from "axios";

export async function getOpenRouterResponse(prompt) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // set this in .env

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // works similarly to OpenAI
        messages: [
          { role: "system", content: "You are a Smart Rent & Utility Assistant in Kenya." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        }
      }
    );

    // OpenRouter responses follow OpenAI’s JSON structure
    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    return "AI is currently unavailable. Please try again later.";
  }
}
