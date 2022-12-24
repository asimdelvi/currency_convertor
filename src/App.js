import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import CurrencyInput from "./currencyInput.js";

const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1";

function App() {
  const [fromCurrency, setFromCurrency] = useState("inr");
  const [toCurrency, setToCurrency] = useState("usd");
  const [rate, setRate] = useState();

  const [amount, setAmount] = useState(1);

  const [whichComponent, setWhichComponent] = useState(0);

  const [symbols, setSymbols] = useState();
  const renderCount = useRef(0);

  let fromAmount, toAmount;
  if (whichComponent === 0) {
    fromAmount = amount;
    toAmount = (rate * amount).toFixed(3);
  } else if (whichComponent === 1) {
    toAmount = amount;
    fromAmount = (amount / rate).toFixed(3);
  }

  async function fetchSymbol() {
    const res = await fetch(`${BASE_URL}/latest/currencies.json`);
    const data = await res.json();
    return setSymbols(data);
  }

  async function fetchConverted(from, to) {
    const res = await fetch(`${BASE_URL}/latest/currencies/${from}/${to}.json`);
    const data = await res.json();
    return setRate(data[to]);
  }

  useEffect(() => {
    fetchSymbol();
  }, []);

  useEffect(() => {
    fetchConverted(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    renderCount.current += 1;
  });

  const onAmountChange = (e, comp) => {
    setAmount(parseFloat(e.target.value));
    setWhichComponent(comp);
  };

  return (
    <div className="App">
      <h1 id="heading">Convert</h1>

      <CurrencyInput
        currency={fromCurrency}
        symbols={symbols}
        amount={fromAmount}
        onCurrencyChange={(e) => {
          setFromCurrency(e.target.value);
        }}
        onAmountChange={(e) => onAmountChange(e, 0)}
      />

      <CurrencyInput
        currency={toCurrency}
        symbols={symbols}
        amount={toAmount}
        onCurrencyChange={(e) => {
          setToCurrency(e.target.value);
        }}
        onAmountChange={(e) => onAmountChange(e, 1)}
      />

      <div>Render Count: {renderCount.current}</div>
    </div>
  );
}

export default App;

// TODO: Add comments, document the code, optimize
