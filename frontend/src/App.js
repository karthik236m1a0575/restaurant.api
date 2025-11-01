import React from 'react';
import Menu from './pages/Menu';
import Orders from './pages/Orders';

export default function App(){
  return (
    <div className="app">
      <header><h1>Restaurant Menu</h1></header>
      <main>
        <Menu />
        <Orders />
      </main>
    </div>
  )
}