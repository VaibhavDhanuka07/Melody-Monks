import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const realtimeAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export const realtimeService = {
  isConfigured() {
    return Boolean(realtimeAdmin);
  },
  async publish(channelName: string, event: string, payload: Record<string, unknown>) {
    if (!realtimeAdmin) {
      return false;
    }

    const channel = realtimeAdmin.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });

    const subscribed = await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => resolve(false), 3000);
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          clearTimeout(timeout);
          resolve(true);
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          clearTimeout(timeout);
          resolve(false);
        }
      });
    });
    if (!subscribed) {
      await realtimeAdmin.removeChannel(channel);
      return false;
    }

    const result = await channel.send({
      type: "broadcast",
      event,
      payload,
    });

    await realtimeAdmin.removeChannel(channel);
    return result === "ok";
  },
};
