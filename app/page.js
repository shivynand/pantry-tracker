"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([
    // { name: "Eggs", quantity: 4 },
    // { name: "Chicken", quantity: 2 },
    // { name: "Chocolate", quantity: 7 },
  ]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });

  const [total, setTotal] = useState(13);

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && (newItem.quantity !== "" &&parseInt(newItem.quantity) > 0)) {
      // setItems([...items, newItem]);
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });
      setNewItem({ name: "", quantity: "" });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.quantity),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-blue-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border rounded-full"
              type="text"
              placeholder="Enter Item"
            ></input>
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="col-span-2 p-3 border mx-3 rounded-full"
              type="number"
              placeholder="Enter quantity"
            ></input>
            <button
              onClick={addItem}
              className="text-white bg-slate-800 hover:bg-slate-600 p-3 rounded-full text-lg"
              type="submit"
            >
              Submit
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li key={id} className="my-4 w-full flex justify-between bg-gradient-to-r from-blue-600 to-red-600">
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalise">{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="ml-8 border-l-2 border-blue-800 hover:bg-slate-900 w-16"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            " "
          ) : (
            <div className="flex justify-between p-3">
              <span>Total: </span>
              <span>{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
