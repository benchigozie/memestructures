import { Suspense } from "react";
import ResendVerification from "@/components/ResendVerification";
import InProgress from "@/components/InProgress";
const page = () => {
  return (
    <Suspense fallback={
      <InProgress message="Loading" />
    }>
      <ResendVerification />
    </Suspense>
  )
}

export default page