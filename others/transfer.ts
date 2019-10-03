import { PnPClientStorage } from "@pnp/common";

export declare const enum SessionStorageKeyNames {
  MyFollowSites = "rabohub-myfollowsites-sessionKey",
  isRequested = "isRequested",
  Example = "rabohub-example-session-key"
}

export interface RaboHubSessionStorageMethods {
  /**
   * Adds a value to the underlying storage
   * @param keyName The key to use to get Session Storage. Refer key values from SessionStorageKeyNames property
   * @param promiseObj The REST call to get Item(s). Mostly from PnP JS
   * @param expirationInMilleseconds Optional, if provided the expiration of the item, otherwise the default is used which is 1 hour (3600000 milleseconds)
   */
  staleWhileRevalidate(
    keyName: SessionStorageKeyNames,
    promiseObj: Promise<any>,
    expirationInMilleseconds: number
  ): Promise<any>;
}

const CONST = {
  DefaultExpiration: 3600000, // 1 Hour in Milleseconds
  DefaultExpirationForFlag: 120000 // 2 Minutes in Milleseconds
};

export class RaboHubSessionStorageService
  implements RaboHubSessionStorageMethods {
  private pnpStorage = new PnPClientStorage();

  staleWhileRevalidate<T>(
    sessionKey: SessionStorageKeyNames,
    promiseObj: Promise<T>,
    expiration: number
  ): Promise<T> {
    return new Promise<T>(
      async (
        resolve: (response: any) => void,
        reject: (error: any) => void
      ) => {
        try {
          const loadedData = this.pnpStorage.session.get(sessionKey);
          const loadedDataIsRequested = this.pnpStorage.session.get(
            SessionStorageKeyNames.isRequested + sessionKey
          );
          let items: any = null;
          if (loadedDataIsRequested) {
            setTimeout((): void => {
              this.staleWhileRevalidate(sessionKey, promiseObj, null).then(
                (result: any): void => {
                  resolve(result);
                }
              );
            }, 50);
          } else {
            if (!loadedData) {
              this.pnpStorage.session.put(
                SessionStorageKeyNames.isRequested + sessionKey,
                true,
                new Date(new Date().getTime() + CONST.DefaultExpirationForFlag)
              );
              console.log("Faz-Log: inside", promiseObj);
              items = await promiseObj;
              this.pnpStorage.session.put(
                sessionKey,
                items,
                expiration
                  ? new Date(new Date().getTime() + expiration)
                  : new Date(new Date().getTime() + CONST.DefaultExpiration)
              );
              console.log("from SharePoint PnP");
              this.pnpStorage.session.delete(
                SessionStorageKeyNames.isRequested + sessionKey
              );
            } else {
              console.log("from Session storage");
              items = loadedData;
            }
            resolve(items);
          }
        } catch (error) {
          this.pnpStorage.session.delete(
            SessionStorageKeyNames.isRequested + sessionKey
          );
          reject(error);
        }
      }
    );
  }
}
