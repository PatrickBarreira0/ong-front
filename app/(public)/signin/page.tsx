"use client";

import { Suspense } from "react";
import SignInContent from "./signin-content";

export default function LoginPage() {
  return (
    <Suspense fallback={<SignInLoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
}

function SignInLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

