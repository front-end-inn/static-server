# static-server
![typescript build](https://github.com/front-end-inn/static-server/workflows/typescript%20build/badge.svg)
> node http static server, support modified、etag、HEAD requests
# usage
- yarn
```shell
yarn install
```
- npm
```shell
npm install
```
# test
### first `npm run build` or `yarn build` then copy the `public` folder in `src/test` to `dist/src/test`,and `yarn test` or `npm run test`,now you can visit [http://localhost/](http://localhost/),and you can see the hello world on the screen
# todo
- support http range
- cross domain
- mapping path