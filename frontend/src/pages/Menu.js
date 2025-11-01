import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Menu(){
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  useEffect(()=>{
    fetch(`${API}/menu`).then(r=>r.json()).then(setItems).catch(console.error);
  },[]);

  function addToCart(item){
    const found = cart.find(c=>c.item===item._id);
    if(found){
      setCart(cart.map(c=> c.item===item._id ? {...c, qty: c.qty+1} : c));
    } else {
      setCart([...cart, { item: item._id, name: item.name, price: item.price, qty: 1 }]);
    }
  }

  async function placeOrder(){
    if(cart.length===0){ alert('Cart is empty'); return;}
    if(!customerName){ alert('Enter name'); return;}
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ customerName, address, items: cart })
    });
    if(res.ok){
      alert('Order placed');
      setCart([]);
      setCustomerName('');
      setAddress('');
    } else {
      const err = await res.json();
      alert('Error: ' + (err.message||res.statusText));
    }
  }

  return (<div className="menu-container">
    <section className="menu-list">
      <h2>Menu</h2>
      {items.map(it=>(
        <div key={it._id} className="menu-item">
          <div><strong>{it.name}</strong> — ${it.price.toFixed(2)}</div>
          <div>{it.description}</div>
          <button onClick={()=>addToCart(it)}>Add</button>
        </div>
      ))}
    </section>
    <aside className="cart">
      <h2>Cart</h2>
      {cart.map(c=>(
        <div key={c.item}>{c.name} x {c.qty} — ${(c.price*c.qty).toFixed(2)}</div>
      ))}
      <div className="cart-total">Total: ${cart.reduce((s,c)=>s+c.price*c.qty,0).toFixed(2)}</div>
      <input placeholder="Name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
      <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
      <button onClick={placeOrder}>Place Order</button>
    </aside>
  </div>)
}