export default function CurrencyInput(props) {
  const { currency, amount, symbols, onCurrencyChange, onAmountChange } = props;
  return (
    <div className="inputs">
      <select name="toCurrency" value={currency} onChange={onCurrencyChange}>
        {symbols &&
          Object.keys(symbols).map((key, index) => {
            return (
              <option title={symbols[key]} value={key} key={index}>
                {key}
              </option>
            );
          })}
      </select>
      <input value={amount} type="number" onChange={onAmountChange}></input>
    </div>
  );
}
