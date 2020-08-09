import { ServerResponse } from "http";
import path from "path";
import fs, { Stats } from "fs";
import url from "url";
import zlib from 'zlib';
const mime: mime = require('mime');
const etag = require('etag');

function createServe(root: string) {
  return function (req: Request, res: ServerResponse) {
    if (req.method === 'GET') {
      let pathname = url.parse(req.url).pathname;
      let search = url.parse(req.url).search;
      let realPath = path.resolve(path.normalize(path.join(root, pathname!)));
      if (~realPath.indexOf(root)) {
        fs.stat(realPath, (err: Error | null, stats?: Stats) => {
          if (!err) {
            if (stats?.isFile()) {
              let Etag = etag(stats);
              let lastModified = stats.mtime.toUTCString();
              if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                res.setHeader('Etag', Etag);
                res.setHeader('last-modified', lastModified);
                res.setHeader('Vary', 'Accept-Encoding');
                res.statusCode = 304;
                res.end();
              } else {
                res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Etag', Etag);
                res.setHeader('last-modified', lastModified);
                if (req.headers['accept-encoding']) {
                  if (/gzip/g.test(req.headers['accept-encoding'])) {
                    res.setHeader('Content-Encoding', 'gzip');
                    let compress = zlib.createGzip();
                    fs.createReadStream(realPath).pipe(compress).pipe(res);
                  } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                    res.setHeader('Content-Encoding', 'deflate');
                    let compress = zlib.createDeflate();
                    fs.createReadStream(realPath).pipe(compress).pipe(res);
                  } else if (/br/g.test(req.headers['accept-encoding'])) {
                    res.setHeader('Content-Encoding', 'br');
                    let compress = zlib.createBrotliCompress();
                    fs.createReadStream(realPath).pipe(compress).pipe(res);
                  } else {
                    fs.createReadStream(realPath).pipe(res);
                  }
                } else {
                  fs.createReadStream(realPath).pipe(res);
                }
              }
            } else {
              if (/\/$/.test(pathname!)) {
                realPath = path.resolve(path.normalize(path.join(realPath, 'index.html')));
                fs.stat(realPath, (err: Error | null, stats?: Stats) => {
                  if (!err) {
                    let Etag = etag(stats);
                    let lastModified = stats!.mtime.toUTCString();
                    if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                      res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                      res.setHeader('Etag', Etag);
                      res.setHeader('last-modified', lastModified);
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.statusCode = 304;
                      res.end();
                    } else {
                      res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.setHeader('Etag', Etag);
                      res.setHeader('last-modified', lastModified);
                      if (/gzip/g.test(req.headers['accept-encoding'])) {
                        res.setHeader('Content-Encoding', 'gzip');
                        let compress = zlib.createGzip();
                        fs.createReadStream(realPath).pipe(compress).pipe(res);
                      } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                        res.setHeader('Content-Encoding', 'deflate');
                        let compress = zlib.createDeflate();
                        fs.createReadStream(realPath).pipe(compress).pipe(res);
                      } else if (/br/g.test(req.headers['accept-encoding'])) {
                        res.setHeader('Content-Encoding', 'br');
                        let compress = zlib.createBrotliCompress();
                        fs.createReadStream(realPath).pipe(compress).pipe(res);
                      } else {
                        fs.createReadStream(realPath).pipe(res);
                      }
                    }
                  } else {
                    res.statusCode = 404;
                    res.end();
                  }
                })
              } else {
                res.setHeader('Location', `${pathname}/${search ? search : ''}`);
                res.statusCode = 301;
                res.end();
              }
            }
          } else {
            res.statusCode = 404;
            res.end();
          }
        })
      } else {
        res.statusCode = 403;
        res.end();
      }
    } else if (req.method === 'HEAD') {
      let pathname = url.parse(req.url).pathname;
      let search = url.parse(req.url).search;
      let realPath = path.resolve(path.normalize(path.join(root, pathname!)));
      if (~realPath.indexOf(root)) {
        fs.stat(realPath, (err: Error | null, stats?: Stats) => {
          if (!err) {
            if (stats?.isFile()) {
              let Etag = etag(stats);
              let lastModified = stats.mtime.toUTCString();
              if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                res.setHeader('Etag', Etag);
                res.setHeader('last-modified', lastModified);
                res.setHeader('Vary', 'Accept-Encoding');
                res.statusCode = 304;
                res.end();
              } else {
                res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Etag', Etag);
                res.setHeader('last-modified', lastModified);
                if (req.headers['accept-encoding']) {
                  if (/gzip/g.test(req.headers['accept-encoding'])) {
                    res.setHeader('Content-Encoding', 'gzip');
                    res.end();
                  } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                    res.setHeader('Content-Encoding', 'deflate');
                    res.end();
                  } else if (/br/g.test(req.headers['accept-encoding'])) {
                    res.setHeader('Content-Encoding', 'br');
                    res.end();
                  } else {
                    res.end();
                  }
                } else {
                  res.end();
                }
              }
            } else {
              if (/\/$/.test(pathname!)) {
                realPath = path.resolve(path.normalize(path.join(realPath, 'index.html')));
                fs.stat(realPath, (err: Error | null, stats?: Stats) => {
                  if (!err) {
                    let Etag = etag(stats);
                    let lastModified = stats!.mtime.toUTCString();
                    if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                      res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                      res.setHeader('Etag', Etag);
                      res.setHeader('last-modified', lastModified);
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.statusCode = 304;
                      res.end();
                    } else {
                      res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.setHeader('Etag', Etag);
                      res.setHeader('last-modified', lastModified);
                      if (/gzip/g.test(req.headers['accept-encoding'])) {
                        res.setHeader('Content-Encoding', 'gzip');
                        res.end();
                      } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                        res.setHeader('Content-Encoding', 'deflate');
                        res.end();
                      } else if (/br/g.test(req.headers['accept-encoding'])) {
                        res.setHeader('Content-Encoding', 'br');
                        res.end();
                      } else {
                        res.end();
                      }
                    }
                  } else {
                    res.statusCode = 404;
                    res.end();
                  }
                })
              } else {
                res.setHeader('Location', `${pathname}/${search ? search : ''}`);
                res.statusCode = 301;
                res.end();
              }
            }
          } else {
            res.statusCode = 404;
            res.end();
          }
        })
      } else {
        res.statusCode = 403;
        res.end();
      }
    } else {
      res.statusCode = 400;
      res.end();
    }
  }
}

export default createServe;