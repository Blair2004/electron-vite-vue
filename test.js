import { exec } from "child_process";
import os from "os";
import iconv from "iconv-lite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import printer from "@thiagoelg/node-printer";

function listPrinters() {
    return new Promise( ( resolve, reject ) => {
        const platform = os.platform();

        let command = '';
        if (platform === 'win32') {
            command = 'wmic printer get name';
        } else if (platform === 'darwin' || platform === 'linux') {
            command = 'lpstat -p -d';
        } else {
            return reject( 'Unsupported OS' );
        }

        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject( `Error executing command: ${stderr}` );
            }
            let printers = [];

            if (platform === 'win32') {
                printers = stdout.split('\n').slice(1).filter(line => line.trim() !== '').map(line => line.trim());
            } else {
                printers = stdout.split('\n').filter(line => line.startsWith('printer')).map(line => line.split(' ')[1]);
            }

            resolve( printers );
        });
    });
}

function printFileWindows(filePath, printerName) {
    const command = `print /d:"${printerName}" ${filePath}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing command: ${stderr}`);
        return;
        }
        console.log(`Print job sent to ${printerName}:`, stdout);
    });
}

function printTestPage(printerName) {
    // Example text to print
    const text = "Hello, World!\n";
  
    // Convert the text to the encoding your printer uses, typically CP437 for U.S. English
    const encodedText = iconv.encode(text, 'CP437');
  
    // Create a temporary file to hold the encoded text
    const tempFilePath = 'C:\\Users\\blair2004\\Desktop\\test.txt';
    fs.writeFileSync(tempFilePath, encodedText);
  
    // Command to send the text file to the printer
    const command = `print /d:"${printerName}" ${tempFilePath}`;
  
    // Execute the command
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing command: ${stderr}`);
        return;
      }
      console.log(`Print job sent to ${printerName}:`, stdout);
    });
}

function printDocument(printerName, filePath) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(__dirname, 'print.ps1');

    const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -printerName "${printerName}" -filePath "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`PowerShell Error: ${stderr}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
}

const printers  =   await listPrinters();
console.log(printers);
// printFileWindows('C:\\Users\\blair2004\\Desktop\\test.txt', printers[5]);

// printTestPage(printers[5]);
// printDocument(printers[5], 'C:\\Users\\blair2004\\Desktop\\test.txt');

console.log( printer.getPrinters() );