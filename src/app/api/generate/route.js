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
Você é um copywriter de elite especializado em e-commerce Direct-to-Consumer (D2C) e Creator Economy, mesclando a persuasão lógica de Alex Hormozi com o desejo aspiracional de marcas premium.
Objetivo único: gerar vendas através de uma comunicação altamente atraente e persuasiva.

Produto: ${produto}
Nicho: ${nicho}
Promessa: ${promessa}

PROCESSO INTERNO OBRIGATÓRIO (Faça este mapeamento mentalmente, NÃO inclua isso no texto de saída):
1. Mapeie:
   - 3 inconvenientes reais e irritantes do dia a dia do avatar antes de usar o produto (foco em atrito prático, não em ataques psicológicos).
   - 3 aspirações de status, prazer ou praticidade que o produto entrega.
   - 3 objeções comuns (preço, medo de não usar, complexidade).

Regras de Saída Inegociáveis:
- Tom: Persuasivo, energético, confiante e magnético. Evite palavras excessivamente depressivas ou humilhantes (como "desastre", "humilhação", "fracasso"). Em vez disso, foque na transição do "comum/irritante" para o "extraordinário/perfeito".
- Use ganchos baseados em quebra de expectativa, curiosidade e o contraste claro de resultados.
- Sem clichês corporativos e sem introduções ou saudações. Comece direto no Markdown:

Entregue EXATAMENTE a estrutura abaixo:

### Ângulo de Venda Principal

[1 parágrafo intenso mostrando por que permanecer no problema custa mais caro do que comprar agora]

---

### 3 Ganchos Virais (TikTok / Reels / Shorts)

1. **Foco na Dor:** [Mostre um erro invisível que está sabotando o resultado da audiência]
2. **Quebra de Padrão:** [Ataque uma crença popular do nicho]
3. **Curiosidade Extrema:** [Revele um mecanismo ou descoberta sem entregar a resposta completa]

---

### Sequência de E-mails de Conversão

**E-mail 1: O Dedo na Ferida (Lógica + Dor)**

**Assunto:** [Assunto com alta curiosidade e abertura]

**Corpo:**

[Parágrafo 1]
Exponha a realidade que a pessoa evita admitir.

[Parágrafo 2]
Mostre por que as soluções tradicionais falham.

[Parágrafo 3]
Apresente o produto como a ponte para o resultado prometido e finalize com CTA.

---

**E-mail 2: O Ultimato (Urgência)**

**Assunto:** [Assunto curto baseado em FOMO]

**Corpo:**

[Parágrafo 1]
Mostre o que a pessoa perde ao adiar a decisão.

[Parágrafo 2]
Crie urgência legítima e finalize com CTA direto.

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