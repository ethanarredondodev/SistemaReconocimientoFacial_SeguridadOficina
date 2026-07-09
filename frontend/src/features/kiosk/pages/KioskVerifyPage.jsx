import { useRef, useEffect, useState } from "react";
import { useKioskStore } from "../../../store/kioskStore";
import { verifyFace } from "../../../api/kioskApi";

const KioskVerifyPage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState("idle");
    const [result, setResult] = useState(null);
    const { officeName, clearOffice } = useKioskStore();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const captureAndVerify = async () => {
        if (status === "scanning") return;

        setStatus("scanning");
        setResult(null);

        try {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));
            const officeId = useKioskStore.getState().officeId;
            const data = await verifyFace(officeId, blob);

            setResult(data);
            setStatus(data.access_result === "PERMITIDO" ? "success" : "denied");

        } catch (err) {
            setStatus("error");
        } finally {
            setTimeout(() => {
                setStatus("idle");
                setResult(null);
            }, 4000);
        }
    };

    const statusConfig = {
        idle: {
            border: "4px solid #e0e0e0",
            bg: "white",
            message: null
        },
        scanning: {
            border: "4px solid #4f6ef7",
            bg: "#f0f4ff",
            message: "Escaneando..."
        },
        success: {
            border: "4px solid #40c057",
            bg: "#f0fff4",
            message: "✅ Acceso permitido"
        },
        denied: {
            border: "4px solid #fa5252",
            bg: "#fff0f0",
            message: "❌ Acceso denegado"
        },
        error: {
            border: "4px solid #fa5252",
            bg: "#fff0f0",
            message: "⚠️ Error al verificar"
        }
    };

    const current = statusConfig[status];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: current.bg,
            transition: "background 0.4s",
            gap: "24px",
            padding: "24px"
        }}>

            {/* Header */}
            <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: 0, color: "#1e1e2e", fontSize: "22px" }}>
                    COMPRAFÁCIL
                </h2>
                <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                    {officeName}
                </p>
            </div>

            {/* Cámara */}
            <div style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: current.border,
                transition: "border 0.3s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        width: "320px",
                        height: "240px",
                        display: "block",
                        objectFit: "cover"
                    }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            {/* Mensaje de estado */}
            {current.message && (
                <p style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: status === "success" ? "#40c057" : status === "scanning" ? "#4f6ef7" : "#fa5252",
                    margin: 0
                }}>
                    {current.message}
                </p>
            )}

            {/* Info del usuario si fue permitido */}
            {status === "success" && result?.user && (
                <p style={{
                    color: "#40c057",
                    fontSize: "16px",
                    margin: 0,
                    fontWeight: "500"
                }}>
                    Bienvenido, {result.user.full_name}
                </p>
            )}

            {status === "denied" && (
                <p style={{ color: "#ff6b6b", fontSize: "16px", margin: 0 }}>
                    Acceso denegado para {result.user?.full_name ?? "desconocido"}
                </p>
            )}

            {/* Botón de verificación */}
            {status === "idle" && (
                <button
                    onClick={captureAndVerify}
                    style={{
                        padding: "16px 48px",
                        background: "#4f6ef7",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 4px 12px rgba(79,110,247,0.3)"
                    }}
                >
                    Iniciar verificación
                </button>
            )}

            {/* Reconfigurar dispositivo */}
            <button
                onClick={clearOffice}
                style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    padding: "8px 12px",
                    background: "transparent",
                    border: "1px solid #ddd",
                    color: "#aaa",
                    borderRadius: "6px",
                    fontSize: "11px",
                    cursor: "pointer"
                }}
            >
                Reconfigurar
            </button>

        </div>
    );
};

export default KioskVerifyPage;