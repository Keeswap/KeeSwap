import Web3 from "web3";
import React, { useState } from "react";
import { store } from "../Redux/store";
let web3 = new Web3(window.ethereum);
// conncet Wallet
export async function connectToWallet() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];
  return { accountAddress: account };
}

//Get user metamask balance
export async function getAccountBalance(netwokrAddress) {
  let balance = (await web3.eth.getBalance(netwokrAddress)) / Math.pow(10, 18);
  return { accountBalance: balance };
}

export async function getAllAccountDetails() {
  return connectToWallet().then(async (res) => {
    store.getState().ConnectivityReducer.metamaskAddress = res.accountAddress;
    return getAccountBalance(res.accountAddress).then(async (res) => {
      store.getState().ConnectivityReducer.metamaskBalance = res.accountBalance;
      return { result: await showCurrentNetwork() };
    });
  });
}
//check network
export async function showCurrentNetwork() {
  return web3.eth.getChainId().then(async (networkID) => {
    switch (networkID) {
      case 1:
        store.getState().ConnectivityReducer.metamaskNetwork = "Ethereum";
        return "Ethereum";
      //   break;
      case 56:
        store.getState().ConnectivityReducer.metamaskNetwork = "Binance";
        return "Binance";
        break;
      case 97:
        store.getState().ConnectivityReducer.metamaskNetwork =
          "Binance:Testnet";
        break;
      default:
        store.getState().ConnectivityReducer.metamaskNetwork = "";
    }
    return networkID;
  });
}
