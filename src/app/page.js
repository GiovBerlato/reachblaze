'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [promessa, setPromessa] = useState('');
  const [tom, setTom] = useState('');

  const [copiado, setCopiado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [historico, setHistorico] = useState([]);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setResult("Gerando...");
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {  'Content-Type': 'application/json' },
        body: JSON.stringify({produto, nicho, promessa, tom})
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.insight) {
        throw new Error(data.error || 'Falha na resposta do servidor.');
      }
      setResult(data.insight);
      const novaCampanha = {
        id: Date.now(), // ID único baseado no timestamp
        produto,
        nicho,
        texto: data.insight
      };
      const novoHistorico = [novaCampanha, ...historico];
      setHistorico(novoHistorico);

      localStorage.setItem('reachblaze_campanhas', JSON.stringify(novoHistorico));
    } catch (error) {
      console.error('Erro:', error);
      setResult("Erro ao gerar campanha.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); // Volta ao normal após 2 segundos
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Campanha-${produto.replace(/\s+/g, '-').toLowerCase() || 'reachblaze'}.md`;
    a.click();
    
    // Limpa a memória
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const salvas = localStorage.getItem('reachblaze_campanhas');
    if (salvas) {
      setHistorico(JSON.parse(salvas));
    }
  }, []);
  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-900">
      
      <aside className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Campanhas Anteriores</h2>
        
        <div className="space-y-4 flex-1">
          {historico.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma campanha salva ainda.</p>
          ) : (
            historico.map((campanha) => (
              <div key={campanha.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm hover:border-green-500 transition-colors">
                <h3 className="font-bold text-gray-900 truncate">{campanha.produto}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">Nicho: {campanha.nicho}</p>
                
                <details className="cursor-pointer text-xs text-gray-700">
                  <summary className="font-medium text-green-600 hover:text-green-700">Visualizar</summary>
                  <div className="mt-2 p-2 bg-white rounded border whitespace-pre-wrap max-h-48 overflow-y-auto font-mono text-[11px]">
                    {campanha.texto}
                  </div>
                </details>
              </div>
            ))
          )}
        </div>
      </aside>

      <section className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">ReachBlaze</h1>
            <p className="text-gray-600">Motor de Conversão para Creators</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
              <form onSubmit={handleGenerate} className="space-y-4" autoComplete="off">
                <div className="relative z-0">
                  <input type="text" value={produto} onChange={(request) => setProduto(request.target.value)} id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                  <label htmlFor="floating_standard" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Produto</label>
                </div>
                <div className="relative z-0">
                  <input type="text" value={nicho} onChange={(request) => setNicho(request.target.value)} id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                  <label htmlFor="floating_standard" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Nicho</label>
                </div>
                <div className="relative z-0">
                  <input type="text" value={promessa} onChange={(request) => setPromessa(request.target.value)} id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                  <label htmlFor="floating_standard" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Promessa</label>
                </div>
                <div className="relative z-0 mt-4">
                  <label className="block text-sm text-gray-500 mb-1">Tom de Voz da Campanha</label>
                  <select 
                    value={tom} 
                    onChange={(e) => setTom(e.target.value)}
                    className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Agressivo (Foco em Dor, Escassez e Urgência)">Agressivo (Foco em Urgência e Dor)</option>
                    <option value="Educacional (Foco em Autoridade, Dados e Lógica)">Educacional (Foco em Autoridade e Lógica)</option>
                    <option value="Storytelling (Foco em Emoção, Jornada e Conexão)">Storytelling (Foco em Emoção e Conexão)</option>
                    <option value="Sofisticado (Foco em Status, Exclusividade e Premium)">Sofisticado (Foco em Exclusividade/Premium)</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  {loading ? 'Forjando...' : 'Forjar Campanha'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold">Kit de Divulgação</h2>
                
                {/* Os botões só aparecem se houver resultado */}
                {result && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleCopy}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded font-medium transition-colors"
                    >
                      {copiado ? '✓ Copiado!' : 'Copiar Texto'}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded font-medium transition-colors"
                    >
                      Baixar .MD
                    </button>
                  </div>
                )}
              </div>

              <div className="whitespace-pre-wrap flex-1 text-sm text-gray-800 font-mono">
                {result ? result : <p className="text-gray-400 font-sans">Preencha os dados e escolha o tom para forjar a campanha.</p>}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}