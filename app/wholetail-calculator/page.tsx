"use client"

import { useState } from 'react';

export default function WholetailCalculator() {
  const [asIsValue, setAsIsValue] = useState(325000);
  const [wholesaleFee, setWholesaleFee] = useState(0);

  const closingFeePct = 0.03;
  const cleanUpPct = 0.01;
  const listAgentPct = 0.01;
  const buyerAgentPct = 0.03;
  const fundingPct = 0.03;
  const profitPct = 0.19;

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

  // Funding Section - Constants for now, but can be made editable
  const totalCapital = 227500;
  const months = 2;

  // 1st Position
  const firstLoanPct = 0.8;
  const firstLoan = totalCapital * firstLoanPct;
  const firstPoints = firstLoan * 0.02;
  const firstInterest = (firstLoan * 0.12 * months) / 12;
  const firstMiscFee = 0;
  const firstTotal = firstPoints + firstInterest + firstMiscFee;

  // 2nd Position
  const secondLoanPct = 0.2;
  const secondLoan = totalCapital * secondLoanPct;
  const secondPoints = secondLoan * 0.02;
  const secondInterest = (secondLoan * 0.12 * months) / 12;
  const secondMiscFee = 0;
  const secondTotal = secondPoints + secondInterest + secondMiscFee;

  const totalFunding = firstTotal + secondTotal;

  const compsSoldPrices = [400000, 425000, 400000, 375000];
  const compsListPrices = [220000, 215000, 225000, 215000];
  const compsSoldSqft = [267, 304, 235, 227];
  const compsListSqft = [147, 154, 132, 130];
  const avgSoldPrice = compsSoldPrices.reduce((a, b) => a + b) / compsSoldPrices.length;
  const avgListPrice = compsListPrices.reduce((a, b) => a + b) / compsListPrices.length;
  const combinedValue = (avgSoldPrice + avgListPrice) / 2;
  const adjustmentPct = 0.1;
  const adjustedAsIsValue = combinedValue * (1 - adjustmentPct);

  const arv = 195000;
  const repairCost = 45000;
  const exitPct = 0.7;
  const wholesaleTargetFee = 20000;
  const exitValue = arv * exitPct - repairCost;
  const maxBuy = exitValue - wholesaleTargetFee;
  const maxBuyPct = maxBuy / arv;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Wholetail Offer Calculator</h1>
      <div className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div>Closing Fees (3%)</div>
          <div>${closingFees.toFixed(2)}</div>
          <div>Trash/Clean/Insurance (1%)</div>
          <div>${cleanUpCost.toFixed(2)}</div>
          <div>List Agent Fee (1%)</div>
          <div>${listAgentFee.toFixed(2)}</div>
          <div>Buyer Agent Fee (3%)</div>
          <div>${buyerAgentFee.toFixed(2)}</div>
          <div>Funding Cost (3%)</div>
          <div>${fundingCost.toFixed(2)}</div>
          <div>Profit (19%)</div>
          <div>${profit.toFixed(2)}</div>
        </div>

        <hr />

        <div className="font-semibold text-lg">
          Max Allowable Offer: ${maxOffer.toFixed(2)}
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-bold">Funding Breakdown</h2>

        <h3 className="font-semibold mt-4">1st Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>Loan-to-Capital (80%)</div>
          <div>${firstLoan.toFixed(2)}</div>
          <div>Points (2%)</div>
          <div>${firstPoints.toFixed(2)}</div>
          <div>Interest (12% for 2 months)</div>
          <div>${firstInterest.toFixed(2)}</div>
          <div>Misc. Fee</div>
          <div>${firstMiscFee.toFixed(2)}</div>
          <div className="font-medium">Total 1st Position</div>
          <div className="font-medium">${firstTotal.toFixed(2)}</div>
        </div>

        <h3 className="font-semibold mt-4">2nd Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>Loan-to-Capital (20%)</div>
          <div>${secondLoan.toFixed(2)}</div>
          <div>Points (2%)</div>
          <div>${secondPoints.toFixed(2)}</div>
          <div>Interest (12% for 2 months)</div>
          <div>${secondInterest.toFixed(2)}</div>
          <div>Misc. Fee</div>
          <div>${secondMiscFee.toFixed(2)}</div>
          <div className="font-medium">Total 2nd Position</div>
          <div className="font-medium">${secondTotal.toFixed(2)}</div>
        </div>

        <div className="mt-4 font-semibold text-lg">
          Total Funding Cost: ${totalFunding.toFixed(2)}
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-bold">As-Is Comps</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Sold As-Is Value</div>
          <div>$421,643</div>
          <div>Active As-Is Value</div>
          <div>$229,802</div>
          <div>Combined Value</div>
          <div>${combinedValue.toFixed(2)}</div>
          <div>Adjustment (10%)</div>
          <div>{(adjustmentPct * 100).toFixed(0)}%</div>
          <div className="font-medium">Adjusted As-Is Value</div>
          <div className="font-medium">${adjustedAsIsValue.toFixed(2)}</div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-bold">ARV Formula</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>ARV</div>
          <div>${arv.toFixed(2)}</div>
          <div>Repair Cost</div>
          <div>${repairCost.toFixed(2)}</div>
          <div>Exit (ARV - Repairs) at 70%</div>
          <div>${exitValue.toFixed(2)}</div>
          <div>Wholesale Fee</div>
          <div>${wholesaleTargetFee.toFixed(2)}</div>
          <div className="font-medium">Max Buy</div>
          <div className="font-medium">${maxBuy.toFixed(2)} ({(maxBuyPct * 100).toFixed(0)}%)</div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-bold">ARV Comps</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Average Sold Price</div>
          <div>$207,500</div>
          <div>Average SQFT</div>
          <div>1,563</div>
          <div>ARV Price/SQFT</div>
          <div>$218,114</div>
          <div>6 Mo Prior</div>
          <div>$200,000</div>
          <div>Current</div>
          <div>$175,000</div>
          <div>Market Gain/Loss</div>
          <div>-13%</div>
          <div className="font-medium">Adjusted ARV</div>
          <div className="font-medium">$190,850</div>
        </div>
      </div>
    </div>
  );
}
