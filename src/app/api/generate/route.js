import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { produto, nicho, promessa } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Chave de API não configurada no servidor.' },
        { status: 500 }
      );
    }

    console.log('Dados recebidos com segurança no Back-end:', { produto, nicho, promessa });

    return NextResponse.json({ 
      success: true, 
      insight: `Texto mockado da campanha para o produto ${produto}` 
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Falha interna ao processar a requisição.' },
      { status: 500 }
    );
  }
}