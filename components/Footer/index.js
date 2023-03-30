import React from 'react';
import { SOCIAL_GITHUB, SOCIAL_TELEGRAM, SOCIAL_TWITTER } from '../../constants/social';
import CZPower from '../../public/static/assets/images/czpower.png';

function Footer() {
  return (<footer id="footer" className="footer pb-7 mt-5" style={{ position: "relative" }}>
    <div className="content has-text-centered">
      <div>
        <a className="m-2" href={SOCIAL_TELEGRAM} target="_blank">
          <span className="icon"><i className="fa-brands fa-telegram"></i></span>
        </a>
        <a className="m-2" href={SOCIAL_TWITTER} target="_blank">
          <span className="icon"><i className="fa-brands fa-twitter"></i></span>
        </a>
        <a className="m-2" href={SOCIAL_GITHUB} target="_blank">
          <span className="icon"><i className="fa-brands fa-github"></i></span>
        </a>
      </div>
      <p className='pb-6'>
        v0.1.18
      </p>
      <p>
        AS WITH ANY BLOCKCHAIN PROJECT: <b>Do your own research before using this website or buying BRAG.</b><br />
        Nothing on this site or on related channels should be considered a promise by anyone, including but not limited to the developers and promoters of this site, to perform work to generate profits for anyone including but not limited to the following: the users of this site; Raging Bull Network community members; CZodiac community members; BRAG holders; or anyone using any of the sites, smart contracts, social media channels, and any other media or tech related to BRAG, BTCB, and CZodiac or any of the community members.
        BRAG, CZodiac, and related technologies plus media are all experimental and must be used according to your personal financial situation and risk profile.
        <br /><br />There are no guarantees of profits, but the smart contracts are guaranteed to deliver BTCB to BRAG holders as written on the BSC blockchain.
      </p>
      <a href="https://czodiac.com"><img src={CZPower} alt="Powered by CZodiac" style={{ maxWidth: "360px" }} /></a>
    </div>
  </footer>);
}

export default Footer;