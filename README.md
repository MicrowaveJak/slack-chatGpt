# slack-chatGpt

Slack-chatGPT is a bot that generates AI-powered responses using OpenAI's chat completion endpoint. It uses a conversation thread in Slack as the conversation history. To start a conversation, ping the bot with your first message and continue your conversation in the thread.

To use Slack-chatGPT, follow these installation instructions:

1. Clone the repository from GitHub.
2. Run `npm install` in the repository directory to install the required dependencies.
3. Create a .env file with the following contents:
```
SLACK_SIGNING_SECRET=<your slack app signing secret>
SLACK_BOT_TOKEN=<your slack bot token>
SLACK_APP_TOKEN=<your slack app token>
OPENAI_API_KEY=<your openai api key>
```
4. Start the app by running `node app.js`.

# Usage Instructions
After installing and starting the project, you can start a conversation with the bot by mentioning the bot in a Slack channel. The bot will create a new conversation thread in response to your message. You can continue the conversation by sending messages in the thread. The bot will generate AI responses and add them to the thread. The conversation will continue until you close the thread or stop sending messages.
