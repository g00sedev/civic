import fs from 'fs';
import yaml from 'js-yaml';

export function loadConfig() {
  return yaml.safeLoad(fs.readFileSync('config.yml'));
}
