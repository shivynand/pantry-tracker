"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../authContext";
import { signUp, signIn, SignOut } from "../auth";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-auto w-full flex flex-col items-center my-[25%] justify-between p-2">
      <h1 className="text-2xl mb-4">Welcome to Pantry Tracker</h1>
      <div className="space-y-4">
        <button
          onClick={() => router.push("/signup")}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Sign Up
        </button>
        <button
          onClick={() => router.push("/signin")}
          className="w-full p-2 bg-green-500 text-white rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
