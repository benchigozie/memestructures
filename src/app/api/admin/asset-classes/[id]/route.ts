import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const user = await getUserFromRequest();

    if (
      !user ||
      (user.accountType !== "ADMIN" &&
        user.accountType !== "DEV")
    ) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }


    const { id } = await params;


    const assetClass = await prisma.assetClass.findUnique({
      where: {
        id,
      },
      include: {
        fees: true,
        criteria: true,
        flowSteps: true,
        requirements: true,
        universes: true,
      },
    });



    if (!assetClass) {
      return NextResponse.json(
        {
          error: "Asset class not found.",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json(assetClass);


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch asset class.",
      },
      {
        status: 500,
      }
    );
  }
}




export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const user = await getUserFromRequest();

    if (
      !user ||
      (user.accountType !== "ADMIN" &&
        user.accountType !== "DEV")
    ) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }


    const { id } = await params;

    const body = await req.json();

    const {
      fees,
      criteria,
      flowSteps,
      requirements,
      universes,
      ...assetData
    } = body;


    const updatedAssetClass = await prisma.$transaction(async (tx) => {


      // Remove old relational data
      await tx.assetClassFee.deleteMany({
        where: {
          assetClassId: id,
        },
      });


      await tx.assetClassCriterion.deleteMany({
        where: {
          assetClassId: id,
        },
      });


      await tx.assetClassFlowStep.deleteMany({
        where: {
          assetClassId: id,
        },
      });


      await tx.assetClassRequirement.deleteMany({
        where: {
          assetClassId: id,
        },
      });


      await tx.assetClassUniverse.deleteMany({
        where: {
          assetClassId: id,
        },
      });



      return tx.assetClass.update({
        where: {
          id,
        },

        data: {

          ...assetData,


          fees: {
            create: fees,
          },

          criteria: {
            create: criteria,
          },

          flowSteps: {
            create: flowSteps,
          },

          requirements: {
            create: requirements,
          },

          universes: {
            create: universes,
          },

        },

        include: {
          fees: true,
          criteria: true,
          flowSteps: true,
          requirements: true,
          universes: true,
        },
      });

    });



    return NextResponse.json({
      success: true,
      message: "Asset class updated successfully.",
      data: updatedAssetClass,
    });



  } catch(error:any) {

    console.error(error);

    return NextResponse.json(
      {
        error: error.message || "Failed to update asset class.",
      },
      {
        status:500,
      }
    );

  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const user = await getUserFromRequest();


    if (
      !user ||
      (user.accountType !== "ADMIN" &&
        user.accountType !== "DEV")
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized."
        },
        {
          status: 401
        }
      );
    }


    const { id } = await params;


    const assetClass = await prisma.assetClass.findUnique({
      where: {
        id
      },
      include: {
        investments: true,
      }
    });


    if (!assetClass) {
      return NextResponse.json(
        {
          error: "Asset class not found."
        },
        {
          status:404
        }
      );
    }



    if (assetClass.investments.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete asset class with existing investments."
        },
        {
          status:400
        }
      );
    }



    await prisma.assetClass.delete({
      where:{
        id
      }
    });



    return NextResponse.json({
      success:true,
      message:"Asset class deleted successfully."
    });



  } catch(error:any){

    console.error(error);

    return NextResponse.json(
      {
        error:error.message || "Failed to delete asset class."
      },
      {
        status:500
      }
    );

  }
}