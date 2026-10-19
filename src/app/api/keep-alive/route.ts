import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const [userCount, publishedAssetClassesCount] = await Promise.all([
      prisma.user.count(),
      prisma.assetClass.count({
        where: { isPublished: true },
      }),
    ]); 

    return NextResponse.json(
      { 
        success: true, 
        message: 'Database pinged successfully', 
        stats: {
          userCount,
          publishedAssetClassesCount,
        },
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Keep-alive ping failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}