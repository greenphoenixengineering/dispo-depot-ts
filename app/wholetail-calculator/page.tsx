"use client"

import { useState } from 'react';

export default function WholetailCalculator() {
  const [asIsValue, setAsIsValue] = useState(325000);
  const [wholesaleFee, setWholesaleFee] = useState(0);

  const [closingFeePct, setClosingFeePct] = useState(0.03);
  const [cleanUpPct, setCleanUpPct] = useState(0.01);
  const [listAgentPct, setListAgentPct] = useState(0.01);
  const [buyerAgentPct, setBuyerAgentPct] = useState(0.03);
  const [fundingPct, setFundingPct] = useState(0.03);
  const [profitPct, setProfitPct] = useState(0.19);

  const [firstLoanPct, setFirstLoanPct] = useState(0.8);
  const [secondLoanPct, setSecondLoanPct] = useState(0.2);
  const [months, setMonths] = useState(2);

  // Editable points and interest for both positions
  const [firstPointsPct, setFirstPointsPct] = useState(0.02);
  const [firstInterestPct, setFirstInterestPct] = useState(0.12);
  const [secondPointsPct, setSecondPointsPct] = useState(0.02);
  const [secondInterestPct, setSecondInterestPct] = useState(0.12);

  const closingFees = asIsValue * closingFeePct;
  const cleanUpCost = asIsValue * cleanUpPct;
  const listAgentFee = asIsValue * listAgentPct;
  const buyerAgentFee = asIsValue * buyerAgentPct;
  const fundingCost = asIsValue * fundingPct;
  const profit = asIsValue * profitPct;

  const totalCost =
    closingFees +
    cleanUpCost +
    listAgentFee +
    buyerAgentFee +
    fundingCost +
    wholesaleFee +
    profit;

  const maxOffer = asIsValue - totalCost;

  // Funding Section
  const totalCapital = 227500;

  // 1st Position
  const firstLoan = totalCapital * firstLoanPct;
  const firstPoints = firstLoan * firstPointsPct;
  const firstInterest = (firstLoan * firstInterestPct * months) / 12;
  const firstMiscFee = 0;
  const firstTotal = firstPoints + firstInterest + firstMiscFee;

  // 2nd Position
  const secondLoan = totalCapital * secondLoanPct;
  const secondPoints = secondLoan * secondPointsPct;
  const secondInterest = (secondLoan * secondInterestPct * months) / 12;
  const secondMiscFee = 0;
  const secondTotal = secondPoints + secondInterest + secondMiscFee;

  const totalFunding = firstTotal + secondTotal;

  const compsSoldPrices = [400000, 425000, 400000, 375000];
  const compsListPrices = [220000, 215000, 225000, 215000];
  const compsSoldSqft = [267, 304, 235, 227];
  const compsListSqft = [147, 154, 132, 130];
  const avgListPrice = compsListPrices.reduce((a, b) => a + b) / compsListPrices.length;
  const adjustmentPct = 0.1;
  const adjustedAsIsValue = avgListPrice * (1 - adjustmentPct);

  const arv = 195000;
  const repairCost = 45000;
  const exitPct = 0.7;
  const wholesaleTargetFee = 20000;
  const exitValue = arv * exitPct - repairCost;
  const maxBuy = exitValue - wholesaleTargetFee;
  const maxBuyPct = maxBuy / arv;

  const [soldComps, setSoldComps] = useState([
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
  ]);

  const [arvSoldComps, setArvSoldComps] = useState([
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
  ]);

  const [arvActiveComps, setArvActiveComps] = useState([
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
    { address: '', sqft: 0, price: 0, date: '', days: 0 },
  ]);

  // Calculate averages for soldComps
  const avgSqft = soldComps.length ? 
    soldComps.reduce((a, b) => a + b.sqft, 0) / soldComps.filter(comp => comp.sqft > 0).length || 0 : 0;
  const avgPrice = soldComps.length ? 
    soldComps.reduce((a, b) => a + b.price, 0) / soldComps.filter(comp => comp.price > 0).length || 0 : 0;
  const avgSoldPerSqft = soldComps.length ? 
    soldComps.filter(comp => comp.sqft > 0 && comp.price > 0)
      .reduce((a, b) => a + (b.price / b.sqft), 0) / soldComps.filter(comp => comp.sqft > 0 && comp.price > 0).length || 0 : 0;
  const avgDays = soldComps.length ? 
    soldComps.reduce((a, b) => a + daysBetween(b.date), 0) / soldComps.filter(comp => comp.date).length || 0 : 0;

  // Calculate averages for ARV sold comps
  const avgArvSoldSqft = arvSoldComps.length ? 
    arvSoldComps.reduce((a, b) => a + b.sqft, 0) / arvSoldComps.filter(comp => comp.sqft > 0).length || 0 : 0;
  const avgArvSoldPrice = arvSoldComps.length ? 
    arvSoldComps.reduce((a, b) => a + b.price, 0) / arvSoldComps.filter(comp => comp.price > 0).length || 0 : 0;
  const avgArvSoldPerSqft = arvSoldComps.length ? 
    arvSoldComps.filter(comp => comp.sqft > 0 && comp.price > 0)
      .reduce((a, b) => a + (b.price / b.sqft), 0) / arvSoldComps.filter(comp => comp.sqft > 0 && comp.price > 0).length || 0 : 0;
  const avgArvSoldDays = arvSoldComps.length ? 
    arvSoldComps.reduce((a, b) => a + daysBetween(b.date), 0) / arvSoldComps.filter(comp => comp.date).length || 0 : 0;

  // Calculate averages for ARV active comps
  const avgArvActiveSqft = arvActiveComps.length ? 
    arvActiveComps.reduce((a, b) => a + b.sqft, 0) / arvActiveComps.filter(comp => comp.sqft > 0).length || 0 : 0;
  const avgArvActivePrice = arvActiveComps.length ? 
    arvActiveComps.reduce((a, b) => a + b.price, 0) / arvActiveComps.filter(comp => comp.price > 0).length || 0 : 0;
  const avgArvActivePerSqft = arvActiveComps.length ? 
    arvActiveComps.filter(comp => comp.sqft > 0 && comp.price > 0)
      .reduce((a, b) => a + (b.price / b.sqft), 0) / arvActiveComps.filter(comp => comp.sqft > 0 && comp.price > 0).length || 0 : 0;
  const avgArvActiveDays = arvActiveComps.length ? 
    arvActiveComps.reduce((a, b) => a + daysBetween(b.date), 0) / arvActiveComps.filter(comp => comp.date).length || 0 : 0;

  // At the top, add a helper to calculate days between dates
  function daysBetween(dateString: string) {
    const today = new Date();
    const soldDate = new Date(dateString);
    const diffTime = today.getTime() - soldDate.getTime();
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="w-full sm:max-w-3xl sm:mx-auto p-2 sm:p-6">
      <h1 className="p-2 sm:p-6 text-2xl font-bold mb-4">Wholetail Offer Calculator</h1>
      <div className="p-2 sm:p-6 space-y-4">        

        {/* Inputs */}
        <div>
          <label className="block font-medium">Adjusted As-Is Value ($)</label>
          <input
            type="number"
            value={asIsValue}
            onChange={(e) => setAsIsValue(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Wholesale Fee ($)</label>
          <input
            type="number"
            value={wholesaleFee}
            onChange={(e) => setWholesaleFee(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>

        <hr />

        <div className="p-2 sm:p-6 mb-8">
          <div className="font-bold text-blue-700 mb-2">Buy Formula</div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Adjusted As-Is Value</span>
            <span className="bg-green-500 text-white font-bold px-4 py-1 rounded text-lg">${asIsValue.toLocaleString()}</span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[2fr_110px_120px] gap-x-2 gap-y-0 mb-2 items-center border-b font-semibold text-gray-700">
            <span className="pl-6 min-w-[200px] w-2/5 py-2">Item</span>
            <span className="text-center w-24 py-2">Percentage</span>
            <span className="text-right w-28 py-2">Amount</span>
          </div>

          {/* Table body */}
          <div className="grid grid-cols-[2fr_110px_120px] gap-x-2 gap-y-0 mb-2 items-center">
            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Closing Fees (buy/sell)</span>
            <input type="number" step="0.01" min="0" max="100" value={(closingFeePct*100).toFixed(2)} onChange={e => setClosingFeePct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${closingFees.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Trash/Clean/Insurance</span>
            <input type="number" step="0.01" min="0" max="100" value={(cleanUpPct*100).toFixed(2)} onChange={e => setCleanUpPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${cleanUpCost.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">List Agent</span>
            <input type="number" step="0.01" min="0" max="100" value={(listAgentPct*100).toFixed(2)} onChange={e => setListAgentPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${listAgentFee.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Buyer Agent</span>
            <input type="number" step="0.01" min="0" max="100" value={(buyerAgentPct*100).toFixed(2)} onChange={e => setBuyerAgentPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${buyerAgentFee.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Funding</span>
            <input type="number" step="0.01" min="0" max="100" value={(fundingPct*100).toFixed(2)} onChange={e => setFundingPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${fundingCost.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Wholesale Fee</span>
            <span></span>
            <span className="text-right w-28 py-2">${wholesaleFee.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Profit</span>
            <input type="number" step="0.01" min="0" max="100" value={(profitPct*100).toFixed(2)} onChange={e => setProfitPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${profit.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <span className="font-bold">Max Allowable Offer (MAO)</span>
            <span className="font-bold text-lg bg-green-300 text-green-900 px-4 py-1 rounded">
              ${maxOffer.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}
            </span>
          </div>
        </div>

        <hr className="my-6" />

        {/* FUNDING SECTION */}
        <div className="p-2 sm:p-6 mb-8">
          <div className="font-bold text-blue-700 mb-2 text-lg">Funding</div>

          {/* 1st Position */}
          <div className="font-bold text-blue-700 mb-1 ml-2">1st Position</div>
          {/* Table header */}
          <div className="grid grid-cols-[2fr_80px_110px_120px] gap-x-2 gap-y-0 mb-2 items-center border-b font-semibold text-gray-700">
            <span className="pl-6 min-w-[200px] w-2/5 py-2">Item</span>
            <span className="text-center w-20 py-2">Months</span>
            <span className="text-center w-24 py-2">Percentage</span>
            <span className="text-right w-28 py-2">Amount</span>
          </div>
          {/* Table body */}
          <div className="grid grid-cols-[2fr_80px_110px_120px] gap-x-2 gap-y-0 mb-2 items-center">
            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Total Capital</span>
            <span></span>
            <span></span>
            <span className="text-right w-28 py-2">${totalCapital.toLocaleString()}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Loan-to-Capital</span>
            <span></span>
            <input type="number" step="0.01" min="0" max="100" value={(firstLoanPct*100).toFixed(2)} onChange={e => setFirstLoanPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${firstLoan.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Points</span>
            <span></span>
            <input type="number" step="0.01" min="0" max="100" value={(firstPointsPct*100).toFixed(2)} onChange={e => setFirstPointsPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${firstPoints.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Interest</span>
            <input type="number" step="1" min="0" value={months} onChange={e => setMonths(Number(e.target.value))} className="border rounded px-2 py-1 w-20 text-center" />
            <input type="number" step="0.01" min="0" max="100" value={(firstInterestPct*100).toFixed(2)} onChange={e => setFirstInterestPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${firstInterest.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Misc. Fee</span>
            <span></span>
            <span></span>
            <span className="text-right w-28 py-2">${firstMiscFee.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="font-bold pl-6 min-w-[200px] w-2/5 py-2">Total Cost 1st Position</span>
            <span></span>
            <span></span>
            <span className="bg-green-300 text-green-900 font-bold px-2 py-1 rounded text-right w-28">${firstTotal.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>
          </div>

          {/* 2nd Position */}
          <div className="font-bold text-blue-700 mb-1 ml-2 mt-4">2nd Position</div>
          {/* Table header */}
          <div className="grid grid-cols-[2fr_80px_110px_120px] gap-x-2 gap-y-0 mb-2 items-center border-b font-semibold text-gray-700">
            <span className="pl-6 min-w-[200px] w-2/5 py-2">Item</span>
            <span className="text-center w-20 py-2">Months</span>
            <span className="text-center w-24 py-2">Percentage</span>
            <span className="text-right w-28 py-2">Amount</span>
          </div>
          {/* Table body */}
          <div className="grid grid-cols-[2fr_80px_110px_120px] gap-x-2 gap-y-0 mb-2 items-center">
            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Total Capital</span>
            <span></span>
            <span></span>
            <span className="text-right w-28 py-2">${totalCapital.toLocaleString()}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Loan-to-Capital</span>
            <span></span>
            <input type="number" step="0.01" min="0" max="100" value={(secondLoanPct*100).toFixed(2)} onChange={e => setSecondLoanPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${secondLoan.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Points</span>
            <span></span>
            <input type="number" step="0.01" min="0" max="100" value={(secondPointsPct*100).toFixed(2)} onChange={e => setSecondPointsPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${secondPoints.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Interest</span>
            <input type="number" step="1" min="0" value={months} onChange={e => setMonths(Number(e.target.value))} className="border rounded px-2 py-1 w-20 text-center" />
            <input type="number" step="0.01" min="0" max="100" value={(secondInterestPct*100).toFixed(2)} onChange={e => setSecondInterestPct(Number(e.target.value)/100)} className="border rounded px-2 py-1 w-24 text-right" />
            <span className="text-right w-28 py-2">${secondInterest.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="pl-6 min-w-[200px] w-2/5 text-gray-700 py-2">Misc. Fee</span>
            <span></span>
            <span></span>
            <span className="text-right w-28 py-2">${secondMiscFee.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>

            <span className="font-bold pl-6 min-w-[200px] w-2/5 py-2">Total Cost 2nd Position</span>
            <span></span>
            <span></span>
            <span className="bg-green-300 text-green-900 font-bold px-2 py-1 rounded text-right w-28">${secondTotal.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>
          </div>

          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <span className="font-bold">Total Funding</span>
            <span className="bg-green-500 text-white font-bold px-4 py-1 rounded text-lg">${totalFunding.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span>
          </div>
        </div>

        <hr className="my-6" />

        {/* AS-IS COMPS SECTION */}
        <div className="p-2 sm:p-6 mb-8">
          <div className="font-bold text-blue-700 mb-2 text-lg">As-Is Comps</div>
          {/* Solds Table */}
          <div className="font-bold text-red-600 mb-1 ml-2">Sold</div>
          <div className="overflow-x-auto w-full">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">                  
                  <th className="border px-2 py-1">Address</th>
                  <th className="border px-2 py-1">Sq. Ft.</th>
                  <th className="border px-2 py-1">Sold Price</th>
                  <th className="border px-2 py-1">Sold/Sq. Ft</th>
                  <th className="border px-2 py-1">Sold Date</th>
                  <th className="border px-2 py-1">Days</th>
                </tr>
              </thead>
              <tbody>
                {soldComps.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={row.address}
                        className="w-32 border rounded px-1 py-0.5"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].address = e.target.value;
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.sqft}
                        min={0}
                        className="w-20 border rounded px-1 py-0.5 text-right"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].sqft = Number(e.target.value);
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.price}
                        min={0}
                        className="w-28 border rounded px-1 py-0.5 text-right"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].price = Number(e.target.value);
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 bg-green-100 text-green-900 font-bold text-right">${row.sqft ? (row.price / row.sqft).toLocaleString(undefined, {maximumFractionDigits:0}) : ''}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        value={row.date}
                        className="w-32 border rounded px-1 py-0.5"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].date = e.target.value;
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 bg-green-100 text-green-900 font-bold">{daysBetween(row.date)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border px-2 py-1" colSpan={1}>Average</td>
                  <td className="border px-2 py-1">{avgSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1">${avgPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1">${avgSoldPerSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1"></td>
                  <td className="border px-2 py-1">{avgDays.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">Sold As-Is Value</span>
            <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded">${avgPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
          </div>

          {/* Active Table */}
          <div className="font-bold text-red-600 mb-1 ml-2">Active</div>
          <div className="overflow-x-auto w-full">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">                  
                  <th className="border px-2 py-1">Address</th>
                  <th className="border px-2 py-1">Sq. Ft.</th>
                  <th className="border px-2 py-1">Sold Price</th>
                  <th className="border px-2 py-1">Sold/Sq. Ft</th>
                  <th className="border px-2 py-1">Sold Date</th>
                  <th className="border px-2 py-1">Days</th>
                </tr>
              </thead>
              <tbody>
                {soldComps.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={row.address}
                        className="w-32 border rounded px-1 py-0.5"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].address = e.target.value;
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.sqft}
                        min={0}
                        className="w-20 border rounded px-1 py-0.5 text-right"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].sqft = Number(e.target.value);
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.price}
                        min={0}
                        className="w-28 border rounded px-1 py-0.5 text-right"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].price = Number(e.target.value);
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 bg-green-100 text-green-900 font-bold text-right">${row.sqft ? (row.price / row.sqft).toLocaleString(undefined, {maximumFractionDigits:0}) : ''}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        value={row.date}
                        className="w-32 border rounded px-1 py-0.5"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].date = e.target.value;
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 bg-green-100 text-green-900 font-bold">{daysBetween(row.date)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border px-2 py-1" colSpan={1}>Average</td>
                  <td className="border px-2 py-1">{avgSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1">${avgPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1">${avgSoldPerSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1"></td>
                  <td className="border px-2 py-1">{avgDays.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">Sold As-Is Value</span>
            <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded">${avgPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
          </div>
        </div>

        <hr className="my-6" />

        <div className="p-2 sm:p-6 bg-white max-w-full overflow-x-auto mb-8">
          <div className="text-blue-800 font-bold text-lg sm:text-xl mb-2 tracking-wide">ARV Formula</div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <span className="font-bold text-black text-lg">ARV</span>
              <span className="bg-green-300 text-black font-bold px-6 py-1 rounded text-lg ml-auto min-w-[120px] text-right">${arv.toLocaleString()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <span className="font-bold text-black text-lg">Repair Cost</span>
              <span className="font-bold text-black text-lg ml-auto min-w-[120px] text-right">${repairCost.toLocaleString()}</span>
            </div>
            <div className="w-full mb-2">
              <table className="w-full border border-black">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 font-bold text-black text-left">Condition</th>
                    <th className="border border-black px-2 py-1 font-bold text-black text-right">Cost/Sqft</th>
                    <th className="border border-black px-2 py-1 font-bold text-black text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 text-black">Light</td>
                    <td className="border border-black px-2 py-1 text-right">$10.00</td>
                    <td className="border border-black px-2 py-1 text-right bg-green-300 font-bold">$0</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 text-black">Average</td>
                    <td className="border border-black px-2 py-1 text-right">$25.00</td>
                    <td className="border border-black px-2 py-1 text-right bg-green-300 font-bold">$0</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 text-black">Heavy</td>
                    <td className="border border-black px-2 py-1 text-right">$50.00</td>
                    <td className="border border-black px-2 py-1 text-right bg-green-300 font-bold">$0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 mt-4">
              <span className="font-bold text-black text-lg">Exit (ARV - Repairs)</span>
              <span className="font-bold text-black text-lg ml-auto min-w-[60px] text-right">70%</span>
              <span className="bg-green-300 text-black font-bold px-6 py-1 rounded text-lg ml-2 min-w-[120px] text-right">${exitValue.toLocaleString()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <span className="font-bold text-black text-lg">Gross Wholesale Fee</span>
              <span className="font-bold text-black text-lg ml-auto min-w-[120px] text-right">${wholesaleTargetFee.toLocaleString()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
              <span className="font-bold text-black text-lg">Max Buy</span>
              <span className="bg-green-300 text-black font-bold px-6 py-1 rounded text-lg ml-auto min-w-[120px] text-right">${maxBuy.toLocaleString()}</span>
              <span className="bg-green-300 text-black font-bold px-6 py-1 rounded text-lg ml-2 min-w-[80px] text-right">{(maxBuyPct * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* ARV COMPS SECTION */}
        <div className="p-2 sm:p-6 mb-8">
          <div className="font-bold text-blue-700 mb-2 text-lg">ARV Comps</div>                    
          <div className="overflow-x-auto w-full">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">                  
                  <th className="border px-2 py-1">Address</th>
                  <th className="border px-2 py-1">Sq. Ft.</th>
                  <th className="border px-2 py-1">Sold Price</th>
                  <th className="border px-2 py-1">Sold/Sq. Ft</th>
                  <th className="border px-2 py-1">Sold Date</th>
                  <th className="border px-2 py-1">Days</th>
                </tr>
              </thead>
              <tbody>
                {arvSoldComps.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={row.address}
                        className="w-32 border rounded px-1 py-0.5"
                        onChange={e => {
                          const newComps = [...arvSoldComps];
                          newComps[i].address = e.target.value;
                          setArvSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.sqft}
                        min={0}
                        className="w-20 border rounded px-1 py-0.5 text-right"
                        onChange={e => {
                          const newComps = [...arvSoldComps];
                          newComps[i].sqft = Number(e.target.value);
                          setArvSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={row.price}
                        min={0}
                        className="w-28 border rounded px-1 py-0.5 text-right"
                        onChange={e => {
                          const newComps = [...arvSoldComps];
                          newComps[i].price = Number(e.target.value);
                          setArvSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 bg-green-100 text-green-900 font-bold text-right">${row.sqft ? (row.price / row.sqft).toLocaleString(undefined, {maximumFractionDigits:0}) : ''}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        value={row.date}
                        className="w-32 border rounded px-1 py-0.5"
                        onChange={e => {
                          const newComps = [...arvSoldComps];
                          newComps[i].date = e.target.value;
                          setArvSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-2 py-1 bg-green-100 text-green-900 font-bold">{daysBetween(row.date)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border px-2 py-1" colSpan={1}>Average</td>
                  <td className="border px-2 py-1">{avgArvSoldSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1">${avgArvSoldPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1">${avgArvSoldPerSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-2 py-1"></td>
                  <td className="border px-2 py-1">{avgArvSoldDays.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">ARV Value (Sold)</span>
            <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded">${avgArvSoldPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
