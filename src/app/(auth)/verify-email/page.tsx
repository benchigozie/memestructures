import { Suspense } from "react";
import VerifyEmailPage from "@/components/VerifyEmail";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  )
}

export default page