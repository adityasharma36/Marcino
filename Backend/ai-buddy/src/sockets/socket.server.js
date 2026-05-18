const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const agent = require('../agent/agent');
const axios = require('axios');

const CART_HELP_MESSAGE = [
    "I don't have direct access to your personal shopping accounts or a specific website's shopping cart.",
    'To help you, I need a bit more information:',
    '1. Which website or store are you shopping on?',
    '2. Which specific shirt would you like to add? (A link or a description like "Blue linen button-down, size Medium" helps).',
    '3. Are you using a specific app or service (like Amazon, Instacart, or a grocery app) that has an AI integration?',
    'If you are looking for a recommendation: Tell me what style, size, or budget you have in mind, and I can find some options and provide links for you!'
].join('\n');


function normalizeText(value) {
    return String(value ?? '').trim();
}

function parseAddToCartCommand(text) {
    const t = normalizeText(text);

    // Examples:
    // - add to cart iphone qty 2
    // - add iphone to cart x2
    // - cart add iphone
    const patterns = [
        /^\s*(add\s+to\s+cart|add\s+cart|cart\s+add)\s+(.+)$/i,
        /^\s*add\s+(.+?)\s+to\s+cart\s*$/i,
    ];

    let rest = null;
    for (const pattern of patterns) {
        const match = t.match(pattern);
        if (match) {
            rest = normalizeText(match[match.length - 1]);
            break;
        }
    }
    if (!rest) return null;

    let qty = 1;
    const qtyMatch = rest.match(/\b(?:qty|quantity)\s*[:=]?\s*(\d+)\b/i);
    if (qtyMatch) {
        qty = Math.max(1, Number(qtyMatch[1]));
        rest = normalizeText(rest.replace(qtyMatch[0], ''));
    }

    const xMatch = rest.match(/\bx\s*(\d+)\s*$/i);
    if (xMatch) {
        qty = Math.max(1, Number(xMatch[1]));
        rest = normalizeText(rest.replace(xMatch[0], ''));
    }

    const query = rest;
    if (!query) return null;

    return { query, qty };
}

function isAddToCartIntent(text) {
    const t = normalizeText(text);
    return /\badd\b/i.test(t) && /\bcart\b/i.test(t);
}

function parseSearchProductCommand(text) {
    const t = normalizeText(text);
    const m = t.match(/^\s*(search\s+product|search|find)\s+(.+)$/i);
    if (!m) return null;
    const query = normalizeText(m[2]);
    if (!query) return null;
    return { query };
}

async function searchProducts({ query, token }) {
    const response = await axios.get('http://localhost:3001/api/products', {
        params: { q: query, limit: 20 },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const list = Array.isArray(response?.data?.data) ? response.data.data : [];
    return list;
}

async function addToCart({ productId, qty, token }) {
    const response = await axios.post('http://localhost:3002/api/cart/items', {
        productId,
        qty,
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response?.data;
}



async function initSocketServer(httpServer) {

    const io = new Server(httpServer, {
        path: "/api/socket/socket.io/",
    })

    io.use((socket, next) => {

        const cookies = socket.handshake.headers?.cookie;

        const cookieToken = cookies ? cookie.parse(cookies)?.token : null;
        const authToken = socket.handshake.auth?.token;

        const authHeader = socket.handshake.headers?.authorization;
        const bearerToken = typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')
            ? authHeader.slice(7).trim()
            : null;

        const token = cookieToken || authToken || bearerToken;

        if (!token) {
            return next(new Error('Token not provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decoded;
            socket.token = token;

            next()

        } catch (err) {
            next(new Error('Invalid token'));
        }

    })

    io.on('connection', (socket) => {

        console.log({
            id: socket.user?.id,
            email: socket.user?.email,
            role: socket.user?.role,
        })


        socket.on('message', async (data) => {
            try {
                const text = normalizeText(data);

                // 1) Local command handling (no Gemini tool-calling required)
                const addCmd = parseAddToCartCommand(text);
                if (addCmd) {
                    const products = await searchProducts({ query: addCmd.query, token: socket.token });
                    const first = products[0];
                    const productId = first?._id || first?.id;
                    if (!productId) {
                        socket.emit('message', `No product found for "${addCmd.query}"`);
                        return;
                    }

                    await addToCart({ productId, qty: addCmd.qty, token: socket.token });
                    socket.emit('message', `Added to cart: ${first?.title || productId} (qty ${addCmd.qty})`);
                    return;
                }

                if (isAddToCartIntent(text)) {
                    socket.emit('message', CART_HELP_MESSAGE);
                    return;
                }

                const searchCmd = parseSearchProductCommand(text);
                if (searchCmd) {
                    const products = await searchProducts({ query: searchCmd.query, token: socket.token });
                    if (!products.length) {
                        socket.emit('message', `No products found for "${searchCmd.query}"`);
                        return;
                    }
                    const top = products.slice(0, 5).map((p) => `- ${p?.title || p?._id}`);
                    socket.emit('message', `Top results:\n${top.join('\n')}`);
                    return;
                }

                const agentResponse = await agent.invoke({
                    messages: [
                        {
                            role: "user",
                            content: text
                        }
                    ]
                }, {
                    metadata: {
                        token: socket.token
                    }
                })

                const lastMessage = agentResponse.messages[ agentResponse.messages.length - 1 ]

                socket.emit('message', lastMessage?.content ?? '')
            } catch (err) {
                console.error('AI buddy message error:', err?.message || err)

                const hint = !process.env.GOOGLE_API_KEY
                    ? 'Missing GOOGLE_API_KEY in ai-buddy .env'
                    : null

                const thoughtHint = String(err?.message || '').includes('thought_signature')
                    ? 'Gemini tool-calling failed (thought_signature). This server handles cart/search commands without tools now.'
                    : null

                socket.emit('message', `Error: ${err?.message || 'Failed to process message'}${hint ? ` (${hint})` : ''}${thoughtHint ? ` (${thoughtHint})` : ''}`)
            }

        })

    })

}


module.exports = { initSocketServer };