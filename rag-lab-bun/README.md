Simple RAG Application for Parsing Text from Images

Converts Images to base64 and forward to OpenAI API to parse the text.

Takes the returned text, vectorizes the data and stores in postgres as text and vectors

When querying, the database, the the query is vectored, then we use pgvector to determing the cosin similarity of the query to potential entries.

If a relavent entry is found, the text is returned and the information is added to the user's query to chatGPT, in order to give it the appropriate information to answer accurately.