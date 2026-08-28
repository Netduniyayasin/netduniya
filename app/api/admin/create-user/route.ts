import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      fullName, 
      email, 
      password, 
      role = "admin", 
      phoneNumber = "",
      rules = ["all"],
      creatorName = "Admin",
      creatorId = "admin"
    } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Full name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Firebase API Key is not configured" },
        { status: 500 }
      );
    }

    // 1. Create User in Firebase Authentication via Identity Toolkit REST API
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password,
        returnSecureToken: true,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      const errorMessage = authData.error?.message || "Failed to create user in Firebase Auth";
      let friendlyError = errorMessage;
      if (errorMessage === "EMAIL_EXISTS") {
        friendlyError = "This email is already registered. You can edit their role in the user list.";
      }
      return NextResponse.json({ error: friendlyError }, { status: 400 });
    }

    const uid = authData.localId;
    const now = Date.now();

    // 2. Create User Profile in Firestore
    const userProfile = {
      uid,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      role: role,
      rules: rules || ["all"],
      walletBalance: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, "users", uid), userProfile);

    // If administrative role, save directly to dedicated admins collection
    if (role !== "user") {
      await setDoc(doc(db, "admins", uid), {
        uid,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        role: role,
        rules: rules || ["all"],
        isActive: true,
        createdBy: creatorName,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. Record Audit Log
    const logId = `AUD-${now}-${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, "auditLogs", logId), {
      id: logId,
      actorId: creatorId,
      actorName: creatorName,
      actorRole: "admin",
      action: "create_staff_admin",
      module: "users",
      recordId: uid,
      details: `Created new staff/admin: ${fullName} (${email}) with role: ${role}`,
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      user: {
        uid,
        fullName: userProfile.fullName,
        email: userProfile.email,
        role: userProfile.role,
      },
    });
  } catch (error: any) {
    console.error("Error creating staff/admin user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create staff account" },
      { status: 500 }
    );
  }
}
