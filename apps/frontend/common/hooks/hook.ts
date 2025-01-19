import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// import toastify from '../../utils/toast.ts';

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
  errorMessage: string,
];

let token = localStorage.getItem('token')
  ? `Bearer ${localStorage.getItem('token')}`
  : '';
// ...............................      useFetch      .............................................
export const useFetchData = (
  url: string,
  query: QueryParams = {},
  load = true,
): UseFetchResponse => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(load);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then(async (res) => {
        let data = await res.json();
        setError(res.ok ? false : true);
        setData(data?.data || null);
        setErrorMessage(data?.message || '');
        setLoading(false);
        if (!res.ok) toast.error(data?.message || '', { type: 'error' });
      })
      .catch((err) => {
        toast.error(err.message, { type: 'error' });
        setError(true);
        setErrorMessage('Internal Server Error,Contact Support');
        setLoading(false);
      });
  };
  return [data, getData, setData, loading, error, errorMessage];
};

export async function postData(url: string, payload = {}) {
  //url check
  if (!url) return;
  //data must be an object
  if (typeof payload !== 'object') return;

  try {
    const res = await fetch(API_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    let data = (await res.json()) || {};
    if (res.ok) {
      toast.success(data.message, { type: 'success' });
      return {
        data: data.data || {},
        message: data.message || '',
        error: false,
      };
    } else {
      toast.error(data.message, { type: 'error' });

      return {
        data: {},
        message: data.message || '',
        error: true,
      };
    }
  } catch (err: any) {
    toast.error(err.message, { type: 'error' });

    return {
      data: {},
      message: err.message || '',
      error: true,
    };
  }
}

export async function putData(url: string, payload = {}) {
  //url check
  if (!url) return;
  //data must be an object
  if (typeof payload !== 'object') return;

  try {
    const res = await fetch(API_URL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    let data = (await res.json()) || {};
    if (res.ok) {
      toast.success(data.message, { type: 'success' });
      return {
        data: data.data || {},
        message: data.message || '',
        error: false,
      };
    } else {
      toast.error(data.message, { type: 'error' });
      return {
        data: {},
        message: data.message || '',
        error: true,
      };
    }
  } catch (err: any) {
    toast.error(err.message, { type: 'error' });
    return {
      data: {},
      message: err.message || '',
      error: true,
    };
  }
}

export async function deleteData(url: string, payload = {}) {
  //url check
  if (!url) return;

  try {
    const res = await fetch(API_URL + url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    let data = (await res.json()) || {};
    if (res.ok) {
      toast.success(data.message, { type: 'success' });
      return {
        data: data.data || {},
        message: data.message || '',
        error: false,
      };
    } else {
      toast.error(data.message, { type: 'error' });
      return {
        data: {},
        message: data.message || '',
        error: true,
      };
    }
  } catch (err: any) {
    toast.error(err.message, { type: 'error' });
    return {
      data: {},
      message: err.message || '',
      error: true,
    };
  }
}
//.............................................................................................................
export const useLState = (key: string, initialValue: any) => {
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
