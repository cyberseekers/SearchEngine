import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/database/index";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { Admin: true },
    });

    return user && user.passwordHash === password
      ? NextResponse.json({
          username: user.username,
          isAdmin: !!user.Admin,
        })
      : NextResponse.json(
          { message: "Invalid username or password" },
          {
            status: 401,
          }
        );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
