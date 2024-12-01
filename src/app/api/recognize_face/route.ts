import { NextResponse } from 'next/server';
import axios from 'axios';

// Especificar que use Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    console.log('Recibiendo petición en el proxy...');
    
    const formData = await request.formData();
    
    // Usar axios para la petición
    const response = await axios.post('http://srv643335.hstgr.cloud:8000/api/recognize_face/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error en recognize_face API:', error);
    
    // Mejorar el mensaje de error
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Error processing request',
          details: error.message,
          response: error.response?.data,
          status: error.response?.status
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Error processing request',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// Configuración adicional
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};