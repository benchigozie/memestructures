"use client";

import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";
import GeneralInformation from "@/components/GeneralInfo";
import InvestmentDetails from "@/components/InvestmentDetails";
import Fees from "@/components/Fees";
import RiskPublishing from "@/components/RiskPublishing";
import Criteria from "@/components/Criteria";
import FlowSteps from "@/components/FlowSteps";
import Requirements from "@/components/Requirements";
import Universes from "@/components/Universes";
import InProgress from "@/components/InProgress";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useState, useEffect } from "react";
import ErrorResponse from "./ErrorResponse";
import PopUp from "./PopUp";
import SuccessResponse from "./SuccessResponse";

export type AssetClassFormValues = {
  id?: string;

  name: string;
  slug: string;
  acronym: string;

  headline: string;
  shortDescription: string;
  description: string;

  fundType: string;
  riskProfile: string;
  allocationSource: string;
  investmentHorizon: string;
  lockupPeriod: string;

  minimumInvestment: number;
  maximumInvestment: number | null;

  targetAllocationPercent: number | null;
  targetReturn: string;

  riskDisclosure: string;

  displayOrder: number;
  isPublished: boolean;
  isActive: boolean;

  fees: {
    id?: string;
    name: string;
    percentage: number;
    description: string;
  }[];

  criteria: {
    id?: string;
    title: string;
    description: string;
    signal: string;
  }[];

  flowSteps: {
    id?: string;
    title: string;
    badge: string;
    description: string;
  }[];

  requirements: {
    id?: string;
    title: string;
    status: string;
  }[];

  universes: {
    id?: string;
    name: string;
    targetAllocation: number;
    description: string;
  }[];
};

export const emptyAssetClass: AssetClassFormValues = {
  name: "",
  slug: "",
  acronym: "",

  headline: "",
  shortDescription: "",
  description: "",

  fundType: "",
  riskProfile: "",
  allocationSource: "",
  investmentHorizon: "",
  lockupPeriod: "",

  minimumInvestment: 0,
  maximumInvestment: null,

  targetAllocationPercent: null,

  fees: [
    {
      name: "",
      percentage: 0,
      description: "",
    },
  ],

  universes: [
    {
      name: "",
      description: "",
      targetAllocation: 0,
    },
  ],
  targetReturn: "",

  riskDisclosure: "",

  displayOrder: 0,
  isPublished: false,
  isActive: true,

  criteria: [
    {
      title: "",
      description: "",
      signal: "",
    },
  ],

  flowSteps: [
    {
      title: "",
      description: "",
      badge: "",
    },
  ],

  requirements: [
    {
      title: "",
      status: "",
    },
  ],

};



function toFormValues(
  asset: AssetClassFormValues
): AssetClassFormValues {
  return {

    id: asset.id,
    name: asset.name,
    slug: asset.slug,
    acronym: asset.acronym,

    headline: asset.headline,
    shortDescription: asset.shortDescription,
    description: asset.description,

    fundType: asset.fundType,
    riskProfile: asset.riskProfile,
    allocationSource: asset.allocationSource,
    investmentHorizon: asset.investmentHorizon,
    lockupPeriod: asset.lockupPeriod,

    minimumInvestment: asset.minimumInvestment,
    maximumInvestment: asset.maximumInvestment ?? null,

    targetAllocationPercent:
      asset.targetAllocationPercent ?? null,

    targetReturn: asset.targetReturn,

    riskDisclosure: asset.riskDisclosure,

    displayOrder: asset.displayOrder,
    isPublished: asset.isPublished,
    isActive: asset.isActive,

    fees: asset.fees.map(fee => ({
      name: fee.name,
      percentage: fee.percentage,
      description: fee.description,
    })),

    criteria: asset.criteria.map(item => ({
      title: item.title,
      description: item.description,
      signal: item.signal,
    })),

    flowSteps: asset.flowSteps.map(item => ({
      title: item.title,
      description: item.description,
      badge: item.badge,
    })),

    requirements: asset.requirements.map(item => ({
      title: item.title,
      status: item.status,
    })),

    universes: asset.universes.map(item => ({
      name: item.name,
      description: item.description,
      targetAllocation: item.targetAllocation,
    })),
  };
}


type AssetClassFormProps = {
  asset?: AssetClassFormValues | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  refreshAssets: () => void;
};

