// My Library phone app - settings. The OAuth client ID is public by design (it is not a secret);
// it only works on the "Authorized JavaScript origins" set in Google Cloud Console.
window.LIBRARY_CONFIG = {
  // Google Cloud Console -> Google Auth Platform -> Clients -> "My Library" Web application client ID
  clientId: "172687019522-ubguh8de1h0uc4decopqt2c0k9lcmkhl.apps.googleusercontent.com",
  exportName: "collection-export.json",
  thumbsName: "collection-thumbs.json",
  folderName: "MyLibrary",
  // UPC lookup relay on Arthur's own server (instant product names for scanned barcodes). It changes only if the
  // server's Cloudflare quick tunnel restarts; leave "" to skip it (the phone then asks the PC instead).
  upcRelay: "https://sellers-stewart-narrative-pittsburgh.trycloudflare.com",
  loginHint: ""   // optional; left blank so no e-mail address is published (the app remembers it after the first sign-in)
};
