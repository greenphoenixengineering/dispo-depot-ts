const AccountDetails = () => (
  <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-10">
    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Account Details</h2>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <div className="text-sm text-gray-500 font-semibold mb-1">Name</div>
        <div className="text-gray-900 text-base font-medium">John Doe</div>
      </div>
      <div>
        <div className="text-sm text-gray-500 font-semibold mb-1">Email</div>
        <div className="text-gray-900 text-base font-medium">john.doe@example.com</div>
      </div>
    </div>
    <hr className="my-4 border-gray-200" />
    <div>
      <div className="text-base font-semibold text-gray-900 mb-1">Billing</div>
      <div className="text-gray-600 text-sm">You`&apos;`re currently on the free plan. Upgrade to unlock more features.</div>
    </div>
  </section>
);

export default AccountDetails; 