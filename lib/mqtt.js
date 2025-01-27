import mqtt from "mqtt";
import toast from "react-hot-toast";
let client;

export const getMQTTClient = () => {
  if (!client) {
    client = mqtt.connect("ws://localhost:9001", {
      clientId: "nextjs_" + Math.random().toString(16).substr(2, 8),
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    });

    client.on("connect", () => {
      console.log("MQTT Connected");
      client.subscribe("groups/new");
      client.subscribe("users/+/status");
      client.subscribe("reactions/+");
    });
    client.on("message", (topic, message) => {
      if (topic === "groups/new") {
        const groupData = JSON.parse(message.toString());
        toast.success(`Nowa grupa "${groupData.name}" została utworzona!`, {
          duration: 4000,
          position: "top-right",
        });
      }

      if (topic.startsWith("reactions/")) {
        const postId = topic.split("/")[1];
        const reactionData = JSON.parse(message.toString());
        toast.success(
          `${reactionData.username} zareagował na post: ${reactionData.reaction}`,
          {
            duration: 2000,
          }
        );
      }
    });
    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }
  return client;
};

export const publishReaction = (postId, reaction, username) => {
  client.publish(
    `reactions/${postId}`,
    JSON.stringify({
      reaction,
      username,
      timestamp: new Date(),
    })
  );
};
