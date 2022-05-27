// import { GetBUSDBalanceHelper } from "../../Helpers/BUSDToken";
import { store } from "../store";

export const ConnectWallet = (address) => {
  store.dispatch({
    type: "CONNECT_WALLET",
    address: address,
  });
  console.log(store.getState());
};
export const isConnectWallet = (status) => {
  store.dispatch({
    type: "IS_CONNECT_WALLET",
    status: status,
  });
  console.log(store.getState());
};
export const UpdateConnectModal = (status) => {
  store.dispatch({
    type: "CONNECT_WALLET_MODAL",
    isOpen: status,
  });
};

export const WalletDisconnect = () => {
  store.dispatch({
    type: "WALLET_DISCONNECT",
  });
};
