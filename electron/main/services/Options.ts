import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export class Options {
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
        this.loadOptions();
    }

    saveFromObject( options: Record<string, unknown> ) {
        for( let key in options ) {
            this.options[ key ] = options[ key ];
        }
        this.saveOptions();
    }

    getAll() {
        this.loadOptions();
        
        return this.options;
    }

    set( key: string, value: any ) {
        this.options[ key ] = value;
        this.saveOptions();
    }

    deleteKeys( keys: string[] ) {
        for( let key of keys ) {
            delete this.options[ key ];
        }
        this.saveOptions();
    }

    deleleteAllExcept( keys: string[] ) {
        for( let key in this.options ) {
            if ( ! keys.includes( key ) ) {
                delete this.options[ key ];
            }
        }
        this.saveOptions();
    }

    deleteAll() {
        this.options = {};
        this.saveOptions();
    }

    delete( key: string ) {
        delete this.options[ key ];
        this.saveOptions();
    }

    get( key: string ) {
        this.loadOptions();
        return this.options[ key ];
    }

    private saveOptions() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.options, null, 2));
    }

    private loadOptions() {
        if (fs.existsSync(this.filePath)) {
            const optionsData = fs.readFileSync(this.filePath, 'utf-8');
            this.options = JSON.parse(optionsData);
        }
    }
}