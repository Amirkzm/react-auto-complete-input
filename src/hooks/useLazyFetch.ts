import { useCallback, useEffect, useState } from "react";

interface useFetchResult {
  result: any;
  isLoading: boolean;
  isError: boolean;
  fetchData: (url: string) => any;
}

const useLazyFetch = (initUrl?: string): useFetchResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const fetchData = useCallback(async (url: string): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setIsError(true);
        throw new Error();
      }
      const jsonResponse = await response.json();
      setResult(jsonResponse);
      setIsLoading(false);
      return jsonResponse;
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initUrl) {
      fetchData(initUrl);
    }
  }, [fetchData, initUrl]);

  return { result, isLoading, isError, fetchData };
};

export default useLazyFetch;
