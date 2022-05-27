import Web3 from "web3";
import { store } from "../Redux/store";
import { provider } from "../Services/web3Connection";
import {
  ConnectWallet,
  isConnectWallet,
  WalletDisconnect,
} from "../Redux/Action/Action";
export let web3_;

export const ConnectMetamask = async () => {
  if (window.ethereum) {
    web3_ = new Web3(window.ethereum);
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => {
        store.getState().ConnectivityReducer.metamaskAddress = res[0];
        store.getState().ConnectivityReducer.metamaskConnect = true;
        ConnectWallet(res[0]);
      });
  } else {
    alert("Please connect via Wallet Connect");
    return false;
  }
  if (window.ethereum) {
    window.ethereum.on("connect", (connect) => {
      console.log(connect);
    });

    window.ethereum.on("accountsChanged", (accounts) => {
      DisconnectWallet();
      console.log(accounts[0]);
      // isConnectWallet(false);
      ConnectWallet(accounts[0]);
    });

    // Subscribe to chainId change
    window.ethereum.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    window.ethereum.on("disconnect", (code, reason) => {
      console.log(code, reason);
    });
  }
};

// Wallect Connnect Funcitonltiy
export const ConnectWeb3Wallet = async () => {
  await provider.enable();
  web3_ = new Web3(provider);
  console.log(web3_, provider);
  let address = await web3_.eth.getAccounts();
  ConnectWallet(address[0]);
  provider.on("accountsChanged", async (accounts) => {
    console.log(accounts);
    ConnectWallet(accounts[0]);
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });

  // Subscribe to session disconnection
  provider.on("disconnect", (code, reason) => {
    console.log(code, reason);
  });
};
console.log(web3_, provider);
export const DisconnectWallet = () => {
  provider.disconnect();
  WalletDisconnect();
  store.getState().ConnectivityReducer.metamaskAddress = "";
  store.getState().ConnectivityReducer.metamaskConnect = false;
};
