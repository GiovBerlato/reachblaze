'use client';
import { useState } from "react";

export default function Home() {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [promessa, setPromessa] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
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
    } catch (error) {
      console.error('Erro:', error);
      setResult("Erro ao gerar campanha.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">ReachBlaze</h1>
        <p className="text-gray-600 mb-8">Motor de Conversão para Creators</p>
        
        {/* O sistema vai entrar aqui */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 whitespace-pre-wrap">
            <h2 className="text-xl font-bold mb-4">Kit de Divulgação</h2>
            {result ? result : <p className="text-gray-400">Preencha os dados e clique em forjar.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}