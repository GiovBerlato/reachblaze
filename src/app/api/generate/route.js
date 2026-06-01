import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { produto, nicho, promessa } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Chave de API não configurada.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const prompt = `
Você é um copywriter de resposta direta de elite, especialista na "creator economy" e no mercado de afiliados digitais.
Sua missão é criar um kit de divulgação letal e altamente persuasivo para o seguinte produto:

- Produto: ${produto}
- Nicho: ${nicho}
- Promessa Principal: ${promessa}

Regras inegociáveis:
1. Seu objetivo único é gerar vendas e conversão.
2. Ignore introduções, não seja educado, não explique o que vai fazer.
3. Use gatilhos mentais (escassez, urgência, curiosidade, dor).
4. Entregue EXATAMENTE a estrutura abaixo, formatada em Markdown para fácil leitura:

### 🎯 Ângulo de Venda Principal
[Descreva em apenas um parágrafo brutal o motivo psicológico pelo qual a audiência precisa comprar isso AGORA e não amanhã]

---

### 🎣 3 Ganchos Virais (Para TikTok / Reels / Shorts)
1. **Foco na Dor:** [Gancho que expõe um erro que a pessoa está cometendo]
2. **Quebra de Padrão:** [Gancho que contraria uma crença popular do nicho]
3. **Curiosidade Extrema:** [Gancho que revela um segredo sem dar a resposta final]

---

### 📧 Sequência de E-mails de Conversão

**E-mail 1: O Dedo na Ferida (Lógica + Dor)**
**Assunto:** [Crie um assunto magnético com alta taxa de abertura]
**Corpo:** [E-mail persuasivo de 3 parágrafos curtos. Mostre a realidade cruel do problema, apresente o produto como a única ponte segura e finalize com a chamada para ação (CTA)]

**E-mail 2: O Ultimato (Urgência)**
**Assunto:** [Assunto curto focado em FOMO - Fear Of Missing Out]
**Corpo:** [E-mail rápido de 2 parágrafos. O que ele perde se fechar essa aba agora? Crie urgência real e justifique o clique imediato]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    // Devolve a resposta limpa para o seu Front-end
    return NextResponse.json({ 
      success: true, 
      insight: response.text 
    });

  } catch (error) {
    console.error("Erro na comunicação com o Gemini:", error);
    return NextResponse.json(
      { error: 'Falha interna ao forjar a campanha.' }, 
      { status: 500 }
    );
  }
}