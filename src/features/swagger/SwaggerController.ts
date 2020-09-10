import { route, GET } from 'awilix-express';
import * as swagger from 'swagger-ui-express';
import { Logger } from 'winston';

const options: swagger.SwaggerOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: '/swagger/v1/openapi.yaml',
        name: 'V1'
      }
    ]
  }
};

const handler = swagger.setup(undefined, options);

@route('/swagger')
export default class SwaggerController {
    private _logger: Logger;
    constructor({ logger }: any) {        
        this._logger = logger;
        this._logger.info('teste de log');                            
    }
  @GET()
  public getUi = handler
}