export const validationSchema = Yup.object({

  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  acronym: Yup.string().required("Acronym is required"),

  headline: Yup.string().required("Headline is required"),
  shortDescription: Yup.string().required("Short description is required"),
  description: Yup.string().required("Description is required"),

  fundType: Yup.string().required("Fund type is required"),
  riskProfile: Yup.string().required("Risk profile is required"),
  allocationSource: Yup.string().required("Allocation source is required"),
  investmentHorizon: Yup.string().required("Investment horizon is required"),
  lockupPeriod: Yup.string().required("Lockup period is required"),

  minimumInvestment: Yup.number()
    .typeError("Minimum investment must be a number")
    .required("Minimum investment is required"),

  maximumInvestment: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    ),

  targetAllocationPercent: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    ),

  targetReturn: Yup.string(),

  riskDisclosure: Yup.string().required("Risk disclosure is required"),

  displayOrder: Yup.number().required(),
  isPublished: Yup.boolean().required(),
  isActive: Yup.boolean().required(),

  fees: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Fee name is required"),
        percentage: Yup.number()
          .typeError("Percentage must be a number")
          .required("Percentage is required"),
        description: Yup.string().required("Description is required"),
      })
    )
    .min(1, "At least one fee is required"),

  criteria: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        signal: Yup.string().required("Signal is required"),
      })
    )
    .min(1),

  flowSteps: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        badge: Yup.string().required("Badge is required"),
      })
    )
    .min(1),

  requirements: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Title is required"),
        status: Yup.string().required("Status is required"),
      })
    )
    .min(1),

  universes: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Universe name is required"),
        targetAllocation: Yup.number()
          .typeError("Allocation must be a number")
          .required("Allocation is required"),
        description: Yup.string().required("Description is required"),
      })
    )
    .min(1),
});

export default function AssetClassForm({
  asset,
  onSuccess,
  refreshAssets,
}: AssetClassFormProps) {

  const [formState, setFormState] = useState<
    "idle" | "submitting" | "error" | "success"
  >("idle");

  const [showPopup, setShowPopup] = useState(false);

  const [pendingValues, setPendingValues] = useState<AssetClassFormValues | null>(null);

  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    setFormState("idle");
  }, [asset]);

  const initialValues = asset
    ? toFormValues(asset)
    : emptyAssetClass;

  async function saveAssetClass(
    values: AssetClassFormValues,
    { resetForm }: FormikHelpers<AssetClassFormValues>,
  ) {

    setFormState("submitting");

    try {
      const res = await fetchWithAuth(
        asset
          ? `/api/admin/asset-classes/${asset.id}`
          : "/api/admin/asset-classes/create",
        {
          method: asset ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (!asset) {
        resetForm();
      }


      setResponseMessage(
        data.message ||
        (asset
          ? "Asset class updated successfully."
          : "Asset class created successfully.")
      );

      refreshAssets();
      setFormState("success");

      onSuccess?.();
    } catch (err: any) {
      setResponseMessage(err.message || "Unexpected error occurred");
      setFormState("error");
    }
  }

  const handleConfirm = async () => {
    if (!pendingValues) return;

    await saveAssetClass(
      pendingValues,
      {
        resetForm: () => { },
      } as FormikHelpers<AssetClassFormValues>
    );

    setShowPopup(false);
  };

  const handleClose = () => {
    setShowPopup(false);
    setPendingValues(null);
  };

  return (
    <div id="asset-class-form" className="p-4 md:p-6">
      <h2 className="mb-8 text-2xl font-bold text-my-deep-blue">
        {asset ? "Edit Asset Class" : "Create Asset Class"}
      </h2>

      {formState === "idle" &&

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form submitted with values:", values);
            setPendingValues(values);
            setShowPopup(true);
          }}
        >
          {({ isSubmitting, errors }) => {
            
          

            return (
            <Form className="space-y-4">
              <GeneralInformation />

              <InvestmentDetails />

              <Fees />

              <RiskPublishing />

              <Criteria />

              <FlowSteps />

              <Requirements />

              <Universes />

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-my-blue hover:bg-my-deep-blue cursor-pointer px-6 py-3 text-white disabled:opacity-50"
                >
                  {isSubmitting
                    ? asset
                      ? "Saving..."
                      : "Creating..."
                    : asset
                      ? "Save Changes"
                      : "Create Asset Class"}
                </button>

                {asset && (
                  <button
                    type="button"
                    onClick={onSuccess}
                    className="rounded-lg border border-my-gray/20 px-6 py-3"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </Form>
          )
          }}
        </Formik>
      }

      {formState === "submitting" && (
        <InProgress message="Submitting asset class" />
      )}

      {formState === "error" && (
        <ErrorResponse message={responseMessage} />
      )}
      {showPopup && pendingValues && (
        <PopUp
          title={
            asset
              ? "Update Asset Class"
              : "Create Asset Class"
          }
          message={
            asset
              ? `Are you sure you want to update "${pendingValues.name}"?`
              : `Are you sure you want to create "${pendingValues.name}"?`
          }
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}

      {
        formState === "success" &&
        <SuccessResponse message={responseMessage} />
      }
    </div>
  );
}