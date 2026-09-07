import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type ChatMessage } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: "Слишком длинное сообщение (макс. 500 символов)" }, { status: 400 });
    }

    const db = getDb();
    const msgRef = db.collection("chat_messages").doc();
    
    await msgRef.set({
      id: msgRef.id,
      user_id: user.uid,
      content,
      is_deleted: false,
      is_muted: false,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ id: msgRef.id, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await getUserFromRequest(req);
    const db = getDb();
    const snapshot = await db.collection("chat_messages")
      .orderBy("created_at", "asc")
      .limit(100)
      .get();

    const messages: ChatMessage[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ChatMessage));

    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
