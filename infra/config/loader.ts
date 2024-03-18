import * as path from 'path';
import * as joi from 'joi';
import * as toml from 'toml';
import * as fs from 'fs';

interface IConfig {
  app: {
    ns: string;
    stage: string;
  };
  aws: {
    region: string;
  };
  repository: {
    name: string;
  };
  share: {
    account: string;
    expiryDate: string;
  };
}

const cfg = toml.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '.toml'), 'utf-8')
);
console.log('loaded config', cfg);

const schema = joi
  .object({
    app: joi
      .object({
        ns: joi.string().required(),
        stage: joi.string().required(),
      })
      .required(),
    aws: joi
      .object({
        region: joi.string().required(),
      })
      .required(),
    repository: joi
      .object({
        name: joi.string().required(),
      })
      .required(),
    share: joi
      .object({
        account: joi.string().required(),
        expiryDate: joi.string().isoDate().required(),
      })
      .required(),
  })
  .unknown();

const { error } = schema.validate(cfg);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const Config: IConfig = {
  ...cfg,
  app: {
    ...cfg.app,
    ns: `${cfg.app.ns}${cfg.app.stage}`,
  },
};
