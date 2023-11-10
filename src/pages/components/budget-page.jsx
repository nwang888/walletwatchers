import { useEffect, useState } from "react";

export default function BudgetPage({}) {
  useEffect(() => {
    const getBudgets = async () => {
      const response = await fetch('/api/budgets');
      const payload = await response.json();
      console.log(payload);
    }

    getBudgets();
  }, []);

  return (
  <>
    <h1>Budget</h1>
      <p>there's data stored in state that isn't rendered yet</p>
  </>
)
};