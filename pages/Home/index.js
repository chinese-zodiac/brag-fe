
import { useCoingeckoPrice } from '@usedapp/coingecko';
import { shortenAddress, useContractFunction, useEthers, useToken, useTokenBalance } from '@usedapp/core';
import { BigNumber, Contract, utils } from 'ethers';
import { useEffect, useState } from 'react';
import AutoRewardPoolAbi from "../../abi/AutoRewardPool.json";
import BragAbi from "../../abi/BRAG.json";
import IERC20Abi from "../../abi/IERC20.json";
import Footer from '../../components/Footer';
import Stat from '../../components/Stat';
import Web3ModalButton from '../../components/Web3ModalButton';
import { ADDRESS_AUTO_REWARD_POOL, ADDRESS_BRAG, ADDRESS_BRAGCZUSD_PAIR, ADDRESS_BTCB, ADDRESS_CZUSD } from '../../constants/addresses';
import { SOCIAL_TELEGRAM } from '../../constants/social';
import useAutoRewardPool from "../../hooks/useAutoRewardPool";
import useCurrentEpoch from "../../hooks/useCurrentEpoch";
import BragLogo from '../../public/static/assets/images/BRAG.png';
import RocketBull from '../../public/static/assets/images/Refined Mascot Full.png';
import BtcbLogo from '../../public/static/assets/images/btcb.svg';
import CZCashLogo from '../../public/static/assets/images/czcash.png';
import HeaderBanner from '../../public/static/assets/images/headerbanner.png';
import { weiToShortString } from '../../utils/bnDisplay';
import { czCashBuyLink } from '../../utils/dexBuyLink';
import { deltaCountdown } from '../../utils/timeDisplay';
import "./index.module.scss";


const { formatEther, commify, parseEther, Interface } = utils;

const primaryColor = "rgb(224,186,161)"
const secondaryColor = "rgb(224,218,161)"

const BragInterface = new Interface(BragAbi);
const CONTRACT_BRAG = new Contract(ADDRESS_BTCB, BragInterface);

const AutoRewardPoolInterface = new Interface(AutoRewardPoolAbi);
const CONTRACT_AUTO_REWARD_POOL = new Contract(ADDRESS_AUTO_REWARD_POOL, AutoRewardPoolInterface);

const Ierc20Interface = new Interface(IERC20Abi);

const CONTRACT_BTCB = new Contract(ADDRESS_BTCB, Ierc20Interface);
const CONTRACT_BRAGCZUSD_PAIR = new Contract(ADDRESS_BRAGCZUSD_PAIR, Ierc20Interface);



const displayWad = (wad) => !!wad ? Number(formatEther(wad)).toFixed(2) : "...";

const INITIAL_BRAG_PRICE = "0.000080555";
const INITIAL_BRAG_PRICE_FLOOR = "0.000036161";
const INTIAL_BRAG_SUPPLY = parseEther("210000000");

