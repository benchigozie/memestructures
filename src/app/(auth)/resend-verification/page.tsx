import { Suspense } from "react";
import ResendVerification from "@/components/ResendVerification";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendVerification />
    </Suspense>
  )
}

export default page