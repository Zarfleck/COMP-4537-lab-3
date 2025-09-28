const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const utils = require('./comp4537/labs/3/modules/utils.js');
const lang = require('./comp4537/labs/3/lang/en/en.js');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/COMP4537/labs/3/writeFile/') {
        const text = query.text;
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>Error: No text parameter provided</h1>');
            return;
        }

        fs.appendFile('comp4537/labs/3/file.txt', text + '\n', (err) => {
            if (err) {
                console.log('Error writing to file:', err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>Error writing to file: ' + err.message + '</h1>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>File Write Success</title></head>
                <body>
                    <h1 style="color: green;">Success!</h1>
                    <p>Text "${text}" has been appended to file.txt</p>
                </body>
                </html>
            `);
        });
        return;
    }

    if (pathname.startsWith('/COMP4537/labs/3/readFile/')) {
        const fileName = pathname.replace('/COMP4537/labs/3/readFile/', '');
        
        fs.readFile('comp4537/labs/3/' + fileName, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>File Not Found</title></head>
                    <body>
                        <h1 style="color: red;">404 Error</h1>
                        <p>File "${fileName}" does not exist</p>
                    </body>
                    </html>
                `);
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>File Content</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .content { background-color: #f5f5f5; padding: 15px; border: 1px solid #ccc; white-space: pre-wrap; }
                    </style>
                </head>
                <body>
                    <h1>Content of ${fileName}:</h1>
                    <div class="content">${data}</div>
                </body>
                </html>
            `);
        });
        return;
    }

    const name = query.name;
    const currentTime = utils.getDate();
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Greeting Service</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f8ff;
                margin: 50px;
            }
            .message {
                color: blue;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                padding: 20px;
                border: 2px solid blue;
                border-radius: 10px;
                background-color: #e6f3ff;
            }
        </style>
    </head>
    <body>
        <div class="message">
            ${name ? lang.greeting.replace('%1', name) + ' ' + currentTime : 'Hello! Please provide your name in the URL.'}
        </div>
    </body>
    </html>
    `;
    
    res.end(html);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
