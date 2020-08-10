# static-server
![typescript build](https://github.com/front-end-inn/static-server/workflows/typescript%20build/badge.svg)
> node http static server
# usage
- yarn
```shell
yarn install
```
- npm
```shell
npm install
```
# features
- http range
- head request
- Etag+last modified
# test
### first `npm run build` or `yarn build` then copy the `public` folder in `src/test` to `dist/src/test`,and `yarn test` or `npm run test`,now you can visit [http://localhost/](http://localhost/),and you can see the hello world on the screen
# TODO
- ~~support http range~~ done!
- mapping path