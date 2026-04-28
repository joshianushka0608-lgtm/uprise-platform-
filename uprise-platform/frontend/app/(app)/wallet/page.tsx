"use client";

import { Wallet, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function WalletPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-dark">My Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 opacity-80" />
          <span className="font-medium opacity-80">Available Balance</span>
        </div>
        <div className="text-4xl font-extrabold mb-1">{formatCurrency(0)}</div>
        <p className="text-primary-200 text-sm">
          Complete tasks to start earning
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: TrendingUp, label: "Total Earned", value: formatCurrency(0), color: "text-secondary bg-secondary/10" },
          { icon: Clock, label: "In Escrow", value: formatCurrency(0), color: "text-accent bg-accent/10" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-dark">{item.value}</div>
            <div className="text-sm text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ArrowUpRight className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-dark mb-2">No transactions yet</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Your earnings and payments will appear here once you start completing tasks.
        </p>
      </div>
    </div>
  );
}
