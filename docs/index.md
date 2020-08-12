---
layout: default
---
# node simple static server
# usage
```js
import staticServer from 'path/to/index';
staticServer(<root>,<config>?);
```
## `root`
### the public file root path
## `config`
### you can config the hostname and port such as this
```json
{
  "host": "localhost",
  "port": 3000
}
```
### benchmark results is in the `benchmark` folder
```
This is ApacheBench, Version 2.3 <$Revision: 1430300 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)


Server Software:
Server Hostname:        localhost
Server Port:            2333

Document Path:          /index.html
Document Length:        228 bytes

Concurrency Level:      10000
Time taken for tests:   27.310 seconds
Complete requests:      100000
Failed requests:        0
Write errors:           0
Total transferred:      46000000 bytes
HTML transferred:       22800000 bytes
Requests per second:    3661.71 [#/sec] (mean)
Time per request:       2730.961 [ms] (mean)
Time per request:       0.273 [ms] (mean, across all concurrent requests)
Transfer rate:          1644.91 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0  957 2202.3      4   15061
Processing:    62  213 175.5    178    6590
Waiting:        8  167 169.4    133    6550
Total:         76 1170 2234.6    225   16126

Percentage of the requests served within a certain time (ms)
  50%    225
  66%   1143
  75%   1200
  80%   1240
  90%   3187
  95%   4209
  98%   7277
  99%  15288
 100%  16126 (longest request)
```
