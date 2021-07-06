import React from "react";
import { Card, ProgressCircular, Table } from "ui-neumorphism";
export function Home({ assets, balance, unconfirmedBalance }) {
  const headers = [
    { text: "Asset name", align: "left", value: "name" },
    { text: "Balance", align: "right", value: "balance" },
  ];

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
