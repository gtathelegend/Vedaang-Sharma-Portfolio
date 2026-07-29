import { NextResponse } from "next/server";
import { getAggregatedKnowledge } from "@/lib/ask/knowledgeAggregator";
import { answerQuestion } from "@/lib/ask/askEngine";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { message: "Query message is required." },
        { status: 400 }
      );
    }

    const kb = await getAggregatedKnowledge();
    const answer = answerQuestion(message, kb);

    // Support streaming responses via ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream text in small realistic word chunks
        const chunks = answer.split(" ");
        for (let i = 0; i < chunks.length; i++) {
          const word = (i === 0 ? "" : " ") + chunks[i];
          controller.enqueue(encoder.encode(word));
          await new Promise((r) => setTimeout(r, 20)); // smooth typewriter timing
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("[POST /api/ask]", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
