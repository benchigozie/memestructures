"use client"

import { Field, ErrorMessage } from "formik"

const StepOne = ({ }) => {
    return (
    <div className="space-y-3 grid gap-x-4 md:grid-cols-2">

      <div>
        <label htmlFor="firstName" className="text-my-gray/85 text-[15px]">
          First Name
        </label>

        <Field
          name="firstName"
          id="firstName"
          placeholder="John"
          autoComplete="given-name"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
        />

        <ErrorMessage
          name="firstName"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="text-my-gray/85 text-[15px]">
          Last Name
        </label>

        <Field
          name="lastName"
          id="lastName"
          placeholder="Doe"
          autoComplete="family-name"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
        />

        <ErrorMessage
          name="lastName"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <label htmlFor="dob" className="text-my-gray/85 text-[15px]">
          Date of Birth
        </label>

        <Field
          name="dob"
          id="dob"
          type="date"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
        />

        <ErrorMessage
          name="dob"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <label htmlFor="gender" className="text-my-gray/85 text-[15px]">
          Gender
        </label>

        <Field
          as="select"
          name="gender"
          id="gender"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-3 text-my-gray/85"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </Field>

        <ErrorMessage
          name="gender"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div className="col-span-2">
        <label htmlFor="email" className="text-my-gray/85 text-[15px]">
          Enter Your Email
        </label>

        <Field
          name="email"
          type="email"
          id="email"
          placeholder="john@email.com"
          autoComplete="email"
          className="mt-1 w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
        />

        <ErrorMessage
          name="email"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      {/* PHONE */}
      <div className="col-span-2">
        <label htmlFor="phone" className="text-my-gray/85 text-[15px]">
          Enter Your Phone Number
        </label>

        <div className="flex gap-2 mt-1">

          <Field
            as="select"
            name="phoneCode"
            className="rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-3 py-2"
          >
            <option value="+234">+234</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </Field>

          <Field
            name="phone"
            placeholder="8012345678"
            autoComplete="tel"
            className="w-full rounded-xl outline outline-my-blue/15 focus:outline-my-blue/40 px-4 py-2"
          />

        </div>

        <ErrorMessage
          name="phone"
          component="p"
          className="text-sm text-red-400 mt-1"
        />
      </div>      

    </div>
  )
}

export default StepOne