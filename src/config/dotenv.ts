import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = Number(process.env.PORT);

export const WEB_PROXY_URL: string = process.env.WEB_PROXY_URL;
