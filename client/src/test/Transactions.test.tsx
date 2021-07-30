import React from "react";
import TestRenderer from "react-test-renderer";
import { Transactions } from "../Transactions";

const mock = {
  "83ea86c5ab671eb380fdc9d8a586f7b272c59027f7524ada542e736d77b056e3": {
    amount: 1,
    "bip125-replaceable": "no",
    blockhash:
      "0000000000010503c11e2b9ad6cd5625811338a23007a0b46779dbbd59487a27",
    blockindex: 3,
    blocktime: 1627541149,
    confirmations: 0,
    details: [
      {
        account: "",
        address: "REPhbepHjRQTG3aSxgX7zqi96uqg3LpPjV",
        amount: 1,
        category: "receive",
        label: "",
        vout: 0,
      },
    ],
    time: 1627541105,
    timereceived: 1627541105,
    txid: "83ea86c5ab671eb380fdc9d8a586f7b272c59027f7524ada542e736d77b056e3",
  },
  a66257ac7656c1c60e75992079bb9c4903c017172e1c1d2118ee9e173a6a7862: {
    amount: 0,
    asset_details: [
      {
        abandoned: false,
        amount: 1,
        asset_name: "BEER_TOKEN",
        asset_type: "transfer_asset",
        category: "receive",
        destination: "REPhbepHjRQTG3aSxgX7zqi96uqg3LpPjV",
        message: "",
        vout: 1,
      },
    ],
    "bip125-replaceable": "no",
    blockhash:
      "0000000000001dbb226e410b660831f881e42b1698d59e51c7f2153d96a98da6",
    blockindex: 7,
    blocktime: 1627540755,
    confirmations: 1,
    time: 1627540619,
    timereceived: 1627540619,
    txid: "a66257ac7656c1c60e75992079bb9c4903c017172e1c1d2118ee9e173a6a7862",
  },
  b0210653e5dcbd3293e2828d27809c71ee7db0f9d73aabc4c4eeea477f6d05b9: {
    amount: 0,
    asset_details: [
      {
        abandoned: false,
        amount: 1,
        asset_name: "BEER_TOKEN",
        asset_type: "transfer_asset",
        category: "send",
        destination: "RNTdmFsfHDpTtKpRhtBxbUXt461ywgk8yh",
        message: "",
        vout: 0,
      },
    ],
    "bip125-replaceable": "no",
    blockhash:
      "000000000000b0005f4bf75fdcfea7d2600028848acd1f05be1fac7f5faa8099",
    blockindex: 3,
    blocktime: 1627538879,
    confirmations: 1,
    fee: -0.00406704,
    time: 1627538846,
    timereceived: 1627538846,
    txid: "b0210653e5dcbd3293e2828d27809c71ee7db0f9d73aabc4c4eeea477f6d05b9",
  },
  f2424e145af9777b16444db5d6a694128434ecf0fdda7fb7c1d6a89717182d62: {
    amount: 0,
    asset_details: [
      {
        abandoned: false,
        amount: 1,
        asset_name: "CATE",
        asset_type: "transfer_asset",
        category: "receive",
        destination: "REPhbepHjRQTG3aSxgX7zqi96uqg3LpPjV",
        message: "",
        vout: 1,
      },
    ],
    "bip125-replaceable": "no",
    confirmations: 0,
    time: 1627540705,
    timereceived: 1627540705,
    trusted: false,
    txid: "f2424e145af9777b16444db5d6a694128434ecf0fdda7fb7c1d6a89717182d62",
  },
  f51b80a716d74364ec57578a4faeb55b1e571b4bf28daa3813887a0d41bb1ab9: {
    amount: -1,
    "bip125-replaceable": "no",
    blockhash:
      "0000000000001eba2b54eca47a7d2cddbee02d35d3fb9344e417e041085e732f",
    blockindex: 3,
    blocktime: 1627542843,
    comment: "-Mfl63hpto_7dS7CWhmD",
    confirmations: 1,
    details: [
      {
        abandoned: false,
        account: "",
        address: "RNTdmFsfHDpTtKpRhtBxbUXt461ywgk8yh",
        amount: -1,
        category: "send",
        fee: -0.00380604,
        vout: 1,
      },
    ],
    fee: -0.00380604,
    time: 1627542801,
    timereceived: 1627542801,
    txid: "f51b80a716d74364ec57578a4faeb55b1e571b4bf28daa3813887a0d41bb1ab9",
  },
};

const testRenderer = TestRenderer.create(<Transactions transactions={mock} />);
 
export const result = {
  result: testRenderer.toJSON().props["data-has-pending-transactions"] === true,
};
