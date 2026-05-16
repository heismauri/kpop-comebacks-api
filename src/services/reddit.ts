import { Page } from '../types/reddit';

const getPage = async (url: string): Promise<Page> => {
  console.log('Fetching page from URL:', url);
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    }
  });
  const body: Page = await response.json();
  console.log('Fetched page:', body);
  return body;
};

export { getPage };
