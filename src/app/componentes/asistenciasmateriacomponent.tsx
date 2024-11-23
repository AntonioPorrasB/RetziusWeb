import React, { useEffect, useRef } from "react";

interface AsistenciasMateriaComponentProps {
  subjectId: number;
}

type RecognitionResult = {
    name: string;
    mask: string;
    hat: string;
  };

const AsistenciasMateriaComponent: React.FC<AsistenciasMateriaComponentProps> = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastCapturedTime = useRef<number>(0);
  const captureInterval = 500; // Captura cada 0.5 segundos

  

  // Inicia el reconocimiento facial
  const startRecognition = () => {
    console.log("Reconocimiento facial iniciado");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            requestAnimationFrame(captureFrame);
          }
        })
        .catch((error) => {
          console.error("Error al acceder a la cámara:", error);
          alert(
            "No se pudo acceder a la cámara. Por favor, verifica los permisos."
          );
        });
    } else {
      alert("Tu navegador no soporta el acceso a la cámara.");
    }
  };

  // Captura un fotograma y lo procesa
  const captureFrame = (timestamp: number) => {
    if (timestamp - lastCapturedTime.current > captureInterval) {
      lastCapturedTime.current = timestamp;

      if (canvasRef.current && videoRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) {
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          // Convierte el fotograma en un Blob y lo envía al servidor
          canvasRef.current.toBlob(
            (blob) => {
              if (blob) {
                const formData = new FormData();
                formData.append("image", blob, "frame.jpg");

                fetch("http://85.31.225.19/api/recognize_face", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Resultados reconocidos:", data.results);
                    updateStudentList(data.results);

                    // Muestra la imagen procesada
                    if (data.processedImage) {
                      const img = new Image();
                      img.src = data.processedImage;
                      img.onload = () => {
                        if (context) {
                          context.drawImage(
                            img,
                            0,
                            0,
                            canvasRef.current!.width,
                            canvasRef.current!.height
                          );
                        }
                      };
                    }
                  })
                  .catch((error) => {
                    console.error(
                      "Error al enviar la imagen al servidor:",
                      error
                    );
                  });
              }
            },
            "image/jpeg",
            0.8
          );
        }
      }
    }

    requestAnimationFrame(captureFrame);
  };

  // Actualiza la lista de estudiantes reconocidos
  const updateStudentList = (results: RecognitionResult[]) => {
    if (!Array.isArray(results) || results.length === 0) return;

    const studentList = document.getElementById("lista-estudiantes");
    if (!studentList) return;

    results.forEach((result) => {
      const studentName = result.name;
      const maskStatus = result.mask;
      const hatStatus = result.hat;

      if (studentName === "Desconocido") return;

      // Evitar agregar duplicados en la lista
      if (
        !Array.from(studentList.children).some((li) =>
          li.textContent?.includes(studentName)
        )
      ) {
        const listItem = document.createElement("li");
        listItem.className = "estudiante";
        listItem.textContent = `${studentName} - Presente - ${maskStatus} - ${hatStatus}`;
        studentList.appendChild(listItem);
      }
    });
  };

  useEffect(() => {

    const currentVideoRef = videoRef.current;
    // Limpia el recurso de la cámara cuando el componente se desmonta
    return () => {
      if (currentVideoRef && currentVideoRef.srcObject) {
        const stream = currentVideoRef.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="container mt-5">
      {/* Sección Reconocimiento Facial */}
      <section
        className="text-center d-flex flex-column align-items-center mb-4"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 className="mb-4">Reconocimiento Facial</h3>
        <div className="camera-container mb-3" style={{ position: "relative" }}>
          <video
            id="camera"
            width="400"
            height="300"
            autoPlay
            ref={videoRef}
            style={{ display: "none" }}
          ></video>
          <canvas
            id="canvas"
            width="400"
            height="300"
            ref={canvasRef}
            style={{
              border: "2px solid #ddd",
              width: "100%",
              height: "auto",
            }}
          ></canvas>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={startRecognition}
          style={{ fontSize: "16px" }}
        >
          <i className="fas fa-camera me-2"></i>
          Iniciar Reconocimiento
        </button>
      </section>

      {/* Sección Registro de Asistencia */}
      <section className="text-center mt-4">
        <button
          className="btn btn-success"
          style={{ fontSize: "16px", padding: "10px 20px" }}
        >
          Reporte
        </button>
        <ul id="lista-estudiantes" className="mt-3"></ul>
      </section>
    </div>
  );
};

export default AsistenciasMateriaComponent;
