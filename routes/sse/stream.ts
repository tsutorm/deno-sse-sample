import { Handlers } from "$fresh/server.ts";
import {
  type ServerSentEventMessage,
  ServerSentEventStream,
} from "https://deno.land/std@0.209.0/http/server_sent_event_stream.ts";


const PUSH_DELAY_MILLISECONDS = 1_000;

export const handler: Handlers = {
  async GET(_req) {
    let interval: number;
    const stream = new ReadableStream<ServerSentEventMessage>({
      start(controller) {
        interval = setInterval(() => {
          const now = new Date();
          const payload = {
            event: "message",
            data: { now: JSON.stringify(now) }
          };
          console.log(payload);
          controller.enqueue([payload]);
        }, PUSH_DELAY_MILLISECONDS);
      },
      cancel() {
        clearInterval(interval);
      },
    }).pipeThrough(new ServerSentEventStream());
    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
      },
    });
  }
};
