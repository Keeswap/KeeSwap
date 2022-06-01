import WalletConnectProvider from "@walletconnect/web3-provider";

//  Create WalletConnect Provider
export const provider = new WalletConnectProvider({
  infuraId: "28a21010f56f4c7e8561ab6a8797ebe4",
  bridge: "https://bridge.walletconnect.org",
  rpc: {
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ["metamask", "trust"],
  },
  desktopLinks: ["encrypted ink"],
});
