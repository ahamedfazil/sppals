const URL = {
  dev: {
    siteUrl: "http://localhost:3000"
  },
  production: {
    siteUrl: ""
  },
  qa: {
    siteUrl: ""
  },
  test: {
    siteUrl: ""
  }
};

const credentials = {
  production: {
    ClientId:  	"f3cb7fa3-63d3-4a83-8f97-ae49edb69359",
    ClientSecret:  "WJ8AERFoNpcwiHT89zUWXl8bcAQZrSyCegNS9xBJsq0="
  },
  qa: {
    ClientId: "056ed9d9-8c6a-4a77-866e-d5c203cdf7d2",
    ClientSecret: "BWQvC+UkA27NrIsH4UzedrwOfLbLbbVL/VYvKKQu1PA="
  },
  test: {
    ClientId: "3f2cf90c-664b-43c8-b2fb-2fc47e08ffbb",
    ClientSecret: "GsV/OTlG4yrL3QG4LyLtosaCWQlntKyhhRvNxle8Lhk="
  }
};

const targetPath = "/SiteAssets";

module.exports = {
  URL,
  credentials,
  targetPath
};
