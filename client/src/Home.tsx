import React from "react";
import { Card, ProgressCircular, Table } from "ui-neumorphism";
export function Home({ assets, balance, unconfirmedBalance }) {
  const headers = [
    { text: "Asset name", align: "left", value: "link" },
    { text: "Balance", align: "right", value: "balance" },
  ];

  assets = assets.map(function(asset){

    //https://cloudflare-ipfs.com/ipfs/QmSX9GJ3a3yRaL5FrXcpQXRoGVCuXWrymAiB7pxoPcQ9TB

    asset.link = asset.ipfs_hash ? <a target="ipfs" href={"https://cloudflare-ipfs.com/ipfs/" + asset.ipfs_hash}>{asset.name}</a> : asset.name

    return asset;
  })

  const items = assets;
  const balanceFormatted = new Intl.NumberFormat("en-IN").format(
    parseFloat(balance)
  );
  return (
    <div className="padding-default">
      <Card className="raven-rebels-ego-wallet__balance padding-default">
        <h2>RVN</h2>
        {balanceFormatted}

        {unconfirmedBalance !== 0 && (
          <div className="padding-default">
            <ProgressCircular indeterminate color="var(--primary)" />
            Incoming: <i>{unconfirmedBalance} RVN</i>
          </div>
        )}
      </Card>
     
      <Table headers={headers} items={items} />
    </div>
  );
}
