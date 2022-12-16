import "./App.css";
import React, { useEffect, useState, useRef } from "react";

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

  return (
    <div className="App">
      <h1 id="heading">Convert</h1>

      <div className="inputs">
        <select
          name="fromCurrency"
          value={fromCurrency}
          title={fromCurrency}
          onChange={(e) => {
            setFromCurrency(e.target.value);
          }}
        >
          {symbols &&
            Object.keys(symbols).map((key, index) => {
              return (
                <option title={symbols[key]} value={key} key={index}>
                  {key}
                </option>
              );
            })}
        </select>
        <input
          value={fromAmount}
          type="number"
          onChange={(e) => {
            setAmount(parseInt(e.target.value));
            setWhichComponent(0);
          }}
        ></input>
      </div>

      <div className="inputs">
        <select
          name="toCurrency"
          value={toCurrency}
          onChange={(e) => {
            setToCurrency(e.target.value);
          }}
        >
          {symbols &&
            Object.keys(symbols).map((key, index) => {
              return (
                <option title={symbols[key]} value={key} key={index}>
                  {key}
                </option>
              );
            })}
        </select>
        <input
          value={toAmount}
          type="number"
          onChange={(e) => {
            setAmount(parseInt(e.target.value));
            setWhichComponent(1);
          }}
        ></input>
      </div>
      <div>Render Count: {renderCount.current}</div>
    </div>
  );
}

export default App;

// TODO: Separate the components
// TODO: Decimal value to input
// TODO: Add comments, document the code
