import http from 'http';
import createServe from './serve';

function staticServer(root:string,serverOptions?:StaticServerOptions){
  let sv = http.createServer()
  let serve = createServe(root);
  sv.on('request',serve);
  sv.listen(serverOptions?.port || 3000,serverOptions?.host || 'localhost',()=>{
    console.log(`server start: port: ${serverOptions?.port || 3000} hostname: ${serverOptions?.host || 'localhost'}`);
  });
}

export default staticServer