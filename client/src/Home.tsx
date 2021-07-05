import React from "react";
import { Card, Table } from "ui-neumorphism";
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
    <div className="home padding-default">
      <Card className="balance padding-default">
        <h2>RVN</h2>
        {balanceFormatted}
        {unconfirmedBalance !== 0 && (
          <p className="blink_me">
            <label>Incoming..</label>
            <i>{unconfirmedBalance}</i>
          </p>
        )}
      </Card>

      <Table headers={headers} items={items} />
    </div>
  );
}
