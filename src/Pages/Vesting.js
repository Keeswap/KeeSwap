import React, { useEffect, useState } from "react";
import logo from "../assets/logokeeswapfinal.png";
import bgImg from "../assets/mdesign.png";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./vesting.css";
import {
  ConnectMetamask,
  ConnectWeb3Wallet,
  DisconnectWallet,
  web3_,
} from "../Services";
import Swal from "sweetalert2";
import { icoAbi } from "../Config/ABI/ICO_ABI";
import { ico } from "../Config/Contract/ICO_Contract";
import { busdContract, keeswap } from "../Constants/Contaracts";
import { busdAbi } from "../Constants/Abi";

function Vesting(props) {
  const [connect, setConnect] = useState(false);
  const [address, setAddress] = useState([]);
  const [busdData, setBusdData] = useState([]);
  const [owner, setOwner] = useState("");
  const [amount, setAmount] = useState();
  const navigate = useNavigate();
  useEffect(async () => {
    if (props.metamaskAddress == "") {
    } else {
      await new web3_.eth.Contract(icoAbi, ico).methods
        .owner()
        .call()
        .then((res) => {
          console.log(res, props.metamaskAddress);

          if (res.toLowerCase() == props.metamaskAddress) {
            console.log(res);
            setOwner("Yes");
          } else {
            // alert("yes");
          }
        })
        .catch((e) => {
          Swal.fire(e.message);
        });
    }
  }, [props.metamaskAddress]);
  async function connectToWallet() {
    if (window.ethereum) {
      await ConnectMetamask();

      setConnect(true);
    } else {
      DisconnectWallet();
      await ConnectWeb3Wallet();
      setConnect(true);
    }
  }
  async function handleVesting() {
    if (!connect) {
      Swal.fire("Please Connect Metanask");
    } else {
      let sTime = parseInt(
        await new web3_.eth.Contract(icoAbi, ico).methods.startTime().call()
      );
      let eTime = parseInt(
        await new web3_.eth.Contract(icoAbi, ico).methods.endTime().call()
      );
      let cTime = Math.floor(new Date().getTime() / 1000.0);
      console.log(sTime, parseInt(eTime), cTime);
      if ((sTime <= cTime && eTime >= cTime) || sTime > cTime) {
        Swal.fire("Cannot vest when sale is live");
      } else {
        await new web3_.eth.Contract(icoAbi, ico).methods
          .Vesting()
          .send({ from: props.metamaskAddress })
          .then((res) => {
            Swal.fire("Succesfully Claimed");
          })
          .catch((e) => {
            Swal.fire(e.message);
          });
      }
    }

    console.log("Vesting");
  }
  async function handleUserDetails() {
    if (!connect) {
      Swal.fire("Please Connect Metanask");
    } else {
      await new web3_.eth.Contract(icoAbi, ico).methods
        .showAllTrade()
        .call()
        .then((res) => {
          setAddress(res[0]);
          setBusdData(res[1]);
          console.log("trade", res);
        })
        .catch((e) => {
          Swal.fire(e.message);
        });
    }

    console.log("Vesting");
  }
  async function retriveFund() {
    const { value: token } = await Swal.fire({
      title: "Input Amount You Want To Retrive",
      input: "text",
      inputLabel: "Enter Token Amount",
      inputPlaceholder: "Enter Token",
    });

    if (token) {
      console.log(typeof token);
      let cd = web3_.utils.toWei(token.toString(), "ether");
      if (balance / Math.pow(10, 18) > cd / Math.pow(10, 18)) {
        Swal.fire("You don't have enough tokens in ico to retrive");
      } else {
        await new web3_.eth.Contract(icoAbi, ico).methods
          .retrieveStuckBEP20Token(busdContract, cd, props.metamaskAddress)
          .send({ from: props.metamaskAddress })
          .then((res) => {
            setAddress(res[0]);
            setBusdData(res[1]);
            console.log("trade", res);
            Swal.fire("Transaction Successfull", "", "success");
          })
          .catch((e) => {
            Swal.fire(e.message);
          });
      }
      setAmount(cd);
    }

    const balance = await new web3_.eth.Contract(busdAbi, busdContract).methods
      .balanceOf(ico)
      .call();
  }
  async function retrive
  Fund() {
    const { value: token } = await Swal.fire({
      title: "Input Amount You Want To Retrive",
      input: "text",
      inputLabel: "Enter Token Amount",
      inputPlaceholder: "Enter Token",
    });

    if (token) {
      console.log(typeof token);
      let cd = web3_.utils.toWei(token.toString(), "ether");
      if (balance / Math.pow(10, 18) > cd / Math.pow(10, 18)) {
        Swal.fire("You don't have enough tokens in ico to retrive");
      } else {
        await new web3_.eth.Contract(icoAbi, ico).methods
          .retrieveStuckBEP20Token(keeswap, cd, props.metamaskAddress)
          .send({ from: props.metamaskAddress })
          .then((res) => {
            setAddress(res[0]);
            setBusdData(res[1]);
            console.log("trade", res);
            Swal.fire("Transaction Successfull", "", "success");
          })
          .catch((e) => {
            Swal.fire(e.message);
          });
      }
      setAmount(cd);
    }

    const balance = await new web3_.eth.Contract(busdAbi, busdContract).methods
      .balanceOf(ico)
      .call();
  }
  async function handleDisconnect() {
    DisconnectWallet();
    setConnect(false);
  }
  return (
    <div className="main-container" style={{ height: "100vh" }}>
      <header className="main-header">
        <div className="header-container">
          {/* Header navbar */}
          <nav className="main-header-navbar">
            <img
              src={logo}
              alt="KeeSwap logo"
              className="main-header-navbar__logo"
              style={{ width: 100 }}
              onClick={() => {
                navigate("/");
              }}
            />
            <ul className="main-header-navbar__nav">
              <li className="main-header-navbar__nav__item">
                <a href="" className="main-header-navbar__nav__link">
                  Home
                </a>
              </li>
              <li>
                {connect ? (
                  <>
                    {" "}
                    {props.metamaskAddress &&
                      `${props.metamaskAddress.slice(
                        0,
                        3
                      )}..${props.metamaskAddress.slice(40, 42)}`}
                  </>
                ) : (
                  <>
                    {" "}
                    <button
                      className="main-header-navbar__nav__link"
                      style={{
                        padding: 6,
                        borderRadius: 10,
                        background: "cornflowerblue",
                        border: "none",
                        color: "white",
                      }}
                      onClick={connectToWallet}
                    >
                      Connect
                    </button>
                  </>
                )}
                {connect ? (
                  <>
                    {" "}
                    <button
                      className="main-header-navbar__nav__link"
                      style={{
                        padding: 6,
                        borderRadius: 10,
                        background: "cornflowerblue",
                        border: "none",
                        color: "white",
                      }}
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </>
                ) : null}
              </li>
            </ul>
          </nav>
          {/* Header content */}
          <div className="main-header-content-container ">
            <div className="main-header-content-principal ">
              <h1 className="main-header-content-principal__title ">
                Fastest &amp; <span>secure platform </span> to invest in{" "}
                <span className=""> crypto</span>
              </h1>
              <p className="main-header-content-principal__description typewriter">
                Buy cryptocurrencies, trusted by various users.
              </p>
            </div>
            <img
              src={bgImg}
              alt
              className="main-header-content-principal__illustration ball widthCls"
            />
          </div>
          {connect ? (
            <>
              <div style={{ margin: "0 auto" }}>
                {owner == "Yes" ? (
                  <>
                    <button onClick={handleVesting} className="btnCls mx-2">
                      Click For Vesting
                    </button>

                    <button onClick={handleUserDetails} className="btnCls mx-2">
                      Click For User Details
                    </button>
                    <button onClick={retriveFund} className="btnCls mx-2">
                      Click For BUSD Retrival
                    </button>
                    <button
                      onClick={retriveUSDTFund}
                      className="btnCls mx-2 mt-2"
                    >
                      Click For KEE Retrival
                    </button>
                    <div style={{ paddingTop: 20 }}>
                      <h2>User Details</h2>
                      <table class="table" style={{ fontSize: 14 }}>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Address</th>
                            <th scope="col">Amount(BUSD)</th>
                            <th scope="col">Amount (KEE)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {address &&
                            address.map((item, key) => (
                              <>
                                <tr key={key}>
                                  <th scope="row">{key + 1}</th>
                                  <td>
                                    {item.slice(0, 3) +
                                      ".." +
                                      item.slice(38, 42)}
                                  </td>
                                  <td>
                                    {parseFloat(
                                      busdData[key] / Math.pow(10, 18)
                                    ).toFixed(4)}{" "}
                                    BUSD
                                  </td>
                                  <td>
                                    {parseFloat(
                                      busdData[key] / Math.pow(10, 18) / 0.03
                                    ).toFixed(4)}{" "}
                                    KEE
                                  </td>
                                </tr>
                              </>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <h1>Caller Is Not The Owner</h1>
                )}
              </div>
            </>
          ) : (
            <>
              <h1>Please Connect To Wallet First</h1>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    metamaskAddress: state.ConnectivityReducer.metamaskAddress,
    metamaskConnect: state.ConnectivityReducer.metamaskConnect,
  };
};
export default connect(mapStateToProps, null)(Vesting);
