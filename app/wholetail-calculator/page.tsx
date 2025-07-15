"use client"

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function WholetailCalculator() {
  const [asIsValue, setAsIsValue] = useState(325000);

  const [closingBuyPct, setClosingBuyPct] = useState(0.015); // 1.5% default
  const [closingSellPct, setClosingSellPct] = useState(0.015); // 1.5% default
  const [closingBuyAmt, setClosingBuyAmt] = useState(Math.round(asIsValue * closingBuyPct));
  const [closingSellAmt, setClosingSellAmt] = useState(Math.round(asIsValue * closingSellPct));
  const [cleanUpPct, setCleanUpPct] = useState(0.01);
  const [listAgentPct, setListAgentPct] = useState(0.01);
  const [buyerAgentPct, setBuyerAgentPct] = useState(0.03);
  const [fundingPct, setFundingPct] = useState(0.03);
  const [wholesaleFeePct, setWholesaleFeePct] = useState(0.03);
  const [profitPct, setProfitPct] = useState(0.19);

  const [firstLoanPct, setFirstLoanPct] = useState(0.8);
  const [secondLoanPct, setSecondLoanPct] = useState(0.2);
  const [months, setMonths] = useState(2);

  // Editable points and interest for both positions
  const [firstPointsPct, setFirstPointsPct] = useState(0.02);
  const [firstInterestPct, setFirstInterestPct] = useState(0.12);
  const [secondPointsPct, setSecondPointsPct] = useState(0.02);
  const [secondInterestPct, setSecondInterestPct] = useState(0.12);

  const [adjustmentPct, setAdjustmentPct] = useState(0.1);

  const closingFees = closingBuyAmt + closingSellAmt;
  const cleanUpCost = asIsValue * cleanUpPct;
  const listAgentFee = asIsValue * listAgentPct;
  const buyerAgentFee = asIsValue * buyerAgentPct;
  const fundingCost = asIsValue * fundingPct;
  const profit = asIsValue * profitPct;
  const wholesaleFee = asIsValue * wholesaleFeePct;

  const totalCostPct = closingBuyPct + closingSellPct + cleanUpPct + listAgentPct + buyerAgentPct + fundingPct + wholesaleFeePct + profitPct;

  const totalCost =
    closingBuyAmt +
    closingSellAmt +
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
  const domValues = soldComps.map(comp => comp.date ? daysBetween(comp.date) : 0);
  const avgDays = domValues.length ? domValues.reduce((a, b) => a + b, 0) / domValues.length : 0;

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
  const domActiveValues = arvActiveComps.map(comp => comp.date ? daysBetween(comp.date) : 0);
  const avgArvActiveDays = domActiveValues.length ? domActiveValues.reduce((a, b) => a + b, 0) / domActiveValues.length : 0;

  // At the top, add a helper to calculate days between dates
  function daysBetween(dateString: string) {
    const today = new Date();
    const soldDate = new Date(dateString);
    const diffTime = today.getTime() - soldDate.getTime();
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  }

  const [arvMarketPrior, setArvMarketPrior] = useState(0);
  const [arvMarketCurrent, setArvMarketCurrent] = useState(0);
  const [showFunding, setShowFunding] = useState(false);

  // For each buy formula item, add state for the amount and update bidirectional logic
  // Closing Fees
  // Clean Up
  const [cleanUpAmt, setCleanUpAmt] = useState(Math.round(asIsValue * cleanUpPct));
  // List Agent
  const [listAgentAmt, setListAgentAmt] = useState(Math.round(asIsValue * listAgentPct));
  // Buyer Agent
  const [buyerAgentAmt, setBuyerAgentAmt] = useState(Math.round(asIsValue * buyerAgentPct));
  // Funding
  const [fundingAmt, setFundingAmt] = useState(Math.round(asIsValue * fundingPct));
  // Wholesale Fee
  const [wholesaleFeeAmt, setWholesaleFeeAmt] = useState(Math.round(asIsValue * wholesaleFeePct));
  // Profit
  const [profitAmt, setProfitAmt] = useState(Math.round(asIsValue * profitPct));

  // Bidirectional logic for each row
  const handlePctChange = (
    setterPct: React.Dispatch<React.SetStateAction<number>>,
    setterAmt: React.Dispatch<React.SetStateAction<number>>,
    pct: number,
    base: number
  ) => {
    setterPct(pct);
    setterAmt(Math.round(base * pct));
  };
  const handleAmtChange = (
    setterAmt: React.Dispatch<React.SetStateAction<number>>,
    setterPct: React.Dispatch<React.SetStateAction<number>>,
    amt: number,
    base: number
  ) => {
    setterAmt(amt);
    setterPct(base > 0 ? amt / base : 0);
  };

  return (
    <div className="p-4 sm:p-6 w-full sm:max-w-xl md:max-w-5xl lg:max-w-7xl sm:mx-auto">
      <div className="sm:max-w-xl sm:mx-auto">
        <div className="text-lg sm:text-2xl font-bold mb-4 text-center">Wholetail Offer Calculator</div>
        <div className='mb-4'>
          <label className="block font-medium">As-Is Value</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
            <input
              type="text"
              value={Number.isNaN(asIsValue) ? '' : asIsValue.toLocaleString('en-US')}
              onChange={e => {
                // Remove all non-numeric
                const raw = e.target.value.replace(/[^\d]/g, '');
                setAsIsValue(Number(raw));
              }}
              className="border rounded p-2 w-full pl-7 text-right"
              inputMode="numeric"
            />
          </div>
        </div>
        
        <hr className="my-6" />

        {/* BUY FORMULA SECTION */}
        <div className="font-bold text-blue-700 mt-10 mb-2 text-center text-xl">Soft Costs</div>      
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b">
              <th className="w-[44%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Item</th>
              <th className="w-[18%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Percent</th>
              <th className="w-[38%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Closing Costs (Buy)</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="1" min="0" max="100" value={Math.round(closingBuyPct * 100)} onChange={e => handlePctChange(setClosingBuyPct, setClosingBuyAmt, Number(e.target.value) / 100, asIsValue)} className="border rounded px-0.5 py-1 w-16 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <input type="text" min="0" value={closingBuyAmt.toLocaleString('en-US')} onChange={e => handleAmtChange(setClosingBuyAmt, setClosingBuyPct, Number(e.target.value.replace(/[^\d]/g, '')), asIsValue)} className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Closing Costs (Sell)</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="1" min="0" max="100" value={Math.round(closingSellPct * 100)} onChange={e => handlePctChange(setClosingSellPct, setClosingSellAmt, Number(e.target.value) / 100, asIsValue)} className="border rounded px-0.5 py-1 w-16 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <input type="text" min="0" value={closingSellAmt.toLocaleString('en-US')} onChange={e => handleAmtChange(setClosingSellAmt, setClosingSellPct, Number(e.target.value.replace(/[^\d]/g, '')), asIsValue)} className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Trash/Clean/Minor repairs</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="1" min="0" max="100" value={Math.round(cleanUpPct * 100)} onChange={e => handlePctChange(setCleanUpPct, setCleanUpAmt, Number(e.target.value) / 100, asIsValue)} className="border rounded px-0.5 py-1 w-16 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <input type="text" min="0" value={cleanUpAmt.toLocaleString('en-US')} onChange={e => handleAmtChange(setCleanUpAmt, setCleanUpPct, Number(e.target.value.replace(/[^\d]/g, '')), asIsValue)} className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">List Agent</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="1" min="0" max="100" value={Math.round(listAgentPct * 100)} onChange={e => handlePctChange(setListAgentPct, setListAgentAmt, Number(e.target.value) / 100, asIsValue)} className="border rounded px-0.5 py-1 w-16 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <input type="text" min="0" value={listAgentAmt.toLocaleString('en-US')} onChange={e => handleAmtChange(setListAgentAmt, setListAgentPct, Number(e.target.value.replace(/[^\d]/g, '')), asIsValue)} className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Buyer Agent</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="1" min="0" max="100" value={Math.round(buyerAgentPct * 100)} onChange={e => handlePctChange(setBuyerAgentPct, setBuyerAgentAmt, Number(e.target.value) / 100, asIsValue)} className="border rounded px-0.5 py-1 w-16 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <input type="text" min="0" value={buyerAgentAmt.toLocaleString('en-US')} onChange={e => handleAmtChange(setBuyerAgentAmt, setBuyerAgentPct, Number(e.target.value.replace(/[^\d]/g, '')), asIsValue)} className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Loan Cost</td>
              <td className="text-center py-1 px-0.5">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={Math.round(fundingPct * 100)}
                  onChange={e => handlePctChange(setFundingPct, setFundingAmt, Number(e.target.value) / 100, asIsValue)}
                  className="border rounded px-0.5 py-1 w-16 text-right text-[10px] sm:text-sm"
                />
              </td>
              <td className="text-right">
                <input type="text" min="0" value={fundingAmt.toLocaleString('en-US')} onChange={e => handleAmtChange(setFundingAmt, setFundingPct, Number(e.target.value.replace(/[^\d]/g, '')), asIsValue)} className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm" />
              </td>
            </tr>                      
            <tr className="border-b font-bold">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Total Soft Costs</td>
              <td className="text-center py-1 px-0.5 text-[10px] sm:text-sm text-right">
                {(totalCostPct * 100).toFixed(2)}%
              </td>
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${totalCost.toLocaleString('en-US')}
                </span>
              </td>
            </tr>
          </tbody>          
        </table>

        {/* AS-IS COMPS SECTION */}
        <div className="my-10">
          <div className="font-bold text-blue-700 my-2 text-center text-xl">As-Is Comps</div>
          <div className="text-center text-gray-500 text-sm mb-4">
            * As-is value is the average of the comps entered
          </div>
          {/* Solds Table */}
          <div className="font-bold text-red-700 mb-1">Sold</div>
          <div className="overflow-x-auto md:overflow-visible w-full">
            <table className="w-full min-w-[700px] table-fixed">
              <thead>
                <tr className="border-b">
                  <th className="w-[20%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Address</th>
                  <th className="w-[13%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sq. Ft.</th>
                  <th className="w-[17%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold Price</th>
                  <th className="w-[15%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">$/Sq. Ft.</th>
                  <th className="w-28 text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold Date</th>
                  <th className="w-[15%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">DOM</th>
                </tr>
              </thead>
              <tbody>
                {soldComps.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-0.5 py-1">
                      <input
                        type="text"
                        value={row.address}
                        className="w-24 sm:w-32 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].address = e.target.value;
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1">
                      <input
                        type="number"
                        value={row.sqft}
                        min={0}
                        className="w-14 sm:w-20 border rounded px-0.5 py-1 text-right text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].sqft = Number(e.target.value);
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1">
                      <input
                        type="number"
                        value={row.price}
                        min={0}
                        className="w-20 sm:w-28 border rounded px-0.5 py-1 text-right text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].price = Number(e.target.value);
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1 bg-green-100 text-green-900 font-bold text-right text-[10px] sm:text-sm">{row.sqft ? `$${(row.price / row.sqft).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}</td>
                    <td className="border px-0.5 py-1">
                      <input
                        type="date"
                        value={row.date}
                        className="w-28 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...soldComps];
                          newComps[i].date = e.target.value;
                          setSoldComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1 bg-green-100 text-green-900 font-bold text-center text-[10px] sm:text-sm">{daysBetween(row.date)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right" colSpan={1}>Average</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right">{avgSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right">${avgPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right">${avgSoldPerSqft.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1"></td>
                  <td className="border px-0.5 py-1 text-right">{avgDays ? Math.round(avgDays) : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-[16px] sm:text-base">As-Is Value</span>
            <span className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
              ${avgPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>

          {/* Actives Table */}
          <div className="font-bold text-red-700 mb-1 mt-5">Actives</div>
          <div className="overflow-x-auto md:overflow-visible w-full">
            <table className="w-full min-w-[700px] table-fixed">
              <thead>
                <tr className="border-b">
                  <th className="w-[20%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Address</th>
                  <th className="w-[13%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sq. Ft.</th>
                  <th className="w-[17%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">List Price</th>
                  <th className="w-[15%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">List/Sq. Ft</th>
                  <th className="w-28 text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">List Date</th>
                  <th className="w-[15%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Days</th>
                </tr>
              </thead>
              <tbody>
                {arvActiveComps.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-0.5 py-1">
                      <input
                        type="text"
                        value={row.address}
                        className="w-24 sm:w-32 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...arvActiveComps];
                          newComps[i].address = e.target.value;
                          setArvActiveComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1">
                      <input
                        type="number"
                        value={row.sqft}
                        min={0}
                        className="w-14 sm:w-20 border rounded px-0.5 py-1 text-right text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...arvActiveComps];
                          newComps[i].sqft = Number(e.target.value);
                          setArvActiveComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1">
                      <input
                        type="number"
                        value={row.price}
                        min={0}
                        className="w-20 sm:w-28 border rounded px-0.5 py-1 text-right text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...arvActiveComps];
                          newComps[i].price = Number(e.target.value);
                          setArvActiveComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1 bg-green-100 text-green-900 font-bold text-right text-[10px] sm:text-sm">
                      {row.sqft ? `$${(row.price / row.sqft).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}
                    </td>
                    <td className="border px-0.5 py-1">
                      <input
                        type="date"
                        value={row.date}
                        className="w-28 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
                        onChange={e => {
                          const newComps = [...arvActiveComps];
                          newComps[i].date = e.target.value;
                          setArvActiveComps(newComps);
                        }}
                      />
                    </td>
                    <td className="border px-0.5 py-1 bg-green-100 text-green-900 font-bold text-center text-[10px] sm:text-sm">{daysBetween(row.date)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right" colSpan={1}>Average</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right">{avgArvActiveSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right">${avgArvActivePrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm text-right">${avgArvActivePerSqft.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1"></td>
                  <td className="border px-0.5 py-1 text-right">{avgArvActiveDays ? Math.round(avgArvActiveDays) : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-[16px] sm:text-base">As-Is Value</span>
            <span className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
              ${avgArvActivePrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>

          {/* Market Adjustment */}
          <div className="mt-6">
            <div className="font-bold text-red-700 mb-1">Market Adjustment (15 day sale)</div>          
            <div className="space-y-2">
              {/* Combined Value */}
              <div className="flex justify-between items-center">
                <span className="text-[16px] sm:text-base font-bold">Combined Value</span>
                <span className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
                  ${((avgPrice + avgArvActivePrice) / 2).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              {/* Adjustment */}
              <div className="flex justify-between items-center">
                <span className="text-[16px] sm:text-base font-bold">Adjustment</span>
                <div className="relative w-24">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={(adjustmentPct * 100).toFixed(2)}
                    onChange={e => setAdjustmentPct(Number(e.target.value) / 100)}
                    className="border rounded px-1 py-1 pr-6 text-center text-[10px] sm:text-sm w-full"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] sm:text-sm pointer-events-none">%</span>
                </div>
              </div>
              {/* Adjusted As-Is Value */}
              <div className="flex justify-between items-center">
                <span className="text-[16px] sm:text-base font-bold">Adjusted AS-IS Value</span>
                <span className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
                  ${(((avgPrice + avgArvActivePrice) / 2) * (1 - adjustmentPct)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* MAO SECTION */}
        <div className="my-10">
          <div className="font-bold text-green-700 my-2 text-center text-xl">Maximum Allowable Offer (MAO)</div>
          <div className="flex justify-between items-center mt-6">
            <div className="font-bold text-[14px] sm:text-base">Max Allowable Offer (MAO)</div>
            <div className="flex items-center gap-2">
              <div className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
                  ${maxOffer.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
              <div className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
                {asIsValue > 0 ? `${((maxOffer / asIsValue) * 100).toFixed(0)}%` : '0%'}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* FUNDING SECTION (Collapsible) */}
        <div className="my-10">
          <button
            type="button"
            className="flex items-center gap-2 w-full text-left font-bold text-blue-700 text-xl focus:outline-none"
            onClick={() => setShowFunding((v) => !v)}
          >
            <span className={`transition-transform duration-200 ${showFunding ? "rotate-90" : "rotate-0"}`}>
              <ChevronRight className="w-6 h-6" />
            </span>
            <span>Funding</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${showFunding ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
            {/* 1st Position */}
            <div className="font-bold text-blue-700 mb-1 mt-4">1st Position</div>
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b">
                  <th className="w-[34%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Expense Item</th>
                  <th className="w-[18%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Percent</th>
                  <th className="w-[28%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Amount</th>
                  <th className="w-[20%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Months</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Total Capital</td>
                  <td></td>
                  <td className="text-right">
                    <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                      ${totalCapital.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td></td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Loan-to-Capital</td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="0.01" min="0" max="100" value={(firstLoanPct*100).toFixed(2)} 
                      onChange={e => setFirstLoanPct(Number(e.target.value)/100)} 
                      className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
                  </td>
                  
                  <td className="text-right">
                    <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                      ${firstLoan.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td></td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Points</td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="0.01" min="0" max="100" value={(firstPointsPct*100).toFixed(2)} 
                      onChange={e => setFirstPointsPct(Number(e.target.value)/100)} 
                      className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
                  </td>
                  <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                    ${firstPoints.toLocaleString('en-US')}
                  </span>
                </td>
                  <td></td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Interest</td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="0.01" min="0" max="100" value={(firstInterestPct*100).toFixed(2)} 
                      onChange={e => setFirstInterestPct(Number(e.target.value)/100)} 
                      className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
                  </td>
                  <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                    ${firstInterest.toLocaleString('en-US')}
                  </span>
                </td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="1" min="0" value={months} 
                      onChange={e => setMonths(Number(e.target.value))} 
                      className="border rounded px-0.5 py-1 w-10 sm:w-20 text-center text-[10px] sm:text-sm" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Misc. Fee</td>
                  <td></td>
                  <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                    ${firstMiscFee.toLocaleString('en-US')}
                  </span>
                </td>
                  <td></td>
                </tr>
              </tbody>          
            </table>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-[10px] sm:text-sm">Total Cost 1st Position</span>
              <span className="bg-green-300 text-green-900 font-bold px-1.5 py-0.5 rounded text-[10px] sm:text-base">
                ${firstTotal.toLocaleString('en-US')}
              </span>
            </div>

            {/* 2nd Position */}
            <div className="font-bold text-blue-700 mb-1 mt-6">2nd Position</div>
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b">
                  <th className="w-[34%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Expense Item</th>
                  <th className="w-[18%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Percent</th>
                  <th className="w-[28%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Amount</th>
                  <th className="w-[20%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Months</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Total Capital</td>
                  <td></td>
                  <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                    ${totalCapital.toLocaleString('en-US')}
                  </span>
                </td>
                  <td></td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Loan-to-Capital</td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="0.01" min="0" max="100" value={(secondLoanPct*100).toFixed(2)} 
                      onChange={e => setSecondLoanPct(Number(e.target.value)/100)} 
                      className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
                  </td>
                  <td className="text-right">
                    <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                      ${secondLoan.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td></td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Points</td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="0.01" min="0" max="100" value={(secondPointsPct*100).toFixed(2)} 
                      onChange={e => setSecondPointsPct(Number(e.target.value)/100)} 
                      className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
                  </td>
                  <td className="text-right">
                    <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                      ${secondPoints.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td></td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Interest</td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="0.01" min="0" max="100" value={(secondInterestPct*100).toFixed(2)} 
                      onChange={e => setSecondInterestPct(Number(e.target.value)/100)} 
                      className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
                  </td>
                  <td className="text-right">
                    <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                      ${secondInterest.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td className="text-center py-1 px-0.5">
                    <input type="number" step="1" min="0" value={months} onChange={e => setMonths(Number(e.target.value))} className="border rounded px-0.5 py-1 w-10 sm:w-20 text-center text-[10px] sm:text-sm" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 px-0.5 text-[10px] sm:text-sm">Misc. Fee</td>
                  <td></td>
                  <td className="text-right">
                    <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                      ${secondMiscFee.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tbody>          
            </table>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-[10px] sm:text-sm">Total Cost 2nd Position</span>
              <span className="bg-green-300 text-green-900 font-bold px-1.5 py-0.5 rounded text-[10px] sm:text-base">${secondTotal.toLocaleString('en-US')}</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-[16px] sm:text-base">Total Funding</span>
              <div className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
                ${totalFunding.toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
