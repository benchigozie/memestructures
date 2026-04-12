"use client"

interface StepFourProps {
  values: any
}

const StepFourReview = ({ values }: StepFourProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-my-deep-blue font-semibold text-xl">
        Review Your Submission
      </h3>

      <div>
        <h4 className="font-semibold mb-1">Company Documents</h4>
        <p><span className="font-semibold">Company Name: </span>{values.companyName}</p>
        <p>
        <span className="font-medium">Certificate of Incorporation: </span>
          {values.certificateOfIncorporation?.name || "Not uploaded"}
        </p>
        <p>
        <span className="font-medium">Memorandum of Association: </span>
          {values.memorandumOfAssociation?.name || "Not uploaded"}
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-1">Directors</h4>

        {values.directors?.map((director: any, index: number) => (
          <div key={index} className="outline outline-dashed outline-my-blue/25 rounded-xl p-4 my-2">
            <p><span className="font-medium">Name: </span> {director.fullName}</p>
            <p>
            <span className="font-medium">Address: </span>
              {
                (director.address && director.city && director.state && director.country) ?
                  `${director.address}, ${director.city}, ${director.state}, ${director.country}`
                  :
                  "Not provided"
              }
            </p>
            <p><span className="font-medium">ID Type: </span> {director.idType}</p>
            <p><span className="font-medium">ID Number: </span> {director.idNumber}</p>
            <p><span className="font-medium">ID Front: </span> {director.idFront?.name || "Not uploaded"}</p>
            <p><span className="font-medium">ID Back: </span> {director.idBack?.name || "Not uploaded"}</p>
            <p><span className="font-medium">Proof Type: </span> {director.proofOfAddressType}</p>
            <p><span className="font-medium">Proof Doc: </span> {director.proofOfAddressDoc?.name || "Not uploaded"}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-semibold">Operator</h4>

        <p><span className="font-medium">Name: </span> {values.operator?.fullName}</p>

        <p>
        <span className="font-medium">Address: </span>
          {
            (values.operator.address && values.operator.city && values.operator.state && values.operator.country) ?
              `${values.operator.address}, ${values.operator.city}, ${values.operator.state}, ${values.operator.country}`
              :
              "Not provided"
          }

        </p>

        <p><span className="font-medium">ID Type: </span> {values.operator?.idType}</p>
        <p><span className="font-medium">ID Number: </span> {values.operator?.idNumber}</p>

        <p><span className="font-medium">ID Front: </span> {values.operator?.idFront?.name || "Not uploaded"}</p>
        <p><span className="font-medium">ID Back: </span> {values.operator?.idBack?.name || "Not uploaded"}</p>

        <p><span className="font-medium">Proof Type: </span> {values.operator?.proofOfAddressType}</p>
        <p>
        <span className="font-medium">Proof Doc: </span>
          {values.operator?.proofOfAddressDoc?.name || "Not uploaded"}
        </p>
      </div>
    </div>
  )
}

export default StepFourReview