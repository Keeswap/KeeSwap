import React, { useState } from "react";
import PropTypes from "prop-types";
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

function Vesting(props) {
  const [connect, setConnect] = useState(false);
  const navigate = useNavigate();
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
  async function handleDisconnect() {
    DisconnectWallet();
    setConnect(false);
  }
  return (
    <div className="main-container">
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
          <div style={{ margin: "0 auto", height: "25vh" }}>
            <button onClick={handleVesting} className="btnCls">
              Click For Vesting
            </button>
          </div>
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
