import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

interface AsistenciasMateriaComponentProps {
  subjectId: number;
  subjectName: string;
  numero_control: string;
}

type RecognitionResult =  {
  name: string;
};

type RecognizedStudent = RecognitionResult & {
    numeroControl: string;
    nombre: string;
    apellido: string;
  };

const AsistenciasMateriaComponent: React.FC<AsistenciasMateriaComponentProps> = ({subjectId, subjectName, numero_control}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastCapturedTime = useRef<number>(0);
  const captureInterval = 500; // Captura cada 0.5 segundos
  const animationFrameRef = useRef<number | null>(null);
  const [recognizedStudents, setRecognizedStudents] = useState<RecognizedStudent[]>([]);



  const stopRecognition = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
  
      // Detiene todos los tracks (cámara y micrófono si existen)
      stream.getTracks().forEach((track) => {
        track.stop();
      });
  
      // Limpia la referencia al stream
      videoRef.current.srcObject = null;
    }
  
    // Cancela cualquier frame de animación pendiente
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null; // Limpia la referencia al frame
    }
  
    // Limpia el canvas para evitar que quede la última imagen capturada
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  
    console.log("Reconocimiento facial detenido completamente.");
  };

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
  const captureFrame = async (timestamp: number) => {
    if (timestamp - lastCapturedTime.current > captureInterval) {
      lastCapturedTime.current = timestamp;
  
      if (canvasRef.current && videoRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) {
          try {
            // Debug: Verificar que la imagen se captura
            context.drawImage(
              videoRef.current,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            console.log("Frame capturado correctamente");
  
            // Debug: Verificar el blob
            const blob = await new Promise<Blob | null>((resolve) => {
              canvasRef.current?.toBlob(
                (blob) => {
                  console.log("Blob creado:", blob?.size, "bytes");
                  resolve(blob);
                },
                "image/jpeg",
                0.8
              );
            });
  
            if (!blob) {
              throw new Error("No se pudo crear el blob de la imagen");
            }
  
            const formData = new FormData();
            formData.append("image", blob, "frame.jpg");
            
            // Debug: Verificar FormData
            console.log("FormData creado con blob");
  
            // Hacer la petición con logs detallados
            console.log("Iniciando petición a:", "http://srv643335.hstgr.cloud/api/recognize_face/");
            const response = await fetch("/api/recognize_face", {
              method: "POST",
              body: formData,
              mode: 'cors',
              credentials: 'same-origin',
            });
            
            // Este código no se ejecutará si hay error de CORS
            console.log("Respuesta recibida:", response.status);
            const data = await response.json();
            console.log("Datos procesados:", data);
            
            updateStudentList(data.results);
  
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
          } catch (error: unknown) {
            // Manejo tipado del error
            if (error instanceof Error) {
              console.error("Error detallado:", {
                message: error.message,
                type: error.name,
                stack: error.stack
              });
            } else if (error && typeof error === 'object' && 'message' in error) {
              console.error("Error con mensaje:", error.message);
            } else {
              console.error("Error desconocido:", error);
            }
          }
        }
      }
    }
  
    animationFrameRef.current = requestAnimationFrame(captureFrame);
  };

  // Actualiza la lista de estudiantes reconocidos
  const updateStudentList = async (results: RecognitionResult[]) => {
    if (!Array.isArray(results) || results.length === 0) return;

    const filteredResults = results.filter(
        (result) => result.name !== "Desconocido"
    );

    // Crear un array para almacenar estudiantes reconocidos
    const newRecognizedStudents: RecognizedStudent[] = [];

    for (const result of filteredResults) {
        try {
            const response = await fetch(`https://regzusapi.onrender.com/students/by_control/${result.name}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
                },
            });

            if (!response.ok) {
                console.error(`No se encontró estudiante con número de control: ${result.name}`);
                continue;
            }

            const studentData = await response.json();

            // Crear un estudiante reconocido
            const recognizedStudent: RecognizedStudent = {
                name: result.name,
                numeroControl: studentData.numero_control,
                nombre: studentData.nombre,
                apellido: studentData.apellido
            };

            // Verificar si ya existe
            const isAlreadyAdded = newRecognizedStudents.some(
                (student) => student.numeroControl === recognizedStudent.numeroControl
            );

            if (!isAlreadyAdded) {
                newRecognizedStudents.push(recognizedStudent);
            }

        } catch (error) {
            console.error(`Error al obtener datos del estudiante ${result.name}:`, error);
        }
    }

    // Actualizar el estado con los nuevos estudiantes reconocidos
    setRecognizedStudents(prevStudents => {
        // Combinar estudiantes existentes con nuevos, evitando duplicados
        const combinedStudents = [
            ...prevStudents,
            ...newRecognizedStudents.filter(
                newStudent => !prevStudents.some(
                    existingStudent => existingStudent.numeroControl === newStudent.numeroControl
                )
            )
        ];

        return combinedStudents;
    });
  };

  const generateExcelReport = () => {
    if (recognizedStudents.length === 0) {
      alert("No se han reconocido alumnos aún.");
      return;
    }
  
    const today = new Date().toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  
    const data = recognizedStudents.map((student) => ({
      Matricula: student.numeroControl, // Primeros 4 caracteres
      Apellidos: student.apellido,
      Nombre: student.nombre
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");
  
    XLSX.utils.sheet_add_aoa(worksheet, [[`Materia: ${subjectName}`]], {
      origin: "A1",
    });
    XLSX.utils.sheet_add_aoa(worksheet, [[`Fecha: ${today}`]], { origin: "A2" });
  
    XLSX.writeFile(workbook, `Asistencia_${subjectName}_${today}.xlsx`);
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
          className="btn btn-primary d-flex align-items-center mb-1"
          onClick={startRecognition}
          style={{ fontSize: "16px" }}
        >
          <i className="fas fa-camera me-2"></i>
          Iniciar Reconocimiento
        </button>
        <button
          className="btn btn-danger d-flex align-items-center"
          onClick={stopRecognition}
          style={{ fontSize: "16px" }}
        >
          <i className="fas fa-stop me-2"></i>
           Detener Reconocimiento
        </button>
      </section>

      {/* Sección Registro de Asistencia */}
      <section className="text-center mt-4">
        <button
          className="btn btn-success"
          style={{ fontSize: "16px", padding: "10px 20px" }}
          onClick={generateExcelReport}
        >
          Reporte
        </button>
      </section>
    </div>
  );
};

export default AsistenciasMateriaComponent;
