"use client"

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-good-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-good-green rounded-2xl mb-4">
            <svg className="w-8 h-8 text-good-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-good-dark-green">Good Energy</h1>
          <p className="text-sm text-good-green/70 mt-1">Panel de Administración</p>
        </div>

        {/* Clerk SignIn component */}
        <SignIn 
          fallbackRedirectUrl="/admin" 
          signUpFallbackRedirectUrl="/admin"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl border border-good-green/10 rounded-2xl",
              headerTitle: "text-good-dark-green",
              headerSubtitle: "text-good-green/70",
              formButtonPrimary: "bg-good-green hover:bg-good-dark-green text-good-white",
              footerActionLink: "text-good-green hover:text-good-dark-green",
              formFieldInput: "border-good-green/20 focus:border-good-green focus:ring-good-green/20",
            },
          }}
        />
      </div>
    </div>
  );
}
