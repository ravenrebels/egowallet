import React from "react";

import { result as transactionsResult } from "./Transactions.test";

function addTestResult(description, outcome) {
  const main = document.createElement("div");
  const descriptionDiv = document.createElement("div");
  const resultDiv = document.createElement("div");
  main.append(descriptionDiv);
  main.append(resultDiv);

  descriptionDiv.classList.add("description");
  resultDiv.classList.add("result");

  descriptionDiv.innerText = description;
  resultDiv.innerText = outcome.result;

  //Add fat red border if test fails

  main.style.border = outcome.result === true ? "" : "3px solid red";

  document.body.appendChild(main);
}

addTestResult("Transactions", transactionsResult);
