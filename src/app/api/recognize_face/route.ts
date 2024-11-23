import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Recibiendo petición en el proxy...');
    
    const formData = await request.formData();
    console.log('FormData recibido:', Array.from(formData.entries()).map(([key]) => key));

    // Agregar logs para la petición al servidor
    console.log('Intentando conectar con:', 'http://85.31.225.19/api/recognize_face');
    
    const response = await fetch('http://85.31.225.19/api/recognize_face', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Respuesta del servidor:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Datos recibidos del servidor:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error completo en recognize_face API:', error);
    // Devolver un error más descriptivo
    return NextResponse.json(
      { 
        error: 'Error processing request', 
        details: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    );
  }
}

// Aumentar el tiempo límite de la petición
export const runtime = 'edge';