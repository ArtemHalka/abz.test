import { useCallback, useState } from 'react';

export const useFetch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setError(null);
            setLoading(true);
            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                });
                const data = await response.json();
                if (!data.success) {
                    setError({ message: data.message, fails: data.fails });
                    return;
                }
                return data;
            } catch (e) {
                throw e;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { loading, request, error };
};
