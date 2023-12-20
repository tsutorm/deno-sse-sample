import { Handlers } from "$fresh/server.ts";
import {
  type ServerSentEventMessage,
  ServerSentEventStream,
} from "https://deno.land/std@0.209.0/http/server_sent_event_stream.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";


const PUSH_DELAY_MILLISECONDS = 1_000;

export const handler: Handlers = {
  async GET(_req) {
    const timeIterator = (async function*() {
      while (true) {
        const now = new Date();
        yield {
          event: 'message',
          data: JSON.stringify(now)
        };
        await sleep(1);
      }
    })();
    const stream = ReadableStream.from<ServerSentEventMessage>(timeIterator).pipeThrough(new ServerSentEventStream());
    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "connection": "Keep-Alive",
      },
    });
  }
};
