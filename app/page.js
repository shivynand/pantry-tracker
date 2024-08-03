"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import stringSimilarity from "string-similarity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./authContext";
import { useRouter } from "next/navigation";
import { SignOut } from "./auth";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null; // Return null if there's no user
  }

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSignOut = async () => {
    try {
      await SignOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out, please try again");
    }
  };

  useEffect(() => {
      const fetchUserData = async () => {
        const q = query(collection(db, "users", user.uid, "items"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let itemsArr = [];

          querySnapshot.forEach((doc) => {
            itemsArr.push({ ...doc.data(), id: doc.id });
          });
          setItems(itemsArr);

          const totalQuantity = itemsArr.reduce(
            (sum, item) => sum + parseFloat(item.quantity),
            0
          );
          setTotal(totalQuantity);
        });

        return unsubscribe;
      };

      const unsubscribe = fetchUserData();

      return () => {
        if (unsubscribe) unsubscribe;
      };
  }, [user, router, db]);

  if (!user) {
    return null;
  }

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (
      newItem.name !== "" &&
      newItem.quantity !== "" &&
      parseInt(newItem.quantity) > 0 &&
      user
    ) {
      // setItems([...items, newItem]);
      const trimmedName = newItem.name.trim().toLowerCase();

      // Check for similar item names
      const similarItem = items.find((item) => {
        const similarity = stringSimilarity.compareTwoStrings(
          item.name.toLowerCase(),
          trimmedName
        );
        return similarity > 0.75;
      });

      if (similarItem) {
        //Item already exists, update quantity instead
        const updatedQuantity =
          parseInt(similarItem.quantity) + parseInt(newItem.quantity);
        await updateDoc(doc(db, "users", user.uid, "items", similarItem.id), {
          quantity: updatedQuantity.toString(),
        });
        toast.info(
          `Updated quantity of "${similarItem.name}" instead of adding a new item.`
        );
      } else {
        await addDoc(collection(db, "users", user.uid, "items"), {
          name: newItem.name.trim(),
          quantity: newItem.quantity,
        });
        toast.success("Item added successfully!");
      }
      setNewItem({ name: "", quantity: "" });
    }
  };

  const incrementItem = async (id) => {
    const itemRef = doc(db, "users", user.uid, "items", id);
    try {
      const docSnap = await getDoc(itemRef);
      if (docSnap.exists()) {
        const currentQuantity = parseInt(docSnap.data().quantity);
        const newQuantity = currentQuantity + 1;
        await updateDoc(itemRef, {
          quantity: newQuantity.toString(),
        });
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? { ...item, quantity: newQuantity.toString() }
              : item
          )
        );
        setFilteredItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? { ...item, quantity: newQuantity.toString() }
              : item
          )
        );
      }
    } catch (error) {
      toast.error("Error updating item: " + error.message);
    }
  };

  const decrementItem = async (id) => {
    const itemRef = doc(db, "users", user.uid, "items", id);
    try {
      const docSnap = await getDoc(itemRef);
      if (docSnap.exists()) {
        const currentQuantity = parseInt(docSnap.data().quantity);
        if (currentQuantity > 1) {
          const newQuantity = currentQuantity - 1;
          await updateDoc(itemRef, {
            quantity: newQuantity.toString(),
          });
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? { ...item, quantity: newQuantity.toString() }
                : item
            )
          );

          setFilteredItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? { ...item, quantity: newQuantity.toString() }
                : item
            )
          );
        } else {
          toast.warn("Quantity cannot be less than 1");
        }
      }
    } catch (error) {
      toast.error("Error updating item: " + error.message);
    }
  };

  //Handle search and filter items
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredItems([]);
    } else {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  };

  // Calculate total based on filtered items or all items
  useEffect(() => {
    const calculateTotal = () => {
      const itemsToCalculate = searchQuery ? filteredItems : items;
      const totalQuantity = itemsToCalculate.reduce(
        (sum, item) => sum + parseFloat(item.quantity),
        0
      );
      setTotal(totalQuantity);
    };
    calculateTotal();
  }, [items, filteredItems, searchQuery]);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <ToastContainer />
        <div className="justify-between flex flex-row mb-5">
          <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
          <button
            className="bg-red-500 px-10 rounded-full"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
        <div className="bg-blue-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border rounded-full"
              type="text"
              placeholder="Add Item"
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
          <input
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border rounded-full my-4 text-black"
            type="text"
            placeholder="Search Item"
          ></input>
          <ul>
            {searchQuery ? (
              filteredItems.length > 0 ? (
                filteredItems.map((item, id) => (
                  <li
                    key={id}
                    className="my-4 w-full flex justify-between bg-gradient-to-r from-blue-600 to-red-600"
                  >
                    <div className="p-4 w-full flex justify-between">
                      <span className="capitalize">{item.name}</span>
                      <span className="flex items-center">
                        <button
                          className="bg-slate-900 text-lg p-2 w-10 h-10 flex items-center justify-center rounded-lg"
                          onClick={() => decrementItem(item.id)}
                        >
                          -
                        </button>
                        <div className="w-12 text-center">{item.quantity}</div>
                        <button
                          className="bg-slate-900 text-lg p-2 w-10 h-10 flex items-center justify-center rounded-lg"
                          onClick={() => incrementItem(item.id)}
                        >
                          +
                        </button>
                      </span>
                    </div>
                    <button className="ml-8 border-l-2 border-blue-800 hover:bg-slate-900 w-16">
                      X
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-white">Item does not exist</p>
              )
            ) : (
              items.map((item, id) => (
                <li
                  key={id}
                  className="my-4 w-full flex justify-between bg-gradient-to-r from-blue-600 to-red-600"
                >
                  <div className="p-4 w-full flex justify-between">
                    <span className="capitalize">{item.name}</span>
                    <span className="flex items-center">
                      <button
                        className="bg-slate-900 text-lg p-2 w-10 h-10 flex items-center justify-center rounded-lg"
                        onClick={() => decrementItem(item.id)}
                      >
                        -
                      </button>
                      <div className="w-12 text-center">{item.quantity}</div>
                      <button
                        className="bg-slate-900 text-lg p-2 w-10 h-10 flex items-center justify-center rounded-lg"
                        onClick={() => incrementItem(item.id)}
                      >
                        +
                      </button>
                    </span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="ml-8 border-l-2 border-blue-800 hover:bg-slate-900 w-16"
                  >
                    X
                  </button>
                </li>
              ))
            )}
          </ul>
          {(searchQuery ? filteredItems : items).length < 1 ? (
            " "
          ) : (
            <div className="flex justify-between p-3">
              <span>Total Stock: </span>
              <span>{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
