import { useEffect, useState } from "react";

import { toast } from "react-toastify";

const API_URL = import.meta.env.PUBLIC_SITE;

type QueryParams = {
    [key: string]: any;
};

type UseFetchResponse = [
    data: any | undefined,
    getData: (query?: QueryParams) => void,
    setData: (data: any) => void,
    loading: boolean,
    error: boolean,
    errorMessage: string
];

let token = localStorage.getItem("token")
    ? `${localStorage.getItem("token")}`
    : "";
// ...............................      useFetch      .............................................
export const useFetchData = (
    url: string,
    query: QueryParams = {},
    load = true,
    initialData = []
): UseFetchResponse => {
    const [data, setData] = useState<any>(initialData);
    const [loading, setLoading] = useState<boolean>(load);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [params, setParams] = useState<QueryParams>({
        ...query,
        page: query?.page || 1,
        limit: query?.limit || 10,
    });

    useEffect(() => {
        if (load) {
            getData(params);
        }
    }, []);

    const getData = (query: QueryParams = {}) => {
        setLoading(true);
        setError(false);
        setParams({ ...params, ...query });

        let final_query = { ...params, ...query };

        let final_url = new URL(API_URL + url);
        Object.keys(final_query).forEach((key) => {
            final_url.searchParams.append(key, final_query[key]);
        });

        fetch(final_url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
            .then(async (res) => {
                let data = await res.json();
                setError(res.ok ? false : true);
                setData(data?.data || initialData);
                setErrorMessage(data?.message || "");
                setLoading(false);
                if (!res.ok) {
                    toast.error(data.message);
                }
            })
            .catch((err) => {
                toast.error("Internal Server Error,Contact Support");
                setError(true);
                setErrorMessage("Internal Server Error,Contact Support");
                setLoading(false);
            });
    };
    return [data, getData, setData, loading, error, errorMessage];
};

export async function postData(url: string, payload = {}) {
    //url check
    if (!url) return;
    //data must be an object
    if (typeof payload !== "object") return;

    try {
        const res = await fetch(API_URL + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });
        let data = (await res.json()) || {};
        if (res.ok) {
            toast.success(data.message);
            return {
                data: data.data || {},
                message: data.message || "",
                error: false,
            };
        } else {
            toast.error(data.message);

            return {
                data: {},
                message: data.message || "",
                error: true,
            };
        }
    } catch (err: any) {
        toast.error("Internal Server Error,Contact Support");

        return {
            data: {},
            message: err.message || "",
            error: true,
        };
    }
}

export async function putData(url: string, payload = {}) {
    //url check
    if (!url) return;
    //data must be an object
    if (typeof payload !== "object") return;

    try {
        const res = await fetch(API_URL + url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });
        let data = (await res.json()) || {};
        if (res.ok) {
            toast.success(data.message);
            return {
                data: data.data || {},
                message: data.message || "",
                error: false,
            };
        } else {
            toast.error(data.message);
            return {
                data: {},
                message: data.message || "",
                error: true,
            };
        }
    } catch (err: any) {
        toast.error("Internal Server Error,Contact Support");
        return {
            data: {},
            message: err.message || "",
            error: true,
        };
    }
}

export async function deleteData(url: string, payload = {}) {
    //url check
    if (!url) return;

    try {
        const res = await fetch(API_URL + url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });
        let data = (await res.json()) || {};
        if (res.ok) {
            toast.success(data.message);
            return {
                data: data.data || {},
                message: data.message || "",
                error: false,
            };
        } else {
            toast.error(data.message);
            return {
                data: {},
                message: data.message || "",
                error: true,
            };
        }
    } catch (err: any) {
        toast.error("Internal Server Error,Contact Support");
        return {
            data: {},
            message: err.message || "",
            error: true,
        };
    }
}
