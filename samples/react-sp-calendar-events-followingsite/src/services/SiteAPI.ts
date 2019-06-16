import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp";

export const getFollowedSiteUri = async () => {
  const resd = await sp.social.my
    .followed(4)
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(e => console.log(e));
  console.log("TCL: getFollowedSiteUri -> resd", resd);

  let web = new Web("http://localhost:8080/sites/lutherdev");
  const userID = await web.currentUser.get().then(u => {
    return u.Id;
  });
  const dd = await web.lists
    .filter("BaseTemplate eq 106")
    .get()
    .then(async result => {
      console.log("TCL: getFollowedSiteUri -> result", result);
      const ss = await web.lists
        .getById("71768252-4d2f-4baa-be1a-c1ee31b205f4")
        .items.get()
        .then(d => d);
      console.log("TCL: getFollowedSiteUri -> ss", ss);
      //Add your code to display the collection results
    });
  console.log("TCL: getFollowedSiteUri -> dd", dd);
  console.log("TCL: getFollowedSiteUri -> userID", userID);
  // .then(userId => {
  //   return web.lists
  //     .getByTitle(listName).items
  //     .filter(`AuthorId eq '${userId}'`).get();
  // });

  web.get().then(w => {
    console.log(w);
  });

  // sp.site
  //   .openWebById(
  //     "8.e7588571a8ce4cbaacf1d9fd9d338b96.02bc530901e84844839c587d81c0e939.e7588571a8ce4cbaacf1d9fd9d338b96.557dcdbf0b6d4f02a017deabdb02ec33"
  //   )
  //   .then(w => {
  //     //we got all the data from the web as well
  //     console.log(w.data);
  //     // we can chain
  //     w.web
  //       .select("Title")
  //       .get()
  //       .then(w2 => {
  //         console.log("TCL: getFollowedSiteUri -> w2 ", w2);
  //       });
  //   });
};
