/*
    This hook is used to store data in local storage and retrieve it when the page is reloaded.
    It takes two arguments, the key and the initial value of the data to be stored.
    It returns an array containing the data and a function to store the data.
*/
import { useState } from "react";
const useLState = (key: string, initialValue: any) => {
    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : initialValue;
    });

    const storeData = (newData: any) => {
        localStorage.setItem(key, JSON.stringify(newData));
        setData(newData);
    };

    return [data, storeData];
};

export default useLState;
