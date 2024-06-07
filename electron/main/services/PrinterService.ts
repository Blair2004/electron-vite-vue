import Printer from "@thiagoelg/node-printer";

export class PrinterService {
    static getPrinters() {
        return new Promise((resolve, reject) => {
            return Printer.getPrinters();
        });
    }
}