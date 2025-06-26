import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// Avatar component
const Avatar = ({ speaking }) => {
  const { scene } = useGLTF("/avatar.glb");
  const [headMesh, setHeadMesh] = useState(null);
  const [handMesh, setHandMesh] = useState(null);

  const mouthOpenIndex = useRef(null);
  const mouthSmileIndex = useRef(null);
  const waveRef = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (!scene || initialized.current) return;
    initialized.current = true;

    scene.traverse((child) => {
      if (child.isMesh) {
        console.log("Mesh Name:", child.name);
        console.log("Morph Targets:", child.morphTargetDictionary);

        // Adjust these names to fit your model
        if (child.name.toLowerCase().includes("head")) {
          setHeadMesh(child);
          mouthOpenIndex.current = child.morphTargetDictionary?.["mouthOpen"];
          mouthSmileIndex.current = child.morphTargetDictionary?.["mouthSmile"];
        }

        if (child.name.toLowerCase().includes("hand") || child.name.toLowerCase().includes("arm")) {
          setHandMesh(child);
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (
      speaking &&
      headMesh?.morphTargetInfluences &&
      mouthOpenIndex.current != null &&
      mouthSmileIndex.current != null
    ) {
      const t = Math.sin(Date.now() * 0.015);
      const intensity = (t + 1) / 2;
      headMesh.morphTargetInfluences[mouthOpenIndex.current] = intensity * 0.4;
      headMesh.morphTargetInfluences[mouthSmileIndex.current] = intensity * 0.5;
    } else if (
      headMesh?.morphTargetInfluences &&
      mouthOpenIndex.current != null &&
      mouthSmileIndex.current != null
    ) {
      headMesh.morphTargetInfluences[mouthOpenIndex.current] *= 0.8;
      headMesh.morphTargetInfluences[mouthSmileIndex.current] *= 0.8;
    }

    if (speaking && handMesh) {
      waveRef.current += 0.02;
      handMesh.rotation.z = Math.sin(waveRef.current) * 0.15;
    } else if (handMesh) {
      handMesh.rotation.z *= 0.8;
    }
  });

  return <primitive object={scene} scale={1.5} position={[0, -2.3, 0]} />;
};

useGLTF.preload("/avatar.glb");

// Avatar Canvas
const AvatarCanvas = ({ speaking }) => (
  <Canvas camera={{ position: [0, 0, 5], fov: 11 }}>
    <ambientLight intensity={1} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} />
    <Suspense fallback={null}>
      <Avatar speaking={speaking} />
    </Suspense>
  </Canvas>
);

// Main Chat App
const AvatarChat = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const chatBoxRef = useRef(null);
  const voiceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const femaleVoice =
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("samantha")) ||
        voices.find((v) => v.lang.startsWith("en"));
      voiceRef.current = femaleVoice;
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceRef.current;
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    const newMessages = [...messages, { sender: "You", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");

    try {
      const res = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: userMessage }),
      });

      const data = await res.json();
      if (data.length > 0) {
        const botReply = data[0].text;
        setMessages((prev) => [...prev, { sender: "AI", text: botReply }]);
        speak(botReply);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "50%", height: "100%", background: "#0f172a" }}>
        <AvatarCanvas speaking={speaking} />
      </div>
      <div style={{ width: "50%", height: "100%", background: "#1e293b", display: "flex", flexDirection: "column", color: "#fff" }}>
        <div ref={chatBoxRef} style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <strong>{msg.sender}: </strong>{msg.text}
            </div>
          ))}
        </div>
        <div style={{ padding: "10px", display: "flex", gap: "10px", background: "#0f172a" }}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px" }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 16px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarChat;
