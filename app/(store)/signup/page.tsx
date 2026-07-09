import { Suspense } from "react";
import SignupPage from "./SignupPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" /></div>}>
      <SignupPage />
    </Suspense>
  );
}
