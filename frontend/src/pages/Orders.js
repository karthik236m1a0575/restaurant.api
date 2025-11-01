import React, { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export default function Orders(){
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    fetch(`${API}/orders`).then(r=>r.json()).then(setOrders).catch(()=>{});
  },[]);
  return (<section className="orders">
    <h2>Orders (admin view)</h2>
    {orders.length===0 && <div>No orders (or backend not running)</div>}
    {orders.map(o=>(
      <div key={o._id} className="order-card">
        <div><strong>{o.customerName}</strong> — {o.status}</div>
        <div>Total: ${o.totalPrice.toFixed(2)}</div>
        <div>{o.items.map(it=> <div key={it.item}>{it.name} x {it.qty}</div>)}</div>
      </div>
    ))}
  </section>)
}