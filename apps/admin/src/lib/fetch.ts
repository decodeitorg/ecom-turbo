import { getApiUrl } from "./utils";

export const fetchData = async (
    url: string,
    options?: RequestInit
): Promise<any> => {
    try {
        const response = await fetch(getApiUrl() + url, {
            ...options,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                ...options?.headers,
            },
        });
        const body = await response.json();

        if (!response.ok) {
            throw new Error(body?.message || "Failed to fetch");
        }

        return body.data;
    } catch (error) {
        console.log("🚀 ~ error:", url, error);
        throw error;
    }
};

export const postData = async (
    url: string,
    data: any,
    options?: RequestInit
): Promise<any> => {
    try {
        const response = await fetch(getApiUrl() + url, {
            ...options,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                ...options?.headers,
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        console.log("🚀 ~ body:", body);
        if (!response.ok) {
            throw new Error(body.message || "Failed to fetch");
        }
        return body.data;
    } catch (error) {
        console.log("🚀 ~ error:", error?.message);
        throw error;
    }
};

export const putData = async (
    url: string,
    data: any,
    options?: RequestInit
): Promise<any> => {
    try {
        const response = await fetch(getApiUrl() + url, {
            ...options,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                ...options?.headers,
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (!response.ok) {
            throw new Error(body?.message || "Failed to fetch");
        }
        return body.data;
    } catch (error) {
        console.log("🚀 ~ error:", error?.message);
        throw error;
    }
};

export const deleteData = async (
    url: string,
    data: any,
    options?: RequestInit
): Promise<any> => {
    try {
        const response = await fetch(getApiUrl() + url, {
            ...options,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                ...options?.headers,
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (!response.ok) {
            throw new Error(body?.message || "Failed to fetch");
        }
        return body.data;
    } catch (error) {
        console.log("🚀 ~ error:", error?.message);
        throw error;
    }
};
