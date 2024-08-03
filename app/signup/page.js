"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../authContext";
import { signUp} from "../auth";

export default function SignUpPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e) => {
        e.preventDefault()
       setLoading(true);

       try {
        await signUp(email, password)
        router.push('/')
       } catch (error) {
        console.error("Sign up error", error)
       } finally {
        setLoading(false)
       }
    } 

    return (
        <div className="h-auto w-full flex flex-col items-center mt-[200px] justify-between p-2">
        <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg border">
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded my-2 text-white placeholder:text-white border bg-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded my-2 text-white placeholder:text-white bg-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 border mt-2 text-white rounded"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
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
