const pnpConfig = {
  sp: {
    baseUrl: "http://localhost:8080",
    headers: {
      Accept: "application/json; odata=verbose",
      "Access-Control-Allow-Origin": "*"
    }
  }
};

export { pnpConfig };
