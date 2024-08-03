"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../authContext";
import { signIn } from "../auth";

export default function SignOutPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleSignOut = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            await signIn(email, password)
            router.push('/')
        } catch (error) {
            console.error("Error signing in", error)
        } finally {
            setLoading(false)
        }
    } 

    return (
        <div className="h-auto w-full flex flex-col items-center mt-[200px] justify-between p-2">
        <div className="p-5 bg-gradient-to-r from-green-600 to-green-500 rounded-lg border">
        <form onSubmit={handleSignOut}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded my-2 text-white placeholder:text-white bg-gradient-to-r from-green-600 to-green-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded my-2 text-white placeholder:text-white bg-gradient-to-r from-green-600 to-green-500"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-gradient-to-r mt-2 from-green-600 to-green-500 text-white rounded border"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full p-2 bg-gray-300 text-black rounded mt-10"
          >
            Back
          </button>
        </form>
      </div>
      </div>
    )
}