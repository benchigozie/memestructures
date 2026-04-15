import { Suspense } from "react";
import VerifyEmailPage from "@/components/VerifyEmail";
import InProgress from "@/components/InProgress";
const page = () => {
  return (
    <Suspense fallback={
      <InProgress message="Loading" />
    }>
      <VerifyEmailPage />
    </Suspense>
  )
}

export default page