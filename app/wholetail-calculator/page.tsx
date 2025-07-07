"use client"

import { useState } from 'react';

export default function WholetailCalculator() {
  const [asIsValue, setAsIsValue] = useState(325000);

  const [closingFeePct, setClosingFeePct] = useState(0.03);
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

  const closingFees = asIsValue * closingFeePct;
  const cleanUpCost = asIsValue * cleanUpPct;
  const listAgentFee = asIsValue * listAgentPct;
  const buyerAgentFee = asIsValue * buyerAgentPct;
  const fundingCost = asIsValue * fundingPct;
  const profit = asIsValue * profitPct;
  const wholesaleFee = asIsValue * wholesaleFeePct;

  const totalCostPct = closingFeePct + cleanUpPct + listAgentPct + buyerAgentPct + fundingPct + wholesaleFeePct + profitPct;

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

  const [arvMarketPrior, setArvMarketPrior] = useState(0);
  const [arvMarketCurrent, setArvMarketCurrent] = useState(0);

  return (
    <div className="p-4 sm:p-6 w-full sm:max-w-xl md:max-w-5xl lg:max-w-7xl sm:mx-auto">
      <div className="sm:max-w-xl sm:mx-auto">
        <div className="text-lg sm:text-2xl font-bold mb-4 text-center">Wholetail Offer Calculator</div>
        <div className='mb-4'>
          <label className="block font-medium">Adjusted As-Is Value ($)</label>
          <input
            type="number"
            value={asIsValue}
            onChange={(e) => setAsIsValue(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>
        
        <hr className="my-6" />

        {/* BUY FORMULA SECTION */}
        <div className="font-bold text-blue-700 mt-10 mb-2 text-center text-xl">Buy Formula</div>      
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
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Closing Fees (buy/sell)</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="0.01" min="0" max="100" 
                  value={(closingFeePct*100).toFixed(2)} 
                  onChange={e => setClosingFeePct(Number(e.target.value)/100)} 
                  className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${closingFees.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Trash/Clean/Insurance</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="0.01" min="0" max="100" value={(cleanUpPct*100).toFixed(2)} onChange={e => setCleanUpPct(Number(e.target.value)/100)} className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${cleanUpCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">List Agent</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="0.01" min="0" max="100" value={(listAgentPct*100).toFixed(2)} onChange={e => setListAgentPct(Number(e.target.value)/100)} className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${listAgentFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Buyer Agent</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="0.01" min="0" max="100" value={(buyerAgentPct*100).toFixed(2)} onChange={e => setBuyerAgentPct(Number(e.target.value)/100)} className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
              </td>
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${buyerAgentFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Loan Cost</td>
              <td className="text-center py-1 px-0.5">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={(fundingPct*100).toFixed(2)}
                  onChange={e => setFundingPct(Number(e.target.value)/100)}
                  className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm"
                />
              </td>
              <td className="text-right">
                <input
                  type="number"
                  min="0"
                  value={fundingCost.toFixed(2)}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setFundingPct(asIsValue > 0 ? val / asIsValue : 0);
                  }}
                  className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Wholesale Fee</td>
              <td className="text-center py-1 px-0.5">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={(wholesaleFeePct * 100).toFixed(2)}
                  onChange={e => setWholesaleFeePct(Number(e.target.value) / 100)}
                  className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm"
                />
              </td>
              <td className="text-right">
                <input
                  type="number"
                  min="0"
                  value={wholesaleFee.toFixed(2)}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setWholesaleFeePct(asIsValue > 0 ? val / asIsValue : 0);
                  }}
                  className="border rounded px-0.5 py-1 w-24 text-right text-[10px] sm:text-sm"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Profit</td>
              <td className="text-center py-1 px-0.5">
                <input type="number" step="0.01" min="0" max="100" value={(profitPct*100).toFixed(2)} onChange={e => setProfitPct(Number(e.target.value)/100)} className="border rounded px-0.5 py-1 w-12 sm:w-24 text-right text-[10px] sm:text-sm" />
              </td>              
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${profit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
            </tr>
            <tr className="border-b font-bold">
              <td className="py-1 px-0.5 text-[10px] sm:text-sm">Totals</td>
              <td className="text-center py-1 px-0.5 text-[10px] sm:text-sm text-right">
                {(totalCostPct * 100).toFixed(2)}%
              </td>
              <td className="text-right">
                <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-[10px] sm:text-sm">
                  ${totalCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
            </tr>
          </tbody>          
        </table>
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

        <hr className="my-6" />

        {/* FUNDING SECTION */}
        <div className="my-10">
          <div className="font-bold text-blue-700 my-2 text-center text-xl">Funding</div>
          {/* 1st Position */}
          <div className="font-bold text-blue-700 mb-1">1st Position</div>
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
                    ${totalCapital.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    ${firstLoan.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                  ${firstPoints.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                  ${firstInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                  ${firstMiscFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </td>
                <td></td>
              </tr>
            </tbody>          
          </table>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-[10px] sm:text-sm">Total Cost 1st Position</span>
            <span className="bg-green-300 text-green-900 font-bold px-1.5 py-0.5 rounded text-[10px] sm:text-base">
              ${firstTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                  ${totalCapital.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    ${secondLoan.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    ${secondPoints.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    ${secondInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    ${secondMiscFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </td>
                <td></td>
              </tr>
            </tbody>          
          </table>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-[10px] sm:text-sm">Total Cost 2nd Position</span>
            <span className="bg-green-300 text-green-900 font-bold px-1.5 py-0.5 rounded text-[10px] sm:text-base">${secondTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-[16px] sm:text-base">Total Funding</span>
            <div className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">
              ${totalFunding.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* AS-IS COMPS SECTION */}
        <div className="my-10">
          <div className="font-bold text-blue-700 my-2 text-center text-xl">As-Is Comps</div>          
          
          {/* Solds Table */}
          <div className="font-bold text-red-700 mb-1">Sold</div>
          <div className="overflow-x-auto md:overflow-visible w-full">
            <table className="w-full min-w-[700px] table-fixed">
              <thead>
                <tr className="border-b">
                  <th className="w-[20%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Address</th>
                  <th className="w-[13%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sq. Ft.</th>
                  <th className="w-[17%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold Price</th>
                  <th className="w-[15%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold/Sq. Ft</th>
                  <th className="w-[20%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold Date</th>
                  <th className="w-[15%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Days</th>
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
                        className="w-24 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
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
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm" colSpan={1}>Average</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm">{avgSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm">${avgPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm">${avgSoldPerSqft.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1"></td>
                  <td className="border px-0.5 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-[16px] sm:text-base">Sold As-Is Value</span>
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
                  <th className="w-[20%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">List Date</th>
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
                        className="w-24 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
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
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm" colSpan={1}>Average</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm">{avgArvActiveSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm">${avgArvActivePrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1 text-[10px] sm:text-sm">${avgArvActivePerSqft.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border px-0.5 py-1"></td>
                  <td className="border px-0.5 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-[16px] sm:text-base">Active As-Is Value</span>
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

        <div className="sm:max-w-xl sm:mx-auto">
          {/* ARV FORMULA SECTION */}
          <div className="my-10">
            <div className="font-bold text-blue-700 my-2 text-center text-xl">ARV Formula</div>

            {/* ARV Row */}
            <div className="flex justify-between items-center my-5">
              <span className="text-[16px] sm:text-base font-bold">ARV</span>
              <span className="font-bold bg-green-300 text-green-900 px-1.5 py-0.5 rounded text-[10px] sm:text-lg">${arv.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>          

            {/* Repair Cost Table */}
            <div className="mb-4">
              <div className="text-[16px] sm:text-base mb-3 font-bold">Repair Cost</div>
              <table className="w-full table-fixed ">
                <thead>
                  <tr className="border-b">
                    <th className="w-[40%] text-left py-1 px-0.5 text-[10px] sm:text-sm ">Condition</th>
                    <th className="w-[30%] text-center py-1 px-0.5 text-[10px] sm:text-sm">Cost/SqFt</th>
                    <th className="w-[30%] text-right py-1 px-0.5 text-[10px] sm:text-sm ">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 px-0.5 text-[10px] sm:text-sm ">Light</td>
                    <td className="text-center py-1 px-0.5">
                      <input type="number" step="0.01" min="0" value={10.00} className="border rounded px-0.5 py-1 w-16 sm:w-24 text-right text-[10px] sm:text-sm" readOnly />
                    </td>
                    <td className="text-right py-1 px-0.5 bg-green-200 text-green-900 text-[10px] sm:text-sm">$0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-0.5 text-[10px] sm:text-sm">Average</td>
                    <td className="text-center py-1 px-0.5">
                      <input type="number" step="0.01" min="0" value={25.00} className="border rounded px-0.5 py-1 w-16 sm:w-24 text-right text-[10px] sm:text-sm" readOnly />
                    </td>
                    <td className="text-right py-1 px-0.5 bg-green-200 text-green-900 text-[10px] sm:text-sm">$0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-0.5 text-[10px] sm:text-sm">Heavy</td>
                    <td className="text-center py-1 px-0.5">
                      <input type="number" step="0.01" min="0" value={50.00} className="border rounded px-0.5 py-1 w-16 sm:w-24 text-right text-[10px] sm:text-sm" readOnly />
                    </td>
                    <td className="text-right py-1 px-0.5 bg-green-200 text-green-900 text-[10px] sm:text-sm">$0.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4 border-t pt-4">
                <span className="text-[12px] sm:text-sm">Total Repair Cost</span>
                <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-sm">${repairCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>            
            </div>

            {/* EXIT (ARV - REPAIRS) */}
            <div className="flex justify-between items-center mt-4 pt-4">
              <span className="font-bold text-[14px] sm:text-base">EXIT (ARV - Repairs)</span>
              <div className="flex items-center gap-2 w-24 sm:w-28">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={(exitPct * 100).toFixed(2)}
                  onChange={e => {
                    const val = Number(e.target.value) / 100;
                    if (!isNaN(val)) {
                      // @ts-ignore
                      window.exitPct = val; // for debugging
                    }
                  }}
                  className="border rounded px-1 py-1 text-center text-[10px] sm:text-base w-full"
                  style={{minWidth: '3.5rem'}}
                />
                <span className="text-[10px] sm:text-base">%</span>
              </div>
              <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-base">${exitValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>

            {/* Gross Wholesale Fee */}
            <div className="flex justify-between items-center mt-4 pt-4">
              <span className="font-bold text-[16px] sm:text-base">Gross Wholesale Fee</span>
              <input
                type="text"
                value={`$${wholesaleTargetFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                className="border rounded px-2 py-1 text-right text-[10px] sm:text-base w-24 sm:w-32"
                readOnly
              />
            </div>

            {/* Max Buy */}
            <div className="flex justify-between items-center mt-4 pt-4">
              <span className="font-bold text-[14px] sm:text-base">Max Buy</span>
              <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-base w-24 sm:w-28 text-center">${maxBuy.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-base w-24 sm:w-28 text-center">{(maxBuyPct * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      {/* ARV Comps */}
      <div className="my-10">
        <div className="font-bold text-blue-700 my-2 text-center text-xl">ARV Comps</div>          
        <div className="overflow-x-auto md:overflow-visible w-full">
          <table className="w-full min-w-[700px] table-fixed">
            <thead>
              <tr className="border-b">
                <th className="w-[20%] text-left py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Address</th>
                <th className="w-[13%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sq. Ft.</th>
                <th className="w-[17%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold Price</th>
                <th className="w-[15%] text-right py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold/Sq. Ft</th>
                <th className="w-[20%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Sold Date</th>
                <th className="w-[15%] text-center py-1 px-0.5 text-[10px] sm:text-sm font-semibold">Days</th>
              </tr>
            </thead>
            <tbody>
              {arvSoldComps.map((row, i) => (
                <tr key={i}>
                  <td className="border px-0.5 py-1">
                    <input
                      type="text"
                      value={row.address}
                      className="w-24 sm:w-32 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
                      onChange={e => {
                        const newComps = [...arvSoldComps];
                        newComps[i].address = e.target.value;
                        setArvSoldComps(newComps);
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
                        const newComps = [...arvSoldComps];
                        newComps[i].sqft = Number(e.target.value);
                        setArvSoldComps(newComps);
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
                        const newComps = [...arvSoldComps];
                        newComps[i].price = Number(e.target.value);
                        setArvSoldComps(newComps);
                      }}
                    />
                  </td>
                  <td className="border px-0.5 py-1 bg-green-100 text-green-900 font-bold text-right text-[10px] sm:text-sm">{row.sqft ? `$${(row.price / row.sqft).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}</td>
                  <td className="border px-0.5 py-1">
                    <input
                      type="date"
                      value={row.date}
                      className="w-24 border rounded px-0.5 py-1 text-[10px] sm:text-sm"
                      onChange={e => {
                        const newComps = [...arvSoldComps];
                        newComps[i].date = e.target.value;
                        setArvSoldComps(newComps);
                      }}
                    />
                  </td>
                  <td className="border px-0.5 py-1 bg-green-100 text-green-900 font-bold text-center text-[10px] sm:text-sm">{daysBetween(row.date)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border px-0.5 py-1 text-[10px] sm:text-sm" colSpan={1}>Average</td>
                <td className="border px-0.5 py-1 text-[10px] sm:text-sm bg-green-300 text-green-900">{avgArvSoldSqft.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                <td className="border px-0.5 py-1 text-[10px] sm:text-sm bg-green-300 text-green-900">${avgArvSoldPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="border px-0.5 py-1 text-[10px] sm:text-sm bg-green-300 text-green-900">${avgArvSoldPerSqft.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="border px-0.5 py-1"></td>
                <td className="border px-0.5 py-1 bg-green-300 text-green-900">{avgArvSoldDays.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ARV Average Price (Price/Sqft) and Market Adjustment */}
        <div className="mb-8">
          {/* ARV Average Price */}
          <div className="flex justify-between items-center mt-6">
            <span className="font-bold text-[14px] sm:text-base">ARV Average Price (Price/Sqft)</span>
            <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-base">
              ${avgArvSoldPerSqft && avgArvSoldSqft ? (avgArvSoldPerSqft * avgArvSoldSqft).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '$0.00'}
            </span>
          </div>

          {/* ARV Market Adjustment */}
          <div className="mt-6">
            <div className="font-bold text-[14px] sm:text-base mb-2">ARV Market Adjustment</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
              <span className="text-[12px] sm:text-base">6 mo prior</span>                
              <input
                type="number"
                value={arvMarketPrior}
                onChange={e => setArvMarketPrior(Number(e.target.value))}
                className="border rounded px-2 py-1 text-right text-[10px] sm:text-base w-full"
                min={0}
              />
              <span className="text-[12px] sm:text-base">Current</span>
              <input
                type="number"
                value={arvMarketCurrent}
                onChange={e => setArvMarketCurrent(Number(e.target.value))}
                className="border rounded px-2 py-1 text-right text-[10px] sm:text-base w-full"
                min={0}
              />
              <span className="font-bold text-[12px] sm:text-base">Gain/Loss</span>
              <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-base text-center">
                {arvMarketPrior > 0 ? `${(((arvMarketCurrent - arvMarketPrior) / arvMarketPrior) * 100).toFixed(0)}%` : '0%'}
              </span>
              <span className="font-bold text-[12px] sm:text-base">Adjusted ARV</span>
              <span className="bg-green-300 text-green-900 font-bold px-4 py-1 rounded text-[10px] sm:text-base text-center">
                ${arvMarketCurrent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
