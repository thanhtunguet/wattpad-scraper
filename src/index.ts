import express, {Application, Request, Response} from 'express';
import {createServer, Server} from 'http';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Socket} from 'socket.io';
import {PORT} from 'src/config/dotenv';
import {scrapePage} from 'src/helpers/wattpad';
import {SocketEvent} from 'src/socket-event';

const io = require('socket.io');

const app: Application = express();
const server: Server = createServer(app);

const socket: Socket = io(server, {
  transports: ['websocket', 'polling'],
});

socket.on(SocketEvent.CONNECTION, (client: Socket) => {
  client.emit(SocketEvent.LOG, 'Socket connection established');

  client.on(SocketEvent.SCRAPE, async (url: string) => {
    client.emit(SocketEvent.LOG, `Server received request: ${url}`);
    client.emit(SocketEvent.LOG, 'Start crawling');

    const pageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    const subscription: Subscription = pageSubject.subscribe(
      async (page: number) => {
        client.emit(SocketEvent.LOG, `Crawling page ${page}`);
        const {hasNext, html} = await scrapePage(url, page);
        client.emit(SocketEvent.SCRAPING_NEW_CONTENT, html);
        if (hasNext) {
          pageSubject.next(page + 1);
        } else {
          pageSubject.complete();
          client.emit(SocketEvent.SCRAPING_FINISHED);
        }
      },
    );

    client.on(SocketEvent.DISCONNECT, () => {
      subscription.unsubscribe();
    });
  });
});

app.use((req: Request, res: Response) => {
  res.status(200).header('Content-Type', 'text/plain').send('OK');
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Web server is up and running');
});
