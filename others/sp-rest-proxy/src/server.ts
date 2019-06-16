import RestProxy from './RestProxy';
import { IProxySettings } from './interfaces';
// Comment if the SharePoint site is On-Prem - setting proxy for SPO
process.env.https_proxy = "http://userid:pwd@proxy.xxxx.com:8080";;
process.env.http_proxy = "http://userid:pwd@proxy.xxxx.com:8080";;
const settings: IProxySettings = {
  configPath: './config/private.json',
  port: 8080
  // protocol: 'https'
};

const restProxy = new RestProxy(settings);
restProxy.serve();
