export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Messages will be rendered here */}
        <div className="py-8 text-center text-gray-400 text-sm">
          Inicie uma nova análise estratégica
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              placeholder="Descreva seu briefing de marketing..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#495EE3] focus:border-transparent"
              rows={3}
            />
            <button 
              className="absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Nyvia fornece inteligência estratégica, não copy pronto
          </p>
        </div>
      </div>
    </div>
  )
}
