import { Page } from '../helper/logger';
import { IBase } from './IBase';

export interface ILog extends IBase {
    time: number;
    info: string;
    browser: string;
    screen: string;
    page: Page;
    error: boolean;
}
