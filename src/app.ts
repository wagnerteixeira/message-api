import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as swagger from 'swagger-ui-express';
import { AwilixContainer, createContainer, asClass, InjectionMode, asFunction, asValue } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-express';
import expressErrorHandling from './shared/middlewares/expressErrorHandler';
import validateOrRejectBody from './shared/validators/validateOrRejectBody';
import logger from './shared/lib/logger';

class App {
    public express: express.Express;
    public container!: AwilixContainer;

    constructor(){
        this.express = express();
        this.express.use(cors());
        this.express.use(helmet());
        this.express.use(bodyParser.json({ limit: '4mb' }));
        this.express.use(bodyParser.text({ type: 'text/html', limit: '2mb' }));
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(compression());
        this.express.use('/swagger', swagger.serve);        
        this.express.use(express.static(path.join(process.cwd(), 'public')));
        this.mapIoC()
        this.express.use(expressErrorHandling);
    }

    private mapIoC() {
        this.container = createContainer().loadModules([`features/**/*UseCase.ts`, `features/**/*Repository.ts`], {
          cwd: __dirname,
          formatName: 'camelCase',
          resolverOptions: {
            lifetime: 'SINGLETON',
            injectionMode: InjectionMode.PROXY,
            register: asClass
          }
        });
        this.container.register({
          validateOrRejectBody: asFunction(validateOrRejectBody)
        });
        this.container.register({
            logger: asValue(logger)
        })
        this.express.use(scopePerRequest(this.container));
        this.express.use(loadControllers(`features/**/*Controller.{js,ts}`, { cwd: __dirname }));
      }
}

export default new App();