function Home() {

  const { account, library, chainId } = useEthers();

  const { state: stateClaim, send: sendClaim } = useContractFunction(
    CONTRACT_AUTO_REWARD_POOL,
    'claim');

  const bragInfo = useToken(ADDRESS_BRAG);
  const bragCzusdPairInfo = useToken(ADDRESS_BRAGCZUSD_PAIR);

  const accBtcbBal = useTokenBalance(ADDRESS_BTCB, account);
  const accBragBal = useTokenBalance(ADDRESS_BRAG, account);
  const lpCzusdBal = useTokenBalance(ADDRESS_CZUSD, ADDRESS_BRAGCZUSD_PAIR);
  const lpBragBal = useTokenBalance(ADDRESS_BRAG, ADDRESS_BRAGCZUSD_PAIR);
  const autoRewardPoolBtcbBal = useTokenBalance(ADDRESS_BTCB, ADDRESS_AUTO_REWARD_POOL);
  const lockedLpTokens = useTokenBalance(ADDRESS_BRAGCZUSD_PAIR, ADDRESS_BRAG);
  const czusdPrice = "1.00";
  const btcbPrice = useCoingeckoPrice("bitcoin");

  const currentEpoch = useCurrentEpoch();
  const launchEpoch = 1680606000;

  const [bragPrice, setBragPrice] = useState("0");
  const [bragMcapWad, setbragMcapWad] = useState(parseEther("0"));
  const [bragPriceFloor, setBragPriceFloor] = useState("0");
  const [btcbTotalPaidWad, setbtcbTotalPaidWad] = useState(parseEther("0"));
  const [bragAprWad, setbragAprWad] = useState(parseEther("0"));
  const [liqRatioWad, setLiqRatioWad] = useState(parseEther("0"));

  const {
    rewardPerSecond,
    totalRewardsPaid,
    combinedStakedBalance,
    totalRewardsReceived,
    pendingReward,
    totalStaked,
    timestampLast
  } = useAutoRewardPool(library, account);

  useEffect(() => {
    if (!czusdPrice || !lpCzusdBal || !lpBragBal) {
      setBragPrice("0");
      return;
    }
    const priceWad = lpCzusdBal.mul(parseEther(czusdPrice)).div(lpBragBal);
    setBragPrice(formatEther(priceWad));

  }, [czusdPrice, lpCzusdBal?.toString(), lpBragBal?.toString()]);

  useEffect(() => {
    if (!bragPrice || !bragInfo?.totalSupply || !totalRewardsPaid || !rewardPerSecond || !autoRewardPoolBtcbBal || !currentEpoch || !timestampLast) {
      setbragMcapWad(parseEther("0"));
      setbtcbTotalPaidWad(parseEther("0"));
      return;
    }
    const mcapWad = bragInfo.totalSupply.mul(parseEther(bragPrice)).div(parseEther("1"));
    setbragMcapWad(mcapWad);
    const secondsRemaining = timestampLast.add(86400 * 7).sub(currentEpoch);
    const btcbPaidUsdWad = totalRewardsPaid.add(autoRewardPoolBtcbBal).sub(rewardPerSecond.mul(secondsRemaining));
    setbtcbTotalPaidWad(btcbPaidUsdWad);
  }, [bragPrice, bragInfo?.totalSupply?.toString(), totalRewardsPaid?.toString(), autoRewardPoolBtcbBal?.toString(), rewardPerSecond?.toString(), currentEpoch?.toString(), timestampLast?.toString()]);

  useEffect(() => {
    if (!bragPrice || !totalStaked || !rewardPerSecond || totalStaked?.eq(0) || bragPrice == 0) {
      setbragAprWad(parseEther("0"));
      return;
    }
    const stakedUsd = totalStaked.mul(parseEther(bragPrice)).div(parseEther("1"));
    const usdPerDay = rewardPerSecond.mul(86400 * 365).mul(parseEther(btcbPrice ?? "0")).div(parseEther('1'));
    console.log(formatEther(usdPerDay))
    const apr = usdPerDay?.mul(parseEther("100")).div(stakedUsd) ?? BigNumber.from(0);
    console.log(formatEther(stakedUsd))
    console.log({ apr })
    setbragAprWad(apr);
  }, [bragPrice, btcbPrice, totalStaked?.toString(), rewardPerSecond?.toString()]);

  useEffect(() => {
    if (!lpBragBal || !bragInfo?.totalSupply || bragInfo.totalSupply.eq(0)) {
      setLiqRatioWad(parseEther("0"));
      return;
    }
    const ratio = lpBragBal.mul(2).mul(parseEther("100")).div(bragInfo.totalSupply);
    setLiqRatioWad(ratio);

  }, [lpBragBal?.toString(), bragInfo?.totalSupply?.toString()]);

  useEffect(() => {
    if (!czusdPrice || !lpBragBal || !lockedLpTokens || !bragInfo?.totalSupply || !bragCzusdPairInfo?.totalSupply) {
      setBragPriceFloor("0");
      return;
    }
    const lockedInvariant = lpCzusdBal.mul(lpBragBal).mul(lockedLpTokens).div(bragCzusdPairInfo.totalSupply);
    const lpCzusdBalAfterMaxSell = lockedInvariant.div(bragInfo.totalSupply);
    const priceWad = lpCzusdBalAfterMaxSell.mul(parseEther(czusdPrice)).div(bragInfo.totalSupply);
    setBragPriceFloor(formatEther(priceWad));

  }, [czusdPrice, lpCzusdBal?.toString(), lpBragBal?.toString(), lockedLpTokens?.toString(), bragInfo?.totalSupply?.toString(), bragCzusdPairInfo?.totalSupply?.toString()]);


  return (<>
    <section id="top" className="hero has-text-centered">
      <div className="m-0 p-0" style={{ position: "relative", width: "100%", height: "7.5em" }}>
        <div style={{ position: "absolute", width: "100vw", height: "7.5em", overflow: "hidden" }}>
          <img src={HeaderBanner} pstyle={{ display: "inline-block", objectFit: "cover", objectPosition: "center", width: "100vw", minWidth: "1920px", height: "7.5em", position: "absolute", left: "50%", transform: "translateX(-50%)" }} />

        </div>

        <Web3ModalButton className="mt-5 mb-5" />
        <p className='has-text-grey-lighter is-size-7 is-dark' style={{ position: "absolute", bottom: "0", left: "0", right: "0", zIndex: "2", backgroundColor: "rgba(40,14,0,0.8)" }}>
          <span className="mr-2 mb-0 is-inline-block has-text-left" style={{ width: "11em" }}>Network: {!!account ? (chainId == 56 ? (<span className="has-text-success">✓ BSC</span>) : <span className="has-text-error has-text-danger">❌NOT BSC</span>) : "..."}</span>
          <span className="mt-0 is-inline-block has-text-left" style={{ width: "11em" }}>Wallet: {!!account ? shortenAddress(account) : "..."}</span>
        </p>
      </div>
      <div className="m-0 " style={{ background: "linear-gradient(301deg, rgba(31,1,9,1) 0%, rgba(30,20,0,1) 100%)", paddingBottom: "5em", paddingTop: "1em" }}>
        <div>
          <img src={RocketBull} width={360} style={{ position: 'relative', right: '12px', transform: 'scaleX(-1)' }} />
        </div>
        {(!!currentEpoch && currentEpoch < launchEpoch) && (<>
          <h2 style={{ fontSize: '24px' }}>$BRAG LAUNCH:</h2>
          <h3 style={{ fontSize: '48px' }}>{deltaCountdown(currentEpoch, launchEpoch)}</h3>
        </>)}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", columnGap: '30px' }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <a href="https://bragbull.com" target="_blank">
              <img src={BragLogo} width={110} height={110} alt="BRAG symbol" />
            </a>
            <div>
              ${bragPrice?.substring(0, 10)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <a target="_blank" href="https://bitcoin.org">
              <img src={BtcbLogo} height={110} width={110} alt="BTCB" />
            </a>
            <div>
              ${btcbPrice}
            </div>
          </div>
        </div>
        {/* <p>Contract address</p>
        <p>Contract address</p> */}
        <br />
        {/* BUY BUTTON LINK */}
        <a target="_blank" href={czCashBuyLink(ADDRESS_BRAG)} className="button is-dark is-outlined is-large mt-0 mb-5 is-rounded" style={{ display: "block", width: "12em", border: "solid #853a12 2px", color: "white", marginLeft: "auto", marginRight: "auto", paddingTop: "0.45em" }} >
          BUY ON
          <img src={CZCashLogo} style={{ height: "1em", marginLeft: "0.1em", position: "relative", top: "0.1em" }} alt="CZ.Cash" />
        </a>
        <a target="_blank" href={SOCIAL_TELEGRAM} className="button is-dark is-outlined is-large mt-0 mb-5 is-rounded" style={{ display: "block", width: "12em", border: "solid #853a12 2px", color: "white", marginLeft: "auto", marginRight: "auto", paddingTop: "0.45em" }} >
          CHAT ROOM <span className="icon" style={{ marginLeft: '-0.25em' }}><i className="fa-brands fa-telegram"></i></span>
        </a>
        {/* Rewards Block */}
        <div className="container is-2" style={{ padding: "0 2em 2em 2em" }}>
          <h3 className="outline-text" style={{ margin: "2rem 0 2rem 0", fontSize: "2rem", fontWeight: 'normal', color: 'white', textTransform: 'uppercase', whiteSpace: "pre-line" }}>
            Your <span style={{ color: secondaryColor }}>Wallet</span>{"\n"}
            {account && <span className="is-size-5 is-block" style={{ marginTop: "-0.25em", textTransform: "none" }}>{shortenAddress(account)}</span>}
          </h3>
          {account && <button
            className="button is-dark"
            style={{
              border: "1px solid " + primaryColor,
              textTransform: "uppercase",
              backgroundColor: "rgb(135 80 4)"
            }}
            onClick={() => sendClaim()}
          >
            Claim Pending
          </button>}
          {account ?
            <div className="columns" style={{ border: "3px solid rgb(237, 209, 98)", backgroundColor: 'rgba(97, 89, 57, 0.4)', borderRadius: '1em', padding: "1.5em 1.5em 1.5em 1.5em", justifyContent: 'space-evenly' }}>
              <Stat
                color={primaryColor}
                title="Earned"
                primaryText={`${commify(formatEther((totalRewardsReceived ?? BigNumber.from("0"))))}\nBTCB`}
                secondaryText={`$ ${commify((parseFloat(formatEther((totalRewardsReceived ?? BigNumber.from("0")))) * (btcbPrice ?? 0)).toFixed(2))}`}
              />
              <Stat
                color={primaryColor}
                title="Per Day"
                primaryText={`${commify(totalStaked.gt(0) ? formatEther((rewardPerSecond?.mul(86400).mul(combinedStakedBalance ?? 0).div(totalStaked))) : 0)}\nBTCB`}
                secondaryText={`$ ${commify(totalStaked.gt(0) ? (parseFloat(formatEther((rewardPerSecond?.mul(86400).mul(combinedStakedBalance ?? 0).div(totalStaked)))) * (btcbPrice ?? 0)).toFixed(2) : 0)}`}
              />
              <Stat
                color={secondaryColor}
                title="Held"
                primaryText={`${commify(formatEther((accBtcbBal ?? BigNumber.from("0"))))}\nBTCB`}
                secondaryText={`$ ${commify((parseFloat(formatEther((accBtcbBal ?? BigNumber.from("0")))) * (btcbPrice ?? 0)).toFixed(2))}`}
              />
              <Stat
                color={secondaryColor}
                title="Pending"
                primaryText={`${commify(formatEther((pendingReward ?? BigNumber.from("0"))))}\nBTCB`}
                secondaryText={`$ ${commify((parseFloat(formatEther((pendingReward ?? BigNumber.from("0")))) * (btcbPrice ?? 0)).toFixed(2))}`}
              />
              <Stat
                color={primaryColor}
                title="BRAG Held"
                primaryText={`${commify(parseFloat(formatEther(accBragBal ?? BigNumber.from("0"))).toFixed(2))}\nBRAG`}
                secondaryText={`$ ${commify((parseFloat(formatEther(accBragBal ?? BigNumber.from("0"))) * (bragPrice ?? 0)).toFixed(2))}`}
              />
            </div>
            : <button
              className="px-6 py-3 button is-dark"
              style={{
                border: "2px solid #853a12",
                color: "white",
                fontSize: "1.5rem",
                textTransform: "uppercase",
                borderRadius: "2em",
              }}

              onClick={e => window.scrollTo({ top: 0, behaviour: "smooth" })}
            >
              Connect on top
            </button>}
          <h3 className="outline-text" style={{ margin: "2rem 0 2rem 0", fontSize: "2rem", fontWeight: 'bold', color: secondaryColor, }}>
            Rewards
          </h3>
          <div className="columns" style={{ border: "3px solid rgb(237, 209, 98)", backgroundColor: 'rgba(97, 89, 57, 0.4)', borderRadius: '1em', padding: "1.5em 1.5em 1.5em 1.5em", justifyContent: 'space-evenly' }}>
            <Stat
              color={secondaryColor}
              title="Accumulated"
              primaryText={`${commify(formatEther((btcbTotalPaidWad ?? BigNumber.from("0"))))} BTCB`}
              secondaryText={`$ ${commify((parseFloat(formatEther((btcbTotalPaidWad ?? BigNumber.from("0")))) * (btcbPrice ?? 0)).toFixed(2))}`}
            />
            <Stat
              color={secondaryColor}
              title="Distributed"
              primaryText={`${commify(formatEther((totalRewardsPaid ?? BigNumber.from("0"))))} BTCB`}
              secondaryText={`$ ${commify((parseFloat(formatEther((totalRewardsPaid ?? BigNumber.from("0")))) * (btcbPrice ?? 0)).toFixed(2))}`}
            />
            <Stat
              color={secondaryColor}
              title="Today"
              primaryText={`${commify(formatEther((rewardPerSecond ?? BigNumber.from("0"))?.mul(86400)))} BTCB`}
              secondaryText={`$ ${commify((parseFloat(formatEther((rewardPerSecond ?? BigNumber.from("0")).mul(86400))) * (btcbPrice ?? 0)).toFixed(2))}`}
            />
          </div>
          <h3 className="outline-text" style={{ margin: "2rem 0 2rem 0", fontSize: "2rem", fontWeight: 'bold', color: primaryColor, }}>
            BRAG Stats
          </h3>
          <div className="columns" style={{ border: "3px solid rgb(196, 157, 129)", backgroundColor: "rgb(66, 55, 42)", borderRadius: '1em', padding: "1.5em 1.5em 1.5em 1.5em" }}>
            <Stat
              color={secondaryColor}
              title="Market Cap"
              primaryText={`$ ${commify(formatEther(bragMcapWad)).split(".")[0]}`}
            />
            <Stat
              color={secondaryColor}
              title="Price BRAG"
              primaryText={`$ ${commify(bragPrice?.substring(0, 10))}`}
            />
            <Stat
              color={secondaryColor}
              title="Price % Diff"
              primaryText={`${weiToShortString(parseEther("100").mul(parseEther(bragPrice)).div(parseEther(INITIAL_BRAG_PRICE)).sub(parseEther("100")), 2)} %`}
            />
            <Stat
              color={secondaryColor}
              title="Floor Price"
              primaryText={`$ ${bragPriceFloor?.substring(0, 10)}`}
            />
            <Stat
              color={secondaryColor}
              title="Floor % Diff"
              primaryText={`${weiToShortString(parseEther("100").mul(parseEther(bragPriceFloor)).div(parseEther(INITIAL_BRAG_PRICE_FLOOR)).sub(parseEther("100")), 2)} %`}
            />
          </div>
          <h3 className="outline-text" style={{ margin: "2rem 0 2rem 0", fontSize: "2rem", fontWeight: 'bold', color: primaryColor, }}>
            BRAG Performance
          </h3>
          <div className="columns" style={{ border: "3px solid rgb(196, 157, 129)", backgroundColor: "rgb(66, 55, 42)", borderRadius: '1em', padding: "1.5em 1.5em 1.5em 1.5em" }}>
            <Stat
              color={secondaryColor}
              title="Burned"
              primaryText={`${commify(formatEther(INTIAL_BRAG_SUPPLY.sub(bragInfo?.totalSupply ?? INTIAL_BRAG_SUPPLY)).split(".")[0])} BRAG`}
              secondaryText={`$ ${commify((parseFloat(formatEther(INTIAL_BRAG_SUPPLY.sub(bragInfo?.totalSupply ?? INTIAL_BRAG_SUPPLY))) * (bragPrice ?? 0)).toFixed(2))}`}
            />
            <Stat
              color={secondaryColor}
              title="APR"
              primaryText={`${weiToShortString(bragAprWad, 2)} %`}
            />
            <Stat
              color={secondaryColor}
              title="Liquidity %"
              primaryText={`${weiToShortString(liqRatioWad, 2)} %`}
              secondaryText={`of MCAP`}
            />
          </div>
        </div>
      </div>
    </section>

    <Footer />

  </>);
}

export default Home
