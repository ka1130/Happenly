"use client";

import dynamic from "next/dynamic";

const AuthPage = dynamic(() => import("./AuthPageComponent.tsx"), {
  ssr: false,
});
export default AuthPage;
