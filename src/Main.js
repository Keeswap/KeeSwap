/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import logo from "./assets/logokeeswapfinal.png";
import bgImg from "./assets/mdesign.png";
import cardicon1 from "./assets/cardicon1.png";
import cardicon2 from "./assets/cardicon2.png";
import cardicon3 from "./assets/cardicon3.png";
import side1 from "./assets/side1.png";
import side2 from "./assets/side2.png";
import bnb from "./assets/binance.png";
import keeToken from "./assets/keetoken.png";
import pdf from "./assets/KeeSwap-whitepaper.pdf";
import side3 from "./assets/side3.png";
import Swal from "sweetalert2";
import bgImg2 from "./assets/mdesign2.png";
import buy from "./assets/buy.mp4";
import { connect } from "react-redux";
import { ConnectMetamask, DisconnectWallet, web3_ } from "./Services/index";
import { ConnectWeb3Wallet } from "./Services";
// Create a connector

import "./App.css";
import { useEffect, useState } from "react";

import { busdContract, ico } from "./Constants/Contaracts";
import Spinner from "react-spinkit";
import { busdAbi, icoAbi } from "./Constants/Abi";
import { store } from "./Redux/store";
import { useNavigate } from "react-router-dom";
function Main(props) {
  const [connect, setConnect] = useState(false);
  const [icoOver, setIsICOOver] = useState(false);
  const [isApprovedBuy, setIsApprovedBuy] = useState(true);
  const [token, setToken] = useState("");
  const [spinnerAppr, setSpinnerAppr] = useState(false);
  const [getUserDetails, setUserDetails] = useState("");
  const [kees, setKees] = useState("");
  const [spinnerBuy, setSpinnerBuy] = useState(false);
  const [addApprove, setAddAppr] = useState("");
  const [addBuy, setBuyAddr] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [error, setError] = useState("");

  const password = 9988;
  const navigate = useNavigate();
  useEffect(async () => {
    console.log("New Address ", props.metamaskAddress);
    if (!isApproved) {
      // alert("Account Chnaged ");
      DisconnectWallet();
      setToken("");
      setIsApproved(true);

      setKees("");
    }
    if (props.metamaskAddress != "") {
      let res = await new web3_.eth.Contract(icoAbi, ico).methods
        .ClaimTrackDataset(props.metamaskAddress)
        .call();

      console.log("in this", res);
      setUserDetails(res);
      await getDetails();
    }
  }, [props.metamaskAddress]);
  useEffect(() => {
    DisconnectWallet();
  }, []);
  async function handleLogin() {
    Swal.fire({
      title: "Please enter admin credentials",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        if (parseInt(login) == password) {
          Swal.fire("Login Successfull", "", "success");
          navigate("/keeswap/admin_/test/vesting");
        } else {
          Swal.fire("Login Failed", "Invalid Pin", "error");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (!result.isConfirmed) {
        Swal.fire({
          title: `Invalid Pin`,
        });
      }
    });
  }
  async function handleClick() {
    if (window.ethereum) {
      await ConnectMetamask();
      console.log("yess");
      setConnect(true);
      setIsApprovedBuy(true);
      // getDetails();
    } else {
      DisconnectWallet();
      await ConnectWeb3Wallet();
      getDetails();
      setConnect(true);
      setIsApprovedBuy(true);
    }
  }

  async function handleChange(e) {
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if (isNumeric(e.target.value)) {
      setError("");
      setToken(e.target.value);

      console.log(e.target.value);
      setKees(e.target.value / 0.03);
    } else {
      setError("Please Enter Numbers In Input");
      setToken("");
      return;
    }
  }
  async function getDetails() {
    // alert("yess");
    let addAppr = store.getState().ConnectivityReducer.metamaskAddress;
    setAddAppr(addAppr);

    await new web3_.eth.Contract(icoAbi, ico).methods
      .vestingCounter()
      .call()

      // get New Contract Address
      .then(async (res) => {
        // alert(res);

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    await new web3_.eth.Contract(icoAbi, ico).methods
      .isIcoOver()
      .call()

      // get New Contract Address
      .then(async (res) => {
        // alert(res);
        setIsICOOver(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function handleApprove() {
    if (!connect) {
      Swal.fire("Please connect Metamask");
      setToken("");
      setKees("");
      setIsApproved(true);
      setIsApprovedBuy(true);
    } else {
      let res = await new web3_.eth.Contract(busdAbi, busdContract).methods
        .balanceOf(props.metamaskAddress)
        .call();

      console.log(res / Math.pow(10, 18), token);
      let addAppr = store.getState().ConnectivityReducer.metamaskAddress;
      setAddAppr(addAppr);

      const tkn = web3_.utils.toWei(token.toString(), "ether");
      setSpinnerAppr(true);
      console.log(res / Math.pow(10, 18) < parseFloat(token));
      if (res / Math.pow(10, 18) > parseFloat(token)) {
        await new web3_.eth.Contract(busdAbi, busdContract).methods
          .approve(ico, tkn)
          .send({
            from: props.metamaskAddress,
          })
          .on("transactionHash", function (transactionHash) {
            console.log(transactionHash);
          })
          .on("confirmation", () => {})
          // get New Contract Address
          .then(async (res) => {
            Swal.fire("Transaction Successful", "", "success");
            setIsApproved(false);
            setSpinnerAppr(false);
            setIsApprovedBuy(false);
          })
          .catch((err) => {
            console.log(err);
            Swal.fire(
              "Transaction Failed",
              "Please Try After Some Time",
              "error"
            );
            setToken("");
            setKees("");
            setIsApproved(true);
            setSpinnerAppr(false);
          });
      } else {
        Swal.fire(
          `Please Enter Atleast ${token} BUSD In Your Account To Intiate This Transaction.`
        );
        setToken("");
        setKees("");
        setIsApproved(true);
        setIsApprovedBuy(true);
      }
    }
  }

  async function handleBuy() {
    const tkn = web3_.utils.toWei(token.toString(), "ether");
    setSpinnerBuy(true);
    await new web3_.eth.Contract(icoAbi, ico).methods
      .SaleICOToken(tkn)
      .send({
        from: props.metamaskAddress,
        gasPrice: "20000000000",
      })
      .then((res) => {
        console.log(res);
        setSpinnerBuy(false);
        Swal.fire("Transaction Successful", "", "success");
        setToken("");
        setIsApproved(true);
        setSpinnerAppr(false);
        setKees("");
      })

      .catch((err) => {
        setSpinnerBuy(false);
        Swal.fire("Transaction Failed", "Please Try After Some Time", "error");
      });
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
            />
            <ul className="main-header-navbar__nav">
              <li className="main-header-navbar__nav__item">
                <a href="" className="main-header-navbar__nav__link">
                  Home
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#about" className="main-header-navbar__nav__link">
                  Buy
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#features" className="main-header-navbar__nav__link">
                  Values
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#price" className="main-header-navbar__nav__link">
                  Price
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#roadmap" className="main-header-navbar__nav__link">
                  Roadmap
                </a>
              </li>
              {connect ? (
                <>
                  <li className="main-header-navbar__nav__item">
                    <a
                      href="#roadmap"
                      className="main-header-navbar__nav__link"
                    >
                      {props.metamaskAddress &&
                        `${props.metamaskAddress.slice(
                          0,
                          3
                        )}..${props.metamaskAddress.slice(40, 42)}`}
                    </a>
                  </li>
                </>
              ) : null}

              <li className="main-header-navbar__nav__item">
                {connect ? (
                  <>
                    <a
                      className="main-header-navbar__nav__link disconnectButton"
                      onClick={() => {
                        setConnect(false);
                      }}
                    >
                      <span
                        style={{
                          borderRadius: "20px",
                          border: "1px solid green",
                          padding: 5,
                          color: "green",
                        }}
                      >
                        Disconnect
                      </span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      className="main-header-navbar__nav__link disconnectButton"
                      style={{
                        borderRadius: "20px",
                        border: "1px solid green",
                        padding: 5,
                        color: "green",
                        cursor: "pointer",
                      }}
                      onClick={handleClick}
                    >
                      Connect Wallet
                    </a>
                  </>
                )}
              </li>
              <li>
                {" "}
                <a
                  className="main-header-navbar__nav__link disconnectButton"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid green",
                    padding: 5,
                    color: "green",
                    cursor: "pointer",
                  }}
                  onClick={handleLogin}
                >
                  Admin Login
                </a>
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
                Buy cryptocurrencies, trusted by Keeswap users.
              </p>
            </div>

            <img
              src={bgImg}
              alt
              className="main-header-content-principal__illustration ball"
            />
          </div>
          <div
            className="main-header-content-container "
            style={{ padding: 20 }}
          >
            <div className="main-header-content-principal ">
              <h1
                className="main-header-content-principal__title "
                style={{ textAlign: "center" }}
              >
                How to buy <span>Keeswap </span>
              </h1>
              <p className="main-header-content-principal__description typewriter">
                Procedure to buy Keeswap
              </p>
            </div>
            <video style={{ width: "50%" }} controls="controls">
              <source src={buy} type="video/mp4" />
            </video>
          </div>
          <div style={{ fontSize: 22, marginTop: 55 }}>
            <h1>User Details</h1>
            <ul style={{ padding: 20 }}>
              {console.log(getUserDetails)}
              <li>
                Total Token :{" "}
                {getUserDetails === ""
                  ? "Please Connect To Wallet"
                  : parseFloat(
                      getUserDetails.userTotal / Math.pow(10, 18)
                    ).toFixed(3)}{" "}
                KEE
              </li>
              <li>
                Recived Token :{" "}
                {getUserDetails === ""
                  ? "Please Connect To Wallet"
                  : parseFloat(
                      getUserDetails.user10perTGE / Math.pow(10, 18)
                    ).toFixed(3)}{" "}
                KEE
              </li>
              <li>
                Claimed :{" "}
                {getUserDetails === ""
                  ? "Please Connect To Wallet"
                  : parseFloat(
                      getUserDetails.claimed / Math.pow(10, 18)
                    ).toFixed(3)}{" "}
                KEE
              </li>
              <li>
                Vesting Round : {getUserDetails && getUserDetails.vestingRound}
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main className="main-content">
        {/* Why us section */}

        <section className="why-us-wrapper">
          {/* Stats */}

          <div className="stats-section">
            <div className="stats-section__reference">
              <i className="fas fa-chart-line" />
              <h3 className="stats-section__reference__title">100 Kee</h3>
              <p className="stats-section__reference__description">Staking</p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-user" />
              <h3 className="stats-section__reference__title">100+</h3>
              <p className="stats-section__reference__description">Buy</p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-globe" />
              <h3 className="stats-section__reference__title">195</h3>
              <p className="stats-section__reference__description">
                Countries Supported
              </p>
            </div>
          </div>

          {/* Why us */}
          <div className="why-us-section" id="about">
            <div className="why-us-section__content">
              <h2 className="why-us-section__content__title">
                Why you should choose
              </h2>
              <p className="why-us-section__content__description">
                KeeSwap is a deflationary token.KeeSwap is all-in-one platform
                that works on Binance smart chain providing many facilities
                under an umbrella. Swapping allows converting its token into the
                desired one.
              </p>
              {/* <a className="why-us-section__content__btn" onClick={handelPopup}>
                Buy Now
              </a> */}

              <div className="flexDiv">
                <div>
                  {!icoOver ? (
                    <>
                      <h3
                        className="why-us-section__content__title"
                        style={{ textAlign: "center" }}
                      >
                        Buy Keeswap
                      </h3>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          onChange={handleChange}
                          placeholder="Enter Amount To Buy"
                          style={{ padding: 8, marginTop: 10, width: "100%" }}
                          value={token}
                        />
                        <div
                          style={{
                            padding: 5,
                            border: "1px solid black",
                            width: "85px",
                            justifyContent: "space-around",
                            marginTop: "10px",
                            borderRadius: 7,
                            marginLeft: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img src={bnb} width="20" />
                          <div>BUSD</div>
                        </div>
                      </div>

                      <span>
                        <p style={{ color: "red" }}>{error}</p>
                      </span>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder={`${kees} Kee`}
                          style={{ padding: 10, marginTop: 10, width: "100%" }}
                          disabled
                        />
                        <div
                          style={{
                            padding: 5,
                            border: "1px solid black",
                            width: "85px",
                            justifyContent: "space-around",
                            marginTop: "10px",
                            borderRadius: 7,
                            marginLeft: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img src={keeToken} width="20" />
                          <div>KEE</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>Sale Is Over</>
                  )}
                </div>

                <div className="flexDivBtn">
                  <button
                    className="why-us-section__content__btn"
                    onClick={handleApprove}
                    disabled={token == "" || isApproved == false}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      {spinnerAppr ? (
                        <Spinner
                          name="circle"
                          style={{ width: 30, height: 30 }}
                        />
                      ) : (
                        <>Approve</>
                      )}
                    </div>
                  </button>
                  <button
                    className="why-us-section__content__btn"
                    onClick={handleBuy}
                    disabled={isApproved || isApprovedBuy}
                  >
                    {spinnerBuy ? (
                      <Spinner
                        name="circle"
                        style={{ width: 30, height: 30 }}
                      />
                    ) : (
                      <>Buy</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <img
              src={bgImg2}
              alt
              className="
                  why-us-section__illustration ball"
            />
          </div>
          {/* Benefits */}
          <div className="benefits-section" id="price">
            <h2 className="benefits-section__title">
              Check how much you can <span>earn</span>
            </h2>
            <p className="benefits-section__description">
              This platform is designed to allow users to securely Swap tokens
              without relying on centralized services or losing control over
              their private keys. All trades are automatically executed via
              smart contracts liminating counterparty risks as a decentralized
              exchange
            </p>
            <div className="card-info">
              <h4 className="card-info__title">Keeswap Price:</h4>
              <p className="card-info__description">
                0.03 BUSD <span>(1 KEE)</span>
              </p>
              <span className="card-info__advice">
                Revenue will change based on mining difficulty and BUSD Price.
              </span>
            </div>
          </div>
        </section>

        {/* Cryptocurrencies section */}
        <section className="cryptocurrencies-section" id="products">
          <h2 className="cryptocurrencies-section__title">
            Advantages OF Using Keeswap
          </h2>
          <div className="cryptocurrencies-info-cards">
            <div className="info-card">
              <img src={cardicon1} width="60" />
              <h3 className="info-card__title">Community Driven</h3>
              <p className="info-card__description">
                KeeSwap is a community-driven token created on the Binance Smart
                Chain.
              </p>
            </div>
            <div className="info-card">
              <img src={cardicon2} width="60" />
              <h3 className="info-card__title">Speed</h3>
              <p className="info-card__description">
                KeeSwap is one of the fastest-growing cryptocurrencies of its
                kind due to its unique nature.
              </p>
            </div>
            <div className="info-card">
              <img src={cardicon3} width="60" />
              <h3 className="info-card__title">First In Class</h3>
              <p className="info-card__description">
                KeeSwap is proud to be the world's first Yield Generation token
                to reward its holders in $BUSD.
              </p>
            </div>
          </div>
        </section>
        {/* Features section */}
        <section className="features-section" id="features">
          <h2 className="features-section__title">Our Core Values</h2>
          <article className="invest-smart-article">
            <div className="invest-smart-article__content">
              <h3 className="invest-smart-article__content__title">
                Community
              </h3>
              <p className="invest-smart-article__content__description">
                The KeeSwap ecosystem's most valuable asset is its community.
              </p>
            </div>
            <img
              src={side1}
              style={{ width: 300 }}
              alt="Crypto stats"
              className="invest-smart-article__graphic"
            />
          </article>
          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                Utility
              </h3>
              <p className="detailed-stats-article__content__description">
                In the crypto relm we belive utility is the cornerstone .
              </p>
            </div>
            <img
              src={side2}
              style={{ width: 300 }}
              alt="Detailed statistics"
              className="detailed-stats-article__graphic"
            />
          </article>
          <article className="grow-profit-article">
            <div className="grow-profit-article__content">
              <h3 className="grow-profit-article__content__title">
                Inclusivity
              </h3>
              <p className="grow-profit-article__content__description">
                At Keeswap we put inclusivity at the center of our purpose.
              </p>
            </div>
            <img
              src={side3}
              style={{ width: 300, height: 400 }}
              alt="Profit graphic"
              className="grow-profit-article__graphic"
            />
          </article>
        </section>
      </main>
      {/* Call To Action */}
      <h2
        className="features-section__title"
        style={{ margin: "0 auto", textAlign: "center", fontSize: 30 }}
      >
        Roadmap
      </h2>
      <section id="roadmap">
        <div className="timeline">
          <div className="outer">
            <div className="card">
              <div className="info">
                <h3 className="title">Phase 1</h3>
                <p className="paddingCls">
                  <ul>
                    <li>Project Planning</li>
                    <li>Smart Contract Development</li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="card">
              <div className="info">
                <h3 className="title" style={{ textAlign: "left" }}>
                  Phase 2
                </h3>
                <p className="paddingCls">
                  <ul>
                    <li>Kee Development</li>
                    <li>Website Development</li>
                    <li>White Paper</li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="card">
              <div className="info">
                <h3 className="title">Phase 3</h3>
                <p className="paddingCls">
                  <ul>
                    <li>IDO LaunchPad</li>
                    <li>Kee Token Release</li>
                    <li>Swap Function</li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="card">
              <div className="info">
                <h3 className="title" style={{ textAlign: "left" }}>
                  Phase 4
                </h3>
                <p className="paddingCls">
                  <ul>
                    <li>Marketing</li>
                    <li>Staking Rewards Release</li>
                    <li>Community Expansion</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <img
            src={logo}
            alt="KeeSwap company logo"
            className="main-footer__logo"
          />
          {/* Footer navs */}
          <nav className="main-footer-navbar">
            {/* Quick Link nav */}
            <ul className="main-footer-navbar__nav">
              <li className="main-footer-navbar__nav__item">
                <h3 className="main-footer-navbar__nav__title">Quick Link</h3>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#" className="main-footer-navbar__nav__link">
                  Home
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#about" className="main-footer-navbar__nav__link">
                  Buy
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#features" className="main-footer-navbar__nav__link">
                  Values
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#price" className="main-footer-navbar__nav__link">
                  Price
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#roadmap" className="main-footer-navbar__nav__link">
                  Roadmap
                </a>
              </li>
            </ul>
            {/* Resources link */}
            <ul className="main-footer-navbar__nav">
              <li className="main-footer-navbar__nav__item">
                <h3 className="main-footer-navbar__nav__title">Resources</h3>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a
                  href={pdf}
                  target="_blank"
                  className="main-footer-navbar__nav__link"
                >
                  Download whitepaper
                </a>
              </li>
            </ul>
          </nav>
          {/* Payment systems */}

          {/* Copy and social links */}
          <div className="copy-and-social">
            <h3
              className="copy-and-social__copy"
              style={{ color: "aliceblue", fontSize: 8 }}
            >
              ©2022 KEESWAP. All rights reserved
            </h3>
            <div className="social-icons">
              <a href="https://t.me/keeswap" target="_blank">
                <i className="fab fa-telegram" />
              </a>
              <a href="https://twitter.com/keeswapofficial" target="_blank">
                <i className="fab fa-twitter" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Attribution footer */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    metamaskAddress: state.ConnectivityReducer.metamaskAddress,
    metamaskConnect: state.ConnectivityReducer.metamaskConnect,
  };
};
export default connect(mapStateToProps, null)(Main);
