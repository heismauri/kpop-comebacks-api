import { Page } from "@api/types/reddit";

const getPage = async (url: string): Promise<Page> => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
  }
  const body: Page = await response.json();
  return body;
};

export { getPage };
