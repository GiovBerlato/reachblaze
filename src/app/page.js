'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [promessa, setPromessa] = useState('');

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
        body: JSON.stringify({produto, nicho, promessa})
      });
      const data = await response.json();
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
  useEffect(() => {
    const salvas = localStorage.getItem('reachblaze_campanhas');
    if (salvas) {
      setHistorico(JSON.parse(salvas));
    }
  }, []);
  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-900">
      
      {/* COLUNA 1: BARRA LATERAL FIXA (HISTÓRICO) */}
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
            <p className="text-gray-600">Motor de Conversão para Creators YouShop</p>
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
                <button 
                  type="submit" 
                  disabled={loading} // Impede cliques duplos enquanto a IA processa
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  {loading ? 'Forjando...' : 'Forjar Campanha'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 whitespace-pre-wrap h-fit min-h-[400px]">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Kit de Divulgação Atual</h2>
              {result ? result : <p className="text-gray-400">Preencha os dados e clique em forjar.</p>}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}