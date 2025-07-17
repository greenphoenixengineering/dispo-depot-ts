"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function WholesaleCalculator() {
  const [arv, setArv] = useState(200000);
  const [repairCost, setRepairCost] = useState(30000);
  const [arvMultiplier, setArvMultiplier] = useState(0.7); // Default 70%

  // Expense defaults
  const [closingPct, setClosingPct] = useState(0);
  const [holdingPct, setHoldingPct] = useState(0);
  const [hardMoneyPct, setHardMoneyPct] = useState(0);
  const [contingencyPct, setContingencyPct] = useState(0);
  const [wholesaleFee, setWholesaleFee] = useState(0);
  const [wholesaleFeePct, setWholesaleFeePct] = useState(0);
  const [showConditional, setShowConditional] = useState(false);

  // Amounts
  const closingAmt = arv * closingPct;
  const holdingAmt = arv * holdingPct;
  const hardMoneyAmt = arv * hardMoneyPct;
  const contingencyAmt = arv * contingencyPct;
  // Wholesale fee can be percent or amount, keep both in sync
  // If user edits percent, update amount; if edits amount, update percent

  // Bidirectional logic for wholesale fee
  const handleWholesaleFeePctChange = (pct: number) => {
    setWholesaleFeePct(pct);
    setWholesaleFee(Number((arv * pct).toFixed(2)));
  };
  const handleWholesaleFeeAmtChange = (amt: number) => {
    setWholesaleFee(amt);
    setWholesaleFeePct(arv > 0 ? amt / arv : 0);
  };

  const totalExpenses = closingAmt + holdingAmt + hardMoneyAmt + contingencyAmt + wholesaleFee;
  const mao = arv * arvMultiplier - totalExpenses - repairCost;

  return (
    <div className="p-4 sm:p-6 w-full max-w-lg mx-auto">
      <div className="mb-20 text-2xl font-bold mb-2 text-center">Wholesale MAO Calculator</div>
      <div className="text-gray-600 text-center mb-20">
        Calculate your Maximum Allowable Offer (MAO) for a wholesale deal.<br />
        Formula: <span className="font-mono">MAO = ARV × { (arvMultiplier * 100).toFixed(2) }% − Expenses − Repair Costs</span>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">After Repair Value (ARV) <span className="text-gray-400">$</span></label>
        <input
          type="number"
          value={arv}
          min={0}
          onChange={e => setArv(Number(e.target.value))}
          className="border rounded p-2 w-full text-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">ARV Multiplier (%)
          <span className="ml-2 text-gray-400 text-xs">(Adjust for market/investor criteria)</span>
        </label>
        <input
          type="number"
          min={0}
          max={100}
          step={0.01}
          value={(arvMultiplier * 100).toFixed(2)}
          onChange={e => setArvMultiplier(Number(e.target.value) / 100)}
          className="border rounded p-2 w-full text-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">Repair Costs <span className="text-gray-400">$</span></label>
        <input
          type="number"
          value={repairCost}
          min={0}
          onChange={e => setRepairCost(Number(e.target.value))}
          className="border rounded p-2 w-full text-lg"
        />
      </div>
      {/* Conditional Expenses Collapsible Section */}
      <div className="mt-10 mb-10">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left font-bold text-green-700 text-xl focus:outline-none"
          onClick={() => setShowConditional((v) => !v)}
        >
          <span className={`transition-transform duration-200 ${showConditional ? "rotate-90" : "rotate-0"}`}>
            <ChevronRight className="w-6 h-6" />
          </span>
          <span>Conditional Expenses</span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showConditional ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <table className="w-full table-fixed mb-8 mt-2">
            <thead>
              <tr className="border-b">
                <th className="w-[44%] text-left py-1 px-0.5 text-xs font-semibold">Item</th>
                <th className="w-[18%] text-center py-1 px-0.5 text-xs font-semibold">Percent</th>
                <th className="w-[38%] text-right py-1 px-0.5 text-xs font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Closing Costs (Buy + Sell)</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="0.01" min="0" max="100"
                    value={(closingPct * 100).toFixed(2)}
                    onChange={e => setClosingPct(Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-xs">
                    ${closingAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Holding Costs (3 mo)</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="0.01" min="0" max="100"
                    value={(holdingPct * 100).toFixed(2)}
                    onChange={e => setHoldingPct(Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-xs">
                    ${holdingAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Hard Money Loan Costs</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="0.01" min="0" max="100"
                    value={(hardMoneyPct * 100).toFixed(2)}
                    onChange={e => setHardMoneyPct(Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-xs">
                    ${hardMoneyAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Wholesale Fee</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="0.01" min="0" max="100"
                    value={(wholesaleFeePct * 100).toFixed(2)}
                    onChange={e => handleWholesaleFeePctChange(Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <input type="number" min="0" value={wholesaleFee.toFixed(2)}
                    onChange={e => handleWholesaleFeeAmtChange(Number(e.target.value))}
                    className="border rounded px-0.5 py-1 w-24 text-right text-xs" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Contingency / Risk Buffer</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="0.01" min="0" max="100"
                    value={(contingencyPct * 100).toFixed(2)}
                    onChange={e => setContingencyPct(Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-xs">
                    ${contingencyAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
              <tr className="font-bold">
                <td className="py-1 px-0.5 text-xs">Total Expenses</td>
                <td className="text-center py-1 px-0.5 text-xs">{(((closingPct + holdingPct + hardMoneyPct + contingencyPct + wholesaleFeePct) * 100).toFixed(2))}%</td>
                <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-xs">
                    ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-lg font-semibold text-green-700 mb-1">Maximum Allowable Offer (MAO)</div>
        <div className="text-3xl font-bold text-green-900">
          ${mao.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-gray-500 mt-2">(ARV × { (arvMultiplier * 100).toFixed(2) }% minus all expenses and repairs)</div>
      </div>
    </div>
  );
} 