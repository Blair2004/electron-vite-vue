import printer from '@thiagoelg/node-printer';

export class PrinterService {
    static getPrinters() {
        return new Promise((resolve, reject) => {
            resolve( printer.getPrinters());
        });
    }
}