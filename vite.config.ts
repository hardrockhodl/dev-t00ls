// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'file-sharing-middleware',
      configureServer(server) {
        const shareDir = path.join(__dirname, 'public', '.share');
        
        if (!fs.existsSync(shareDir)) {
          fs.mkdirSync(shareDir, { recursive: true });
        }

        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/.share/')) {
            return next();
          }

          if (req.url === '/.share/upload' && req.method === 'POST') {
            const chunks: Uint8Array[] | Buffer[] = [];
            req.on('data', chunk => chunks.push(Buffer.from(chunk)));
            req.on('end', () => {
              try {
                const buffer = Buffer.concat(chunks);
                const boundary = req.headers['content-type']?.split('boundary=')[1];
                if (!boundary) throw new Error('No boundary found');

                const boundaryBuffer = Buffer.from(`--${boundary}`);
                const endBoundaryBuffer = Buffer.from(`--${boundary}--`);
                
                let startPos = 0;
                const endPos = buffer.length;
                let fileContent = null;
                let id = '';
                let metadata = null;

                while (startPos < endPos) {
                  const boundaryPos = buffer.indexOf(boundaryBuffer, startPos);
                  if (boundaryPos === -1) break;

                  const headerEnd = buffer.indexOf('\r\n\r\n', boundaryPos);
                  if (headerEnd === -1) break;

                  const header = buffer.slice(boundaryPos, headerEnd).toString();
                  startPos = headerEnd + 4;

                  const nextBoundary = buffer.indexOf(boundaryBuffer, startPos);
                  const contentEnd = nextBoundary !== -1 ? nextBoundary - 2 : buffer.indexOf(endBoundaryBuffer) - 2;

                  if (header.includes('name="file"')) {
                    fileContent = buffer.slice(startPos, contentEnd);
                  } else if (header.includes('name="id"')) {
                    id = buffer.slice(startPos, contentEnd).toString().trim();
                  } else if (header.includes('name="metadata"')) {
                    metadata = JSON.parse(buffer.slice(startPos, contentEnd).toString().trim());
                  }

                  startPos = contentEnd + 2;
                }

                if (!fileContent || !id || !metadata) {
                  throw new Error('Missing required data');
                }

                const filePath = path.join(shareDir, id);
                fs.writeFileSync(filePath, fileContent);
                fs.writeFileSync(`${filePath}.meta`, JSON.stringify(metadata));

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ id }));
              } catch (error) {
                console.error('Upload error:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Upload failed' }));
              }
            });
            return;
          }

          if (req.url.startsWith('/.share/files/')) {
            const id = req.url.split('/').pop();
            if (!id) {
              res.statusCode = 404;
              return res.end('File not found');
            }

            const filePath = path.join(shareDir, id);
            const metaPath = `${filePath}.meta`;

            if (!fs.existsSync(filePath) || !fs.existsSync(metaPath)) {
              res.statusCode = 404;
              return res.end('File not found');
            }

            try {
              const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
              const fileStream = fs.createReadStream(filePath);

              res.setHeader('Content-Type', metadata.type || 'application/octet-stream');
              res.setHeader('Content-Disposition', `attachment; filename="${metadata.originalName}"`);
              
              fileStream.pipe(res);
              
              fileStream.on('end', () => {
                try {
                  fs.unlinkSync(filePath);
                  fs.unlinkSync(metaPath);
                } catch (error) {
                  console.error('Error cleaning up files:', error);
                }
              });

              fileStream.on('error', (error) => {
                console.error('Error streaming file:', error);
                if (!res.headersSent) {
                  res.statusCode = 500;
                  res.end('Error serving file');
                }
              });
            } catch (error) {
              console.error('Error serving file:', error);
              res.statusCode = 500;
              res.end('Error serving file');
            }
            return;
          }

          next();
        });
      }
    }
  ],
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['fs', 'path', 'url'], // Exclude non-browser-compatible modules
    esbuildOptions: {
      target: 'esnext'
    }
  }
});
