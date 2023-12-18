import { Handlers } from "$fresh/server.ts";
import {
  ServerSentEvent,
  ServerSentEventStreamTarget,
} from "$std/http/server_sent_event.ts";

const PUSH_DELAY_MILLISECONDS = 1_000;

export const handler: Handlers = {
  async GET(_req) {
    const sseTarget = new ServerSentEventStreamTarget({
      keepAlive: true,
    });
    let timer = 0;

    const checkForUpdates = async () => {
      const now = new Date();
      sendEvent(sseTarget, JSON.stringify({ now }));
      timer = setTimeout(checkForUpdates, PUSH_DELAY_MILLISECONDS);
    };

    sseTarget.addEventListener("close", () => {
      clearTimeout(timer);
    });

    checkForUpdates();
    return sseTarget.asResponse();
  },
};

function sendEvent(
  sseTarget: ServerSentEventStreamTarget,
  now: string,
) {
  const sse = new ServerSentEvent("message", {
    data: {
      now: now,
    },
  });
  sseTarget.dispatchEvent(sse);
}
