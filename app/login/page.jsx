"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

const LoginPage = () => {
    const auth = getAuth();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            await signInWithEmailAndPassword(auth, data.email, data.password);

            setLoading(false)
        } catch (error) {
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 5000);
        }
    }

    return (
        <div className="auth-wrapper">
            
            <div style={{ textAlign: 'center' }}>
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>This email field is required</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    {...register("password", { required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type === "required" && <p>This password field is required</p>}
                {errors.password && errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}

                {errorFromSubmit &&
                    <p>{errorFromSubmit}</p>
                }

                <input type="submit" disabled={loading} />
                <Link href={'/register'} style={{ color: 'gray', textDecoration: 'none'}}>아직 아이디가 없다면...</Link> 
            </form>
        </div>
    )
}

export default LoginPage
