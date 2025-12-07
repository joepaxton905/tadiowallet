const token = localStorage.getItem('authToken');
async function seed() {
  const holdings = [
    {symbol:'BTC',holdings:1.45,averageBuyPrice:42000},
    {symbol:'ETH',holdings:12.5,averageBuyPrice:2200},
    {symbol:'SOL',holdings:150,averageBuyPrice:95},
    {symbol:'ADA',holdings:10000,averageBuyPrice:0.48},
    {symbol:'MATIC',holdings:5000,averageBuyPrice:0.85}
  ];
  for(const h of holdings){
    await fetch('/api/portfolio',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(h)});
    console.log(`✓ ${h.symbol}`);
  }
  const txs=[{type:'buy',asset:'BTC',assetName:'Bitcoin',assetIcon:'₿',assetColor:'#F7931A',amount:0.15,price:43250,value:6487.50,fee:12.50,status:'completed'}];
  for(const t of txs){
    await fetch('/api/transactions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(t)});
  }
  alert('✨ Done! Refresh page (F5)');
}
seed();