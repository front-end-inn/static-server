import staticServer from '../server/index';
import path from 'path';
staticServer(path.resolve(path.normalize(path.join(__dirname, './public'))), { port: 80, host: '0.0.0.0' });