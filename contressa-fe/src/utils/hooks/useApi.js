'use client';
import { useState, useCallback } from 'react';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Ensures cookies are sent with requests
});

const useApi = (
  initialUrl = '',
  initialMethod = 'GET',
  initialBody = null,
  initialHeaders = { 'Content-Type': 'application/json' } // Default headers
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const execute = useCallback(
    async (
      url = initialUrl,
      method = initialMethod,
      body = initialBody,
      customHeaders = initialHeaders // Allows overriding headers
    ) => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          ...customHeaders,
        };
        const config = {
          url,
          method,
          headers,
        };

        if (body) {
          config.data = body;
        }

        const response = await api(config);

        setData(response); // Assuming response contains data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [initialUrl, initialMethod, initialBody]
  );

  return { data, error, loading, execute };
};

export default useApi;
