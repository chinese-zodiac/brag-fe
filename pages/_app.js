import { BSC, DAppProvider } from '@usedapp/core';
import App from 'next/app';
import Head from 'next/head';
import { withRouter } from 'next/router';
import React from 'react';
import '../public/static/assets/fonts/stylesheet.css';
import Favicon from '../public/static/assets/logo.png';
import '../styles/styles.scss';

const OPENGRAPH = "https://storage.czodiac.com/plasticdigits-team-bucket/BULL%20OPENGRAPH.png";

const config = {
  readOnlyChainId: BSC.chainId,
  readOnlyUrls: {
    [BSC.chainId]: 'https://bscrpc.com'
  },
  networks: [BSC]
}

class MyApp extends App {
  static async getInitialProps(props) {
    const { Component, ctx } = props;
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <DAppProvider config={config}>
        <Head>
          <title>BRAG - Raging Bull Network: NFT DAO, BTC Rewards, and Burnpay Mechanism</title>
          <meta name="description" content="Discover BRAG, the innovative Raging Bull Network with a unique NFT DAO governance, lucrative Bitcoin rewards for holders, and an exciting Burnpay mechanism to ensure deflationary tokenomics. Join the future of crypto today!" />
          <meta name="robots" content="index, follow"></meta>
          <meta property="og:locale" content="en_EN" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="shortcut icon"
            type="image/png"
            href={Favicon}
          />

          <meta property="og:title" content="BRAG - Raging Bull Network: NFT DAO, BTC Rewards, and Burnpay Mechanism" />
          <meta property="og:site_name" content="BRAG" />
          <meta property="og:url" content="https://bragbull.com" />
          <meta property="og:description" content="Discover BRAG, the innovative Raging Bull Network with a unique NFT DAO governance, lucrative Bitcoin rewards for holders, and an exciting Burnpay mechanism to ensure deflationary tokenomics. Join the future of crypto today!" />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={OPENGRAPH} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="https://bragbull.com" />
          <meta name="twitter:title" content="BRAG - Raging Bull Network: NFT DAO, BTC Rewards, and Burnpay Mechanism" />
          <meta name="twitter:image" content={OPENGRAPH} />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="630" />
          <meta name="twitter:description" content="Discover BRAG, the innovative Raging Bull Network with a unique NFT DAO governance, lucrative Bitcoin rewards for holders, and an exciting Burnpay mechanism to ensure deflationary tokenomics. Join the future of crypto today!" />


        </Head>
        <Component {...pageProps} />
      </DAppProvider>
    );
  }
}

export default withRouter(MyApp);
