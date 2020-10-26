import { Page } from '../helper/logger';

export interface ILog {
    time: number;
    info: string;
    browser: string;
    screen: string;
    page: Page;
    error: boolean;
}
