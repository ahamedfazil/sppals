


export const b64ToBlob = (
    base64: string,
    type: string = "application/octet-stream"
  ): Blob => {
    const byteArray = Uint8Array.from(
      atob(base64)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    return new Blob([byteArray], { type });
  };


  export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));