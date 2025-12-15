'use client'

import { useState, useEffect } from 'react'

interface Workspace {
  id: number
  name: string
  description: string
}

interface Artifact {
  id: number
  filename: string
  original_name: string
  file_size: number
  created_at: string
}

interface SidebarProps {
  onNewChat: () => void
  activeWorkspaceId?: number
  onWorkspaceChange?: (workspaceId: number) => void
}

export default function Sidebar({ onNewChat, activeWorkspaceId, onWorkspaceChange }: SidebarProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Busca os workspaces ao montar o componente
  useEffect(() => {
      const fetchWorkspaces = async () => {
        try {
          const response = await fetch('/api/workspaces', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
          const data = await response.json()
          setWorkspaces(data.workspaces || [])
        } catch (error) {
          console.error('Erro ao buscar workspaces:', error)
        }
      }
      fetchWorkspaces()
    }, [])
  
  // Busca os artefatos quando o workspace ativo muda ou ao montar o componente    
  useEffect(() => {
    if (activeWorkspaceId) {
      fetchArtifacts()
    }
  }, [activeWorkspaceId])

  const fetchArtifacts = async () => {
    try {
      const response = await fetch(`/api/artifacts/${activeWorkspaceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setArtifacts(data.artifacts || [])
    } catch (error) {
      console.error('Erro ao buscar artefatos:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/artifacts/${activeWorkspaceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        fetchArtifacts()
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleDeleteArtifact = async (id: number) => {
    try {
      const response = await fetch(`/api/artifacts/${activeWorkspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        fetchArtifacts()
      }
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }  

  // Renderização do componente Sidebar
    return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Botão Nova Consulta */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9749E3] text-white rounded-lg hover:bg-[#7C3AB8] transition-colors font-medium"
        >
          <span className="text-xl">+</span>
          <span>Nova Consulta</span>
        </button>
      </div>

      {/* Seção Workspaces */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Workspaces
        </h3>
        <div className="space-y-1">
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => onWorkspaceChange?.(workspace.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  activeWorkspaceId === workspace.id
                    ? 'bg-[#9749E3] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {workspace.name}
              </button>
            ))
          ) : (
            <div className="text-sm text-gray-400 italic">
              Nenhum workspace
            </div>
          )}
        </div>
      </div>

      {/* Seção Artefatos */}
      <div className="px-4 py-2 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Artefatos
        </h3>
        
        <label className="block mb-2">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
            disabled={isUploading}
          />
          <div className="w-full text-center px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">
            {isUploading ? 'Enviando...' : '+ Upload'}
          </div>
        </label>

        <div className="space-y-1 max-h-32 overflow-y-auto">
          {artifacts.length > 0 ? (
            artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="flex items-center justify-between px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100"
              >
                <span className="truncate flex-1" title={artifact.original_name}>
                  {artifact.original_name}
                </span>
                <button
                  onClick={() => handleDeleteArtifact(artifact.id)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic">
              Nenhum documento
            </div>
          )}
        </div>
      </div>

      {/* Seção Conta */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Conta
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            Perfil
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            Pagamento
          </button>
        </div>
      </div>
    </aside>
  )
}