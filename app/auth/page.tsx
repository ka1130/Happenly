"use client";
import { Suspense } from "react";

import AuthPage from "./AuthPageComponent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}
