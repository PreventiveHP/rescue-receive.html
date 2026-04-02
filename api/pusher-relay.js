 const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "2136238",
  key: "284fc98940a4b6d4c359",
  secret: "12350b4e5f5a0b796bb3",
  cluster: "us2",
  useTLS: true
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extraemos channel_id y location que vienen del Sender
    const { sys, dia, patient, provider, channel_id, location } = req.body;

    try {
        // Lógica de Sintonización: 
        // Si hay un channel_id, enviamos al canal privado. 
        // Si no (por error), usamos el canal global.
        const targetChannel = channel_id ? `rescue-${channel_id}` : "montcode-rescue";

        await pusher.trigger(targetChannel, "new-reading", {
            sys, 
            dia, 
            patient, 
            provider,
            location: location || "No GPS Data" // Pasamos la coordenada al familiar
        });

        res.status(200).json({ 
            sent: true, 
            directed_to: targetChannel 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
