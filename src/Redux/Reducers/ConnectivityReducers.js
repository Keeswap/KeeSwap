const initialState = {
  metamaskAddress: "",
  metamaskBalance: "",
  metamaskNetwork: "",
  LaunchpadList: [],
  metamaskConnect: false,
  isConnectModalOpen: false,
};

export function ConnectivityReducer(state = initialState, action) {
  switch (action.type) {
    case "CONNECT_WALLET":
      return {
        ...state,
        metamaskAddress: action.address,
        metamaskConnect: true,
      };
    case "IS_CONNECT_WALLET":
      return {
        ...state,
        metamaskConnect: action.status,
      };
    case "WALLET_DISCONNECT":
      return {
        metamaskBalance: "",
        metamaskNetwork: "",
        metamaskConnect: false,
        referURL: "",
      };
    case "LAUNCHPAD_LIST":
      return {
        LaunchpadList: action.payload,
      };
    case "CONNECT_WALLET_MODAL":
      return { ...state, isConnectModalOpen: action.isOpen };
    default:
      return state;
  }
}
