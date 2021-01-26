import {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  screen,
  session,
} from 'electron';
import path from 'path';
import {NODE_ENV} from 'src/config/dotenv';
import {ScraperEvent} from 'src/config/scraper-event';
import {BehaviorSubject} from 'rxjs';
import {scrapePage} from 'src/helpers/wattpad';

let mainWindow: BrowserWindow;

app.whenReady().then(async () => {
  ipcMain.on(ScraperEvent.SCRAPE, (event, url: string) => {
    event.reply(ScraperEvent.LOG, `Server received request: ${url}`);
    event.reply(ScraperEvent.LOG, 'Start crawling');

    const pageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    pageSubject.subscribe(async (page: number) => {
      event.reply(ScraperEvent.LOG, `Crawling page ${page}`);
      const {hasNext, html} = await scrapePage(url, page);
      event.reply(ScraperEvent.SCRAPING_NEW_CONTENT, html);
      if (hasNext) {
        pageSubject.next(page + 1);
      } else {
        pageSubject.complete();
        event.reply(ScraperEvent.SCRAPING_FINISHED);
      }
    });
  });

  session.defaultSession.on('will-download', (event, item) => {
    item.on('done', () => {
      new Notification({
        title: 'Downloading finished!',
        body: `File ${item.getFilename()} has been downloaded`,
      }).show();
    });
  });

  if (NODE_ENV === 'development') {
    await session.defaultSession.loadExtension(
      path.resolve('.', 'react-devtools'),
    );
  }

  const {width, height} = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      devTools: NODE_ENV === 'development',
      nodeIntegration: true,
    },
  });
  if (NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:3000/index.html');
  } else {
    await mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }
});
