const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph")
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai")
const { ToolMessage, AIMessage, HumanMessage } = require("@langchain/core/messages")
const tools = require("./tools")    


const model = new ChatGoogleGenerativeAI({
    // Override in .env via GEMINI_MODEL if needed.
    model: process.env.GEMINI_MODEL || "models/gemini-flash-latest",
    temperature: 0.5,
})


const graph = new StateGraph(MessagesAnnotation)
    .addNode("tools", async (state, config) => {

        const lastMessage = state.messages[ state.messages.length - 1 ]

        const toolsCall = lastMessage.tool_calls

        const toolCallResults = await Promise.all(toolsCall.map(async (call) => {

            const tool = tools[ call.name ]
            if (!tool) {
                throw new Error(`Tool ${call.name} not found`)
            }
            const toolInput = call.args

            console.log("Invoking tool:", call.name, "with input:", call)

            const toolResult = await tool.func({ ...toolInput, token: config.metadata.token })

            return new ToolMessage({ content: toolResult, name: call.name })

        }))

        state.messages.push(...toolCallResults)

        return state
    })
    .addNode("chat", async (state, config) => {
        // NOTE: Gemini tool/function-calling may require thought signatures.
        // To avoid runtime failures, we do plain chat here.
        const response = await model.invoke(state.messages)


        state.messages.push(new AIMessage({ content: response.text, tool_calls: response.tool_calls }))

        return state

    })
    .addEdge("__start__", "chat")
    .addConditionalEdges("chat", async (state) => {

        const lastMessage = state.messages[ state.messages.length - 1 ]

        if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
            return "tools"
        } else {
            return "__end__"
        }

    })
    .addEdge("tools", "chat")



const agent = graph.compile()


module.exports = agent







