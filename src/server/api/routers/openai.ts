import { z } from "zod";

import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import { type ChainValues } from "langchain/dist/schema";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// I like breaking up the system prompt into blocks so that it's easier to read and edit
// Getting chatbot AIs to format responses the way you want is a bit of a black art
// So I've found it helpful to use a mix of direct instructions in the system prompt
// as well as a bit of string manipulation in the code to get the response to look the way I want
// Here, we only want the AI to respond with HTML code with TailwindCSS classes
// Tailwind was specifically chosen because it reduces the amount of code in the HTML output
// when compared to other CSS frameworks
const systemPromptBlocks = [
  "The following is a conversation between a human and an AI-powered software engineer.",
  "The AI is programmed to only respond to queries with HTML code with TailwindCSS classes.",
  "The AI should only return the code and no other commentary.",
];
const systemPrompt = systemPromptBlocks.join(" ");

export const openaiRouter = createTRPCRouter({
  chat: publicProcedure.input(z.string().min(1)).mutation(async ({ input }) => {
    console.log({ input });
    // Set up chat model. Replace this with gpt-4 if you have access and prefer accuracy > speed
    const chat = new ChatOpenAI({
      temperature: 0.5,
      modelName: process.env.OPENAI_MODEL_NAME ?? "gpt-3.5-turbo",
    });

    // Set up the prompts for the chat model. The system prompt is the most important one here,
    // as it controls how our responses get formatted.
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPrompt),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    // Set up a conversation chain with Memory. This lets us update the code in a conversational format
    const chain = new ConversationChain({
      memory: new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
      }),
      prompt: chatPrompt,
      llm: chat,
    });

    let response: ChainValues;
    try {
      response = await chain.call({
        input,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error calling chain");
    }

    if ("response" in response) {
      const htmlResponse = response.response as string;
      // Remove markdown ticks and language formatter from response
      return htmlResponse.replace(/`/g, "").replace("html", "");
    } else {
      throw new Error("No response");
    }
  }),
});
