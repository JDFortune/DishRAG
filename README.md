Simple RAG Application for Parsing Text from Images.
Users can then query an AI model that has access to information stored in the database.

Converts Images to base64 and forward to OpenAI API to parse the text.

Takes the returned text, vectorizes the data and stores in postgres as text and vectors

When querying, the database, the the query is vectored, then we use pgvector to determing the cosin similarity of the query to potential entries.

If a relevant entry is found, the text is returned and the information is added to the user's query to chatGPT, in order to give it the appropriate information to answer accurately.

NOTE: This project requires an active API key from OpenAI, in order to interface with the GPT models. To work, you need to include a .env file in the `text_processor_app` directory. Add your API key to the `VITE_OPENAI_API_KEY` var. The frontend will playground front_end will use this API key to both send and embed data.
