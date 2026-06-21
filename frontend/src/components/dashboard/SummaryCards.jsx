const SummaryCards = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 shadow">Orders</div>
      <div className="bg-white p-4 shadow">Spent</div>
      <div className="bg-white p-4 shadow">Earnings</div>
    </div>
  );
};

export default SummaryCards;