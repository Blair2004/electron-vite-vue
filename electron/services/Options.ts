import { app } from 'electron';
import fs from 'fs';
import path from 'path';

class Options {
    private options: Record<string, unknown>;
    private filePath: string;

    constructor(options: Record<string, unknown> = {}) {
        this.options = options;
        // Define the directory path
        const dirPath = path.join(app.getPath('appData'), 'nexo-print-server');
        // Create the directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        // Set the file path
        this.filePath = path.join(dirPath, 'options.json');
    }

    set( key: string, value: any ) {
        this.options[ key ] = value;
        this.saveOptions();
    }

    delete( key: string ) {
        delete this.options[ key ];
        this.saveOptions();
    }

    get( key: string ) {
        return this.options[ key ];
    }

    saveOptions() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.options, null, 2));
    }

    loadOptions() {
        if (fs.existsSync(this.filePath)) {
            const optionsData = fs.readFileSync(this.filePath, 'utf-8');
            this.options = JSON.parse(optionsData);
        }
    }
}