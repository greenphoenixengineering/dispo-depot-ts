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
  const closingAmt = Math.round(arv * closingPct);
  const holdingAmt = Math.round(arv * holdingPct);
  const hardMoneyAmt = Math.round(arv * hardMoneyPct);
  const contingencyAmt = Math.round(arv * contingencyPct);
  // Wholesale fee can be percent or amount, keep both in sync
  // If user edits percent, update amount; if edits amount, update percent

  // Bidirectional logic for conditional expenses (only percent state, amount is derived)
  const handlePctChange = (setterPct: React.Dispatch<React.SetStateAction<number>>, pct: number) => {
    setterPct(pct);
  };
  const handleAmtChange = (setterPct: React.Dispatch<React.SetStateAction<number>>, amt: number, base: number) => {
    setterPct(base > 0 ? amt / base : 0);
  };

  // Bidirectional logic for wholesale fee
  const handleWholesaleFeePctChange = (pct: number) => {
    setWholesaleFeePct(pct);
    setWholesaleFee(Math.round(arv * pct));
  };
  const handleWholesaleFeeAmtChange = (amt: number) => {
    setWholesaleFee(amt);
    setWholesaleFeePct(arv > 0 ? amt / arv : 0);
  };

  const totalExpenses = closingAmt + holdingAmt + hardMoneyAmt + contingencyAmt + wholesaleFee;
  const mao = Math.round(arv * arvMultiplier - totalExpenses - repairCost);

  // Format helpers
  const formatDollar = (val: number) => val ? `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '$0';
  const formatNumber = (val: number) => val ? val.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '';

  return (
    <div className="p-4 sm:p-6 w-full max-w-lg mx-auto">
      <div className="mt-6 mb-6 sm:mb-10 text-2xl font-bold mb-2 text-center">Wholesale MAO Calculator</div>
      <div className="text-xs sm:text-sm text-gray-600 text-center mb-10">
        Calculate your Maximum Allowable Offer (MAO) for a wholesale deal.<br />
        Formula: <span className="font-mono">MAO = ARV × {Math.round(arvMultiplier * 100)}% − Expenses − Repair Costs</span>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">After Repair Value (ARV)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
          <input
            type="text"
            value={formatNumber(arv)}
            onChange={e => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              setArv(Number(raw));
            }}
            className="border rounded h-10 text-base px-3 pl-7 w-full text-right"
            inputMode="numeric"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">ARV Multiplier (%)
          <span className="ml-2 text-gray-400 text-xs">(Adjust for market/investor criteria)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">%</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={Math.round(arvMultiplier * 100)}
            onChange={e => setArvMultiplier(Number(e.target.value) / 100)}
            className="border rounded h-10 text-base px-3 pl-7 w-full text-right"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">Repair Costs</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
          <input
            type="text"
            value={formatNumber(repairCost)}
            onChange={e => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              setRepairCost(Number(raw));
            }}
            className="border rounded h-10 text-base px-3 pl-7 w-full text-right"
            inputMode="numeric"
          />
        </div>
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
                  <input type="number" step="1" min="0" max="100"
                    value={Math.round(closingPct * 100)}
                    onChange={e => handlePctChange(setClosingPct, Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <input type="text" min="0" value={formatNumber(closingAmt)}
                    onChange={e => handleAmtChange(setClosingPct, Number(e.target.value.replace(/[^\d]/g, '')), arv)}
                    className="border rounded px-0.5 py-1 w-24 text-right text-xs" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Holding Costs (3 mo)</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="1" min="0" max="100"
                    value={Math.round(holdingPct * 100)}
                    onChange={e => handlePctChange(setHoldingPct, Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <input type="text" min="0" value={formatNumber(holdingAmt)}
                    onChange={e => handleAmtChange(setHoldingPct, Number(e.target.value.replace(/[^\d]/g, '')), arv)}
                    className="border rounded px-0.5 py-1 w-24 text-right text-xs" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Hard Money Loan Costs</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="1" min="0" max="100"
                    value={Math.round(hardMoneyPct * 100)}
                    onChange={e => handlePctChange(setHardMoneyPct, Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <input type="text" min="0" value={formatNumber(hardMoneyAmt)}
                    onChange={e => handleAmtChange(setHardMoneyPct, Number(e.target.value.replace(/[^\d]/g, '')), arv)}
                    className="border rounded px-0.5 py-1 w-24 text-right text-xs" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Wholesale Fee</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="1" min="0" max="100"
                    value={Math.round(wholesaleFeePct * 100)}
                    onChange={e => handleWholesaleFeePctChange(Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <input type="text" min="0" value={formatNumber(wholesaleFee)}
                    onChange={e => handleWholesaleFeeAmtChange(Number(e.target.value.replace(/[^\d]/g, '')))}
                    className="border rounded px-0.5 py-1 w-24 text-right text-xs" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1 px-0.5 text-xs">Contingency / Risk Buffer</td>
                <td className="text-center py-1 px-0.5">
                  <input type="number" step="1" min="0" max="100"
                    value={Math.round(contingencyPct * 100)}
                    onChange={e => handlePctChange(setContingencyPct, Number(e.target.value) / 100)}
                    className="border rounded px-0.5 py-1 w-16 text-right text-xs" />
                </td>
                <td className="text-right">
                  <input type="text" min="0" value={formatNumber(contingencyAmt)}
                    onChange={e => handleAmtChange(setContingencyPct, Number(e.target.value.replace(/[^\d]/g, '')), arv)}
                    className="border rounded px-0.5 py-1 w-24 text-right text-xs" />
                </td>
              </tr>
              <tr className="font-bold">
                <td className="py-1 px-0.5 text-xs">Total Expenses</td>
                <td className="text-center py-1 px-0.5 text-xs">{Math.round((closingPct + holdingPct + hardMoneyPct + contingencyPct + wholesaleFeePct) * 100)}%</td>
                <td className="text-right">
                  <span className="bg-green-300 text-green-900 rounded px-1.5 py-0.5 text-xs">
                    {formatDollar(totalExpenses)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-lg font-semibold text-green-700 mb-1">Maximum Allowable Offer (MAO)</div>
          <div className="text-3xl font-bold text-green-900">
            {formatDollar(mao)}
          </div>
          <div className="text-xs text-gray-500 mt-2">(ARV × {Math.round(arvMultiplier * 100)}% minus all expenses and repairs)</div>
        </div>
      </div>
    </div>
  );
} 