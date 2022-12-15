import "./App.css";
import React, { useEffect, useState, useRef } from "react";

function App() {
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");

  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(1);

  const [whichComponent, setWhichComponent] = useState(0);

  const [symbols, setSymbols] = useState();
  const renderCount = useRef(0);

  async function fetchSymbol() {
    const res = await fetch(
      "https://api.apilayer.com/exchangerates_data/symbols",
      {
        headers: {
          apikey: process.env.REACT_APP_CURRENCY_API_KEY,
        },
      }
    );
    const data = await res.json();
    return setSymbols(data.symbols);
  }

  async function fetchConverted(amount, from, to) {
    const res = await fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
      {
        headers: {
          apikey: process.env.REACT_APP_CURRENCY_API_KEY,
        },
      }
    );
    const data = await res.json();
    return data.result;
  }

  // ! component is rerendering multiple times (4 times)
  useEffect(() => {
    fetchSymbol();
  }, []);

  useEffect(() => {
    let res;
    if (whichComponent === 0) {
      res = fetchConverted(fromAmount, fromCurrency, toCurrency);
      setToAmount(res);
      console.log("toAmt");
    } else if (whichComponent === 1) {
      res = fetchConverted(toAmount, toCurrency, fromCurrency);
      setFromAmount(res);
      console.log("fromAmt");
    }
  }, [fromAmount, fromCurrency, whichComponent, toCurrency, toAmount]);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div className="App">
      <h id="heading">Convert</h>

      <div class="inputs">
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
            setFromAmount(parseInt(e.target.value));
            setWhichComponent(0);
          }}
        ></input>
      </div>

      <div class="inputs">
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
          type="number"
          value={toAmount}
          onChange={(e) => {
            setToAmount(parseInt(e.target.value));
            setWhichComponent(1);
          }}
        ></input>
      </div>
      <div>Render Count: {renderCount.current}</div>
    </div>
  );
}

export default App;
