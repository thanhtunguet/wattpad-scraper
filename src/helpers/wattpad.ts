import axios from 'axios';
import cheerio from 'cheerio';

export interface PageContent {
  html: string;

  hasNext?: boolean;
}

export async function scrapePage(
  url: string,
  index: number,
): Promise<PageContent> {
  const {data} = await axios.get(`${url}/page/${index}`);
  const $ = cheerio.load(data);
  const html: string = $('div.panel.panel-reading').html();
  const nextLink = $('link[rel="next"]');
  let hasNext: boolean = false;
  if (nextLink?.attr('href')) {
    hasNext = true;
  }
  return {
    html,
    hasNext,
  };
}
