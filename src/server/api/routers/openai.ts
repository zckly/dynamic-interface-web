import { z } from "zod";

import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const systemPromptBlocks = [
  "The following is a conversation between a human and an AI-powered software engineer.",
  "The AI is programmed to only respond to queries with HTML code with TailwindCSS classes.",
  "The AI should only return the code and no other commentary.",
];
const SYSTEM_PROMPT = systemPromptBlocks.join(" ");

export const openaiRouter = createTRPCRouter({
  chat: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    // Set up chat model. Replace this with gpt-4 if you have access and prefer accuracy > speed
    const chat = new ChatOpenAI({
      temperature: 0.5,
      modelName: "gpt-4",
    });

    // Set up the prompts for the chat model. The system prompt is the most important one here,
    // as it controls how our responses get formatted.
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
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

    const response = await chain.call({
      input,
    });

    if ("response" in response) {
      const htmlResponse = response.response as string;
      // Remove markdown ticks and language formatter from response
      return htmlResponse.replace(/`/g, "").replace("html", "");
    } else {
      throw new Error("No response");
    }
  }),
});
