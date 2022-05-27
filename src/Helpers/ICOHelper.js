import React from "react";
import { ICO_ABI } from "../Config/ABI/ICO_ABI";
import { ICO_Contract } from "../Config/Contract/ICO_Contract";
import { web3_ } from "../Services";

export const ICOHelperContract = () => {
  console.log(new web3_.eth.Contract(ICO_ABI, ICO_Contract));
};
