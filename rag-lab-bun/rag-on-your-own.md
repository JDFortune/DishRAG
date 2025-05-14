For this lab, you’ll build your own Retrieval Augmented Generation (RAG) project. Your project should incorporate tools and techniques we've covered in the labs, like information retrieval, vector search, and text generation.

We'll leave the implementation details to you, but provide some ideas and suggestions to get started.
## Part 1: RAG Basics

To start, you should think about what type of data you'd like to embed and how its retrieval will enhance the experience of your chatbot. There are many things we can ask a general-purpose LLM and get great answers without additional retrieval. Embedding facts about well-known historical events, for example, would likely result in a chatbot that provides answers similar to what ChatGPT can already provide. Consider the things you _can't_ ask a general-purpose LLM. For example, we can't ask ChatGPT about:

-  Current events: Sports, news, trending topics
- Real-time information: weather, stock market, traffic
- Personal information: purchase history, social media activity, personal blogs, family recipes
- Domain-specific knowledge: company-specific documents, manuals, documentation

Because we haven't covered chunking, you should choose something that is naturally "chunked" in stand-alone sentences or small paragraphs.

## Part 2: Adding Your Own Features

Once you've built a basic RAG implementation, consider how your project would benefit from other tools we've explored in the labs. Try to incorporate at least one feature from a previous lab:
- Preserving chat history
- Using custom tools with Langchain
- Using the Instructor library to create structured data that benefits your project
- Storing conversation history
- Testing different styles of prompt engineering


If you're looking for inspiration, you can look at the sample project that uses personal blog posts as the retrieved data. Here are a few ideas you can feel free to use:

- A chatbot trained in a set of family recipes
- A chatbot that mimics a historical figure based on memoirs
- A chatbot that specializes in your favorite video game or fan wiki
- A chatbot that helps suggest your next book or predict if you'll enjoy a book based on your personal book reviews
- A chatbot that helps you come up with quotes appropriate for any occasion from your favorite movies
- A chatbot that helps new players design D&D characters or DMs come up with role-playing scenarios