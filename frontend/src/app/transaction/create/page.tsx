import TransactionForm from '@/components/transaction-form';

export default function CreateTransactionPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Create Transaction</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TransactionForm />
      </div>
    </div>
  );
}
