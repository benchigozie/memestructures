import { Suspense } from "react";
import ResetPassword from "@/components/ResetPassword";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  )
}

export default page