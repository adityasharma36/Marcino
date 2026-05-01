
import { createSlice } from "@reduxjs/toolkit";

const normalizeProductsPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.products)) return payload.products;
    return [];
};

const getProductIdentity = (product) => {
    if (!product || typeof product !== "object") return null;
    return product._id || product.id || null;
};

const dedupeProducts = (products) => {
    const uniqueProducts = [];
    const seenIds = new Set();

    for (const product of products) {
        const identity = getProductIdentity(product);

        if (identity === null) {
            uniqueProducts.push(product);
            continue;
        }

        if (!seenIds.has(identity)) {
            seenIds.add(identity);
            uniqueProducts.push(product);
        }
    }

    return uniqueProducts;
};

const initialState = {
    products: [],
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.products = dedupeProducts(normalizeProductsPayload(action.payload));
        },

        lazyLoadingState: (state, action) => {
            const currentProducts = Array.isArray(state.products) ? state.products : [];
            const incomingProducts = normalizeProductsPayload(action.payload);
            state.products = dedupeProducts([...currentProducts, ...incomingProducts]);
        },
    },
});

export const { setProduct, lazyLoadingState } = productSlice.actions;

export default productSlice.reducer;