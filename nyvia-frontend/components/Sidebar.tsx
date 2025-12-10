export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button 
          className="w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
          style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
        >
          + Nova Análise
        </button>
      </div>

      {/* Workspaces List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Workspaces
          </h3>
          
          <div className="space-y-1">
            {/* Workspace Item - Active */}
            <button className="w-full px-3 py-2 text-sm text-left rounded-lg bg-white/10 hover:bg-white/15 transition-colors">
              <div className="font-medium">Meu Primeiro Cliente</div>
              <div className="text-xs text-gray-400 mt-0.5">3 conversas</div>
            </button>

            {/* Workspace Item - Inactive */}
            <button className="w-full px-3 py-2 text-sm text-left rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
              <div className="font-medium">Projeto Exemplo</div>
              <div className="text-xs text-gray-400 mt-0.5">1 conversa</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
          ⚙️ Configurações
        </button>
      </div>
    </aside>
  )
}
