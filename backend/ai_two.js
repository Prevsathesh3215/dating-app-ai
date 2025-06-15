
async function generateAIResp(data){

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": " Bearer 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",
        "HTTP-Referer": "http://localhost:3000", // optional: your site
        "X-Title": "RizzGPT", // optional: your app's name
    },
    body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // or try "meta-llama/llama-3-8b-instruct"
        messages: [
        { role: "system", content: "You are playing the role of a person who just swiped right on me. I'll send you texts, and you'll respond to them like a regular person" },
        { role: "user", content: data.text },
        ],
    }),
    });

    const replyData = await response.json();
    return replyData.choices[0].message.content;
}


module.exports = generateAIResp;