import { Suspense } from "react";
import ResetPassword from "@/components/ResetPassword";
import InProgress from "@/components/InProgress";
const page = () => {
  return (
    <Suspense fallback={<InProgress message="Loading" />}>
      <ResetPassword />
    </Suspense>
  )
}

export default page