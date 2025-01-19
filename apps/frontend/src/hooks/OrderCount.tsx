import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
    counts: {
        pending: 0,
        processing: 0,
        delivered: 0,
        onDelivery: 0,
        cancelled: 0,
    },
    status: "idle",
    error: null,
};

// Reducer function
function orderCountReducer(state, action) {
    switch (action.type) {
        case "FETCH_ORDER_COUNTS_PENDING":
            return { ...state, status: "loading" };
        case "FETCH_ORDER_COUNTS_FULFILLED":
            return { ...state, status: "succeeded", counts: action.payload };
        case "FETCH_ORDER_COUNTS_REJECTED":
            return { ...state, status: "failed", error: action.payload };
        default:
            return state;
    }
}

function UseOrderCount() {
    const [state, dispatch] = useReducer(orderCountReducer, initialState);

    useEffect(() => {
        fetchOrderCounts();
    }, []);

    // Async function to fetch order counts
    const fetchOrderCounts = async () => {
        dispatch({ type: "FETCH_ORDER_COUNTS_PENDING" });
        try {
            const response = await fetch("/api/admin/orders/count", {
                headers: {
                    Authorization: localStorage.getItem("token")
                        ? `${localStorage.getItem("token")}`
                        : "",
                },
            });
            const data = await response.json();
            dispatch({
                type: "FETCH_ORDER_COUNTS_FULFILLED",
                payload: data?.data,
            });
        } catch (error) {
            dispatch({
                type: "FETCH_ORDER_COUNTS_REJECTED",
                payload: error.message,
            });
        }
    };

    // Value to be provided by the context
    const value = {
        state,
        fetchOrderCounts,
    };

    return value;
}

export default UseOrderCount;
