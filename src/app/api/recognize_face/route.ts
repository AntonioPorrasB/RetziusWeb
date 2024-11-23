import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Obtener el FormData de la request
    const formData = await request.formData();
    
    // Hacer la petición al servidor HTTP
    const response = await fetch('http://85.31.225.19/api/recognize_face', {
      method: 'POST',
      body: formData,
      // Puedes agregar headers si son necesarios
      // headers: {
      //   'Accept': 'application/json',
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in recognize_face API:', error);
    return NextResponse.json(
      { error: 'Error processing request', details: (error as Error).message },
      { status: 500 }
    );
  }
}