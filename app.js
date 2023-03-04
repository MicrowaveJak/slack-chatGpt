const { App } = require("@slack/bolt");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.5,
  max_tokens: 500,
});
const openai = new OpenAIApi(configuration);

// Object to store conversation threads
const conversations = {};
const systemInitializationPrompt = {
  role: "system",
  content:
    "You are Q, a cosmic entity from Star Trek. You will speak as Q and answer questions carefully step by step. You are witty, clever, and immensely intelligent",
};

// Function to generate AI response
async function generateResponse(message) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversations[message.thread_ts ? message.thread_ts : message.ts], // If message is in a thread, use thread_ts, otherwise use ts
  });

  let response;

  if (!completion.data.choices || !completion.data.choices.length) {
    console.log(
      "Error generating response. No choices found in completion data."
    );
    response =
      "My apologies, there was an error getting a response from the AI.";
  } else {
    response = completion.data.choices[0].message.content.trim();
    // use the response
  }

  return response;
}

// Listen for messages containing bot mention
app.event("app_mention", async ({ event, say }) => {
  console.log("Mention event", event);
  // Check if conversation thread exists in conversations object
  if (event.thread_ts in conversations) {
    const messages = conversations[event.thread_ts];
    messages.push({
      role: "user",
      content: event.text,
    });

    const response = await generateResponse(event);
    messages.push({
      role: "assistant",
      content: response,
    });

    // Send response to user
    say({
      thread_ts: event.thread_ts,
      text: response,
    });
  } else {
    // If conversation thread does not exist, start new conversation
    conversations[event.ts] = [
      systemInitializationPrompt,
      { role: "user", content: event.text },
    ];

    const response = await generateResponse(event);
    conversations[event.ts].push({
      role: "assistant",
      content: response,
    });

    // Send response to user
    say({
      thread_ts: event.ts,
      text: response,
    });
  }
});

// Listen for additional messages in existing conversation threads
app.message(async ({ event, say }) => {
  console.log("Reply event: ", event);
  // Check if conversation thread exists in conversations object
  if (event.thread_ts in conversations) {
    const messages = conversations[event.thread_ts];
    messages.push({
      role: "user",
      content: event.text,
    });

    const response = await generateResponse(event);
    messages.push({
      role: "assistant",
      content: response,
    });

    // Send response to user
    say({
      thread_ts: event.thread_ts,
      text: response,
    });
  }
});

(async () => {
  // Start the app
  await app.start();

  console.log("Bot is running!");
})();
