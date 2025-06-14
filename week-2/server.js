const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Serve HTML UI & handle API requests
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const filePath = path.join(__dirname, 'public', parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);

    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        fs.readFile(filePath, (err, data) => {
            if (err) return res.end('Error loading UI');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'POST' && parsedUrl.pathname === '/create') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { filename, content } = JSON.parse(body);
            fs.writeFile(filename, content, err => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: !err, message: err ? err.message : 'File created!' }));
            });
        });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/read') {
        const { filename } = parsedUrl.query;
        fs.readFile(filename, 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: !err, content: err ? err.message : data }));
        });
    } else if (req.method === 'DELETE' && parsedUrl.pathname === '/delete') {
        const { filename } = parsedUrl.query;
        fs.unlink(filename, err => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: !err, message: err ? err.message : 'File deleted!' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
