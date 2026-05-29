'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">ReachBlaze</h1>
        <p className="text-gray-600 mb-8">Motor de Conversão para Creators YouShop</p>
        
        {/* O sistema vai entrar aqui */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            [ Formulário entrará aqui ]
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            [ Resultados entrarão aqui ]
          </div>
        </div>
      </div>
    </main>
  );
}