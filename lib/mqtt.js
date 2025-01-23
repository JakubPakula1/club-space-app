import mqtt from "mqtt";

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
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }
  return client;
};
