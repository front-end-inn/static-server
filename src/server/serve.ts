import { ServerResponse } from "http";
import mime from "mime";
import path from "path";
import fs, { Stats } from "fs";
import url from "url";
import zlib from "zlib";
import rangeParser from "range-parser";
import etag from "etag";

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
              // check if client cache
              if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Vary', 'Accept-Encoding');
                res.statusCode = 304;
                res.end();
              } else {
                // no cache
                res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Etag', Etag);
                res.setHeader('last-modified', lastModified);
                res.setHeader('Accept-Ranges', 'bytes');
                if (/gzip/g.test(req.headers['accept-encoding'])) {
                  // accept-encoding:gzip (default)
                  res.setHeader('Content-Encoding', 'gzip');
                  let compress = zlib.createGzip();
                  // check range
                  if (req.headers['range']) {
                    let range = rangeParser(stats.size, req.headers['range'], { combine: true });
                    if (range < 0) {
                      res.setHeader('Content-Range', `bytes */${stats.size}`);
                      res.statusCode = 416;
                      res.end();
                    } else {
                      if (req.headers['if-range']) {
                        // check client cache
                        if (req.headers['if-range'] === Etag || req.headers['if-range'] === lastModified) {
                          // cache hit
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                          res.statusCode = 206;
                          res.end();
                        } else {
                          // file update
                          res.statusCode = 200;
                          fs.createReadStream(realPath).pipe(compress).pipe(res);
                        }
                      } else {
                        // no cache
                        res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                        res.statusCode = 206;
                        fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(compress).pipe(res);
                      }
                    }
                  } else {
                    // no range
                    fs.createReadStream(realPath).pipe(compress).pipe(res);
                  }
                } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                  // accept-encoding:deflate
                  res.setHeader('Content-Encoding', 'deflate');
                  let compress = zlib.createDeflate();
                  // check range
                  if (req.headers['range']) {
                    let range = rangeParser(stats.size, req.headers['range'], { combine: true });
                    if (range < 0) {
                      // range fail
                      res.setHeader('Content-Range', `bytes */${stats.size}`);
                      res.statusCode = 416;
                      res.end();
                    } else {
                      if (req.headers['if-range']) {
                        // check client range
                        if (req.headers['if-range'] === Etag || req.headers['if-range'] === lastModified) {
                          // cache hit
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                          res.statusCode = 206;
                          res.end();
                        } else {
                          // file update
                          res.statusCode = 200;
                          fs.createReadStream(realPath).pipe(compress).pipe(res);
                        }
                      } else {
                        // no cache
                        res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                        res.statusCode = 206;
                        fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(compress).pipe(res);
                      }
                    }
                  } else {
                    // no range
                    fs.createReadStream(realPath).pipe(compress).pipe(res);
                  }
                } else if (/br/g.test(req.headers['accept-encoding'])) {
                  // accept-encoding:br
                  res.setHeader('Content-Encoding', 'br');
                  let compress = zlib.createBrotliCompress();
                  // check range
                  if (req.headers['range']) {
                    let range = rangeParser(stats.size, req.headers['range'], { combine: true });
                    if (range < 0) {
                      // range fail
                      res.setHeader('Content-Range', `bytes */${stats.size}`);
                      res.statusCode = 416;
                      res.end();
                    } else {
                      if (req.headers['if-range']) {
                        // check client cache
                        if (req.headers['if-range'] === Etag || req.headers['if-range'] === lastModified) {
                          // cache hit
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                          res.statusCode = 206;
                          res.end();
                        } else {
                          // file update
                          res.statusCode = 200;
                          fs.createReadStream(realPath).pipe(compress).pipe(res);
                        }
                      } else {
                        // no cache
                        res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                        res.statusCode = 206;
                        fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(compress).pipe(res);
                      }
                    }
                  } else {
                    // no range
                    fs.createReadStream(realPath).pipe(compress).pipe(res);
                  }
                } else {
                  // no support accept-encoding
                  // check range
                  if (req.headers['range']) {
                    let range = rangeParser(stats.size, req.headers['range'], { combine: true });
                    if (range < 0) {
                      // range fail
                      res.setHeader('Content-Range', `bytes */${stats.size}`);
                      res.statusCode = 416;
                      res.end();
                    } else {
                      if (req.headers['if-range']) {
                        // check client cache
                        if (req.headers['if-range'] === Etag || req.headers['if-range'] === lastModified) {
                          // cache hit
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                          res.statusCode = 206;
                          res.end();
                        }else{
                          // file update
                          res.statusCode = 200;
                          fs.createReadStream(realPath).pipe(res);
                        }
                      } else {
                        // no cache
                        res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats.size}`)
                        res.statusCode = 206;
                        fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(res);
                      }
                    }
                  } else {
                    // no range
                    fs.createReadStream(realPath).pipe(res);
                  }
                }
              }
            } else {
              if (/\/$/.test(pathname!)) {
                // try index.html
                realPath = path.resolve(path.normalize(path.join(realPath, 'index.html')));
                fs.stat(realPath, (err: Error | null, stats?: Stats) => {
                  if (!err) {
                    let Etag = etag(stats!);
                    let lastModified = stats!.mtime.toUTCString();
                    // check if client cache
                    if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                      res.setHeader('Accept-Ranges', 'bytes');
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.statusCode = 304;
                      res.end();
                    } else {
                      // no cache
                      res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.setHeader('Etag', Etag);
                      res.setHeader('last-modified', lastModified);
                      res.setHeader('Accept-Ranges', 'bytes');
                      if (/gzip/g.test(req.headers['accept-encoding'])) {
                        // accept-encoding:gzip (default)
                        res.setHeader('Content-Encoding', 'gzip');
                        let compress = zlib.createGzip();
                        // check range
                        if (req.headers['range']) {
                          let range = rangeParser(stats!.size, req.headers['range'], { combine: true });
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats!.size}`)
                          res.statusCode = 206;
                          fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(compress).pipe(res);
                        } else {
                          // no range
                          fs.createReadStream(realPath).pipe(compress).pipe(res);
                        }
                      } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                        // accept-encoding:deflate
                        res.setHeader('Content-Encoding', 'deflate');
                        let compress = zlib.createDeflate();
                        // check range
                        if (req.headers['range']) {
                          let range = rangeParser(stats!.size, req.headers['range'], { combine: true });
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats!.size}`)
                          res.statusCode = 206;
                          fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(compress).pipe(res);
                        } else {
                          // no range
                          fs.createReadStream(realPath).pipe(compress).pipe(res);
                        }
                      } else if (/br/g.test(req.headers['accept-encoding'])) {
                        // accept-encoding:br
                        res.setHeader('Content-Encoding', 'br');
                        let compress = zlib.createBrotliCompress();
                        // check range
                        if (req.headers['range']) {
                          let range = rangeParser(stats!.size, req.headers['range'], { combine: true });
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats!.size}`)
                          res.statusCode = 206;
                          fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(compress).pipe(res);
                        } else {
                          // no range
                          fs.createReadStream(realPath).pipe(compress).pipe(res);
                        }
                      } else {
                        // not support accept-encoding 
                        // check range
                        if (req.headers['range']) {
                          let range = rangeParser(stats!.size, req.headers['range'], { combine: true });
                          res.setHeader('Content-Range', `bytes ${range[0].start}-${range[0].end}/${stats!.size}`)
                          res.statusCode = 206;
                          fs.createReadStream(realPath, { start: range[0].start, end: range[0].end }).pipe(res);
                        } else {
                          // no range
                          fs.createReadStream(realPath).pipe(res);
                        }
                      }
                    }
                  } else {
                    // index.html file not found
                    res.statusCode = 404;
                    res.end();
                  }
                })
              } else {
                // redirect to folder
                res.setHeader('Location', `${pathname}/${search ? search : ''}`);
                res.statusCode = 301;
                res.end();
              }
            }
          } else {
            // file not found
            res.statusCode = 404;
            res.end();
          }
        })
      } else {
        // request file not in the root
        res.statusCode = 403;
        res.end();
      }
    } else if (req.method === 'HEAD') {
      // request method HEAD
      let pathname = url.parse(req.url).pathname;
      let search = url.parse(req.url).search;
      let realPath = path.resolve(path.normalize(path.join(root, pathname!)));
      if (~realPath.indexOf(root)) {
        fs.stat(realPath, (err: Error | null, stats?: Stats) => {
          if (!err) {
            if (stats?.isFile()) {
              let Etag = etag(stats);
              let lastModified = stats.mtime.toUTCString();
              // check if client cache
              if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Vary', 'Accept-Encoding');
                res.statusCode = 304;
                res.end();
              } else {
                // no cache
                res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Etag', Etag);
                res.setHeader('last-modified', lastModified);
                res.setHeader('Accept-Ranges', 'bytes');
                if (/gzip/g.test(req.headers['accept-encoding'])) {
                  // accept-encoding:gzip (default)
                  res.setHeader('Content-Encoding', 'gzip');
                  res.end();
                } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                  // accept-encoding:deflate
                  res.setHeader('Content-Encoding', 'deflate');
                  res.end();
                } else if (/br/g.test(req.headers['accept-encoding'])) {
                  // accept-encoding:br
                  res.setHeader('Content-Encoding', 'br');
                  res.end();
                } else {
                  // not support accept-encoding
                  res.end();
                }
              }
            } else {
              if (/\/$/.test(pathname!)) {
                // try index.html
                realPath = path.resolve(path.normalize(path.join(realPath, 'index.html')));
                fs.stat(realPath, (err: Error | null, stats?: Stats) => {
                  if (!err) {
                    let Etag = etag(stats!);
                    let lastModified = stats!.mtime.toUTCString();
                    // check if client cache
                    if (req.headers['if-modified-since'] === lastModified && req.headers['if-none-match'] === Etag) {
                      res.setHeader('Accept-Ranges', 'bytes');
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.statusCode = 304;
                      res.end();
                    } else {
                      // no cache
                      res.setHeader('Content-Type', `${mime.getType(realPath)}; charset=utf-8`);
                      res.setHeader('Vary', 'Accept-Encoding');
                      res.setHeader('Etag', Etag);
                      res.setHeader('last-modified', lastModified);
                      res.setHeader('Accept-Ranges', 'bytes');
                      if (/gzip/g.test(req.headers['accept-encoding'])) {
                        // accept-encoding:gzip (default)
                        res.setHeader('Content-Encoding', 'gzip');
                        res.end();
                      } else if (/deflate/g.test(req.headers['accept-encoding'])) {
                        // accept-encoding:deflate
                        res.setHeader('Content-Encoding', 'deflate');
                        res.end();
                      } else if (/br/g.test(req.headers['accept-encoding'])) {
                        // accept-encoding:br
                        res.setHeader('Content-Encoding', 'br');
                        res.end();
                      } else {
                        // client not support accept-encoding
                        res.end();
                      }
                    }
                  } else {
                    // index.html file not found
                    res.statusCode = 404;
                    res.end();
                  }
                })
              } else {
                // redirect to folder
                res.setHeader('Location', `${pathname}/${search ? search : ''}`);
                res.statusCode = 301;
                res.end();
              }
            }
          } else {
            // file not found
            res.statusCode = 404;
            res.end();
          }
        })
      } else {
        // request file not in the root
        res.statusCode = 403;
        res.end();
      }
    } else {
      // method not support
      res.statusCode = 400;
      res.end();
    }
  }
}

export default createServe;