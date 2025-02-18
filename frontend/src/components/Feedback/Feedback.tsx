import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./Feedback.css"

type UserType = 'aluno' | 'professor'

type Escola = {
  id: number
  nomeEscola: string
}

type Professor = {
  id: number
  nome: string
  data_nascimento: string
  cpf: string
  email: string
  escola: Escola
  created_at: string
  updated_at: string
  escola_id: number
  materia: string
  turmas: string
  dias_aula: string[]
}

type Feedback = {
  id: number
  conteudo: string
  destinatario_id: number
  destinatario_type: 'Aluno' | 'Professor'
  autor_id: number
  autor_type: 'Aluno' | 'Professor'
  tipo: 'sobre_tarefa' | 'sobre_desempenho'
  tarefa_id?: number
  created_at: string
  updated_at: string
  autor: {
    id: number
    nome: string
  }
}

type Aluno = {
  id: number
  nome: string
}

type Tarefa = {
  id: number
  titulo: string
}

const FeedbackComponent: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [destinatarios, setDestinatarios] = useState<(Aluno | Professor)[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [newFeedback, setNewFeedback] = useState({ 
    destinatario_id: "", 
    conteudo: "",
    tarefa_id: "" 
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [destinatarioSearchTerm, setDestinatarioSearchTerm] = useState("")
  const [tarefaSearchTerm, setTarefaSearchTerm] = useState("")
  const [showDestinatarioOptions, setShowDestinatarioOptions] = useState(false)
  const [showTarefaOptions, setShowTarefaOptions] = useState(false)

  const destinatarioRef = useRef<HTMLDivElement>(null)
  const tarefaRef = useRef<HTMLDivElement>(null)

  const getAuthToken = (): string | null => {
    const authData = localStorage.getItem('auth')
    if (!authData) return null
    try {
      const { token } = JSON.parse(authData)
      return token
    } catch {
      return null
    }
  }

  useEffect(() => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      const { user } = JSON.parse(authData)
      setUserType(user.tipo as UserType)
    }

    fetchFeedbacks()
  }, [])

  useEffect(() => {
    if (userType === 'aluno' || userType === 'professor') {
      fetchDestinatarios()
      fetchTarefas()
    }
  }, [userType])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinatarioRef.current && !destinatarioRef.current.contains(event.target as Node)) {
        setShowDestinatarioOptions(false)
      }
      if (tarefaRef.current && !tarefaRef.current.contains(event.target as Node)) {
        setShowTarefaOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchDestinatarios = async () => {
    const token = getAuthToken()
    
    try {
        const endpoint = userType === 'aluno' 
            ? 'http://localhost:3000/api/professores'
            : 'http://localhost:3000/api/alunos'
        
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        const responseText = await response.text()
        
        if (response.ok) {
            const data = JSON.parse(responseText)
            setDestinatarios(data)
        } else {
            console.error('Resposta não ok:', responseText)
        }
    } catch (error) {
        console.error('Erro ao buscar destinatários:', error)
    }
}

  const fetchTarefas = async () => {
    const token = getAuthToken()
    if (!token) return
    
    try {
      const response = await fetch('http://localhost:3000/api/tarefas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTarefas(data)
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
    }
  }

  const fetchFeedbacks = async () => {
    const token = getAuthToken()
    if (!token) return
    
    try {
      const response = await fetch('http://localhost:3000/api/feedbacks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data)
      }
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const token = getAuthToken()
    if (!token || !userType) return

    let feedbackData
    
    if (userType === 'aluno') {
      feedbackData = {
        feedback: {
          conteudo: newFeedback.conteudo,
          destinatario_id: parseInt(newFeedback.destinatario_id),
          destinatario_type: 'Professor',
          tarefa_id: parseInt(newFeedback.tarefa_id),
          tipo: 'sobre_tarefa'
        }
      }
    } else {
      feedbackData = {
        feedback: {
          conteudo: newFeedback.conteudo,
          destinatario_id: parseInt(newFeedback.destinatario_id),
          destinatario_type: 'Aluno',
          tipo: 'sobre_desempenho'
        }
      }
    }

    try {
      const response = await fetch('http://localhost:3000/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setNewFeedback({ destinatario_id: "", conteudo: "", tarefa_id: "" })
        fetchFeedbacks()
      }
    } catch (error) {
      console.error('Erro ao criar feedback:', error)
    }
  }

  const filteredDestinatarios = destinatarios.filter(dest => 
    dest.nome.toLowerCase().includes(destinatarioSearchTerm.toLowerCase())
  )

  const filteredTarefas = tarefas.filter(tarefa => 
    tarefa.titulo.toLowerCase().includes(tarefaSearchTerm.toLowerCase())
  )

  const handleDestinatarioSelect = (destinatario: Aluno | Professor) => {
    setNewFeedback({ ...newFeedback, destinatario_id: destinatario.id.toString() })
    setDestinatarioSearchTerm(destinatario.nome)
    setShowDestinatarioOptions(false)
  }

  const handleTarefaSelect = (tarefa: Tarefa) => {
    setNewFeedback({ ...newFeedback, tarefa_id: tarefa.id.toString() })
    setTarefaSearchTerm(tarefa.titulo)
    setShowTarefaOptions(false)
  }

  const renderDestinatarioOption = (destinatario: Aluno | Professor) => {
    if (userType === 'aluno') {
      const professor = destinatario as Professor
      return `${professor.nome} - ${professor.materia}`
    }
    return destinatario.nome
  }

  return (
    <div className="feedback-component">
      <div className="feedback-header">
        <h2 className="feedback-title">Dashboard</h2>
        <button className="new-feedback-btn" onClick={() => setIsDialogOpen(true)}>
          Novo Feedback
        </button>
      </div>

      <div className="feedback-content">
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-card-header">
                <h3 className="feedback-card-title">
                  {feedback.autor.nome}
                </h3>
              </div>
              <div className="feedback-card-content">
                <p>{feedback.conteudo}</p>
              </div>
              <div className="feedback-card-footer">
                <p>{new Date(feedback.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Novo Feedback</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Selecionar {userType === 'aluno' ? 'Professor' : 'Aluno'}
                </label>
                <div className="select-container" ref={destinatarioRef}>
                  <input
                    type="text"
                    className="select-input"
                    placeholder={`Pesquisar ${userType === 'aluno' ? 'professor' : 'aluno'}...`}
                    value={destinatarioSearchTerm}
                    onChange={(e) => {
                      setDestinatarioSearchTerm(e.target.value)
                      setShowDestinatarioOptions(true)
                    }}
                    onFocus={() => setShowDestinatarioOptions(true)}
                  />
                  {showDestinatarioOptions && (
                    <div className="select-options">
                      {filteredDestinatarios.length > 0 ? (
                        filteredDestinatarios.map(dest => (
                          <div
                            key={dest.id}
                            className="select-option"
                            onClick={() => handleDestinatarioSelect(dest)}
                          >
                            {renderDestinatarioOption(dest)}
                          </div>
                        ))
                      ) : (
                        <div className="select-option-empty">
                          Nenhum resultado encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {userType === 'aluno' && (
                <div className="form-group">
                  <label>Selecionar Tarefa</label>
                  <div className="select-container" ref={tarefaRef}>
                    <input
                      type="text"
                      className="select-input"
                      placeholder="Pesquisar tarefa..."
                      value={tarefaSearchTerm}
                      onChange={(e) => {
                        setTarefaSearchTerm(e.target.value)
                        setShowTarefaOptions(true)
                      }}
                      onFocus={() => setShowTarefaOptions(true)}
                    />
                    {showTarefaOptions && (
                      <div className="select-options">
                        {filteredTarefas.length > 0 ? (
                          filteredTarefas.map(tarefa => (
                            <div
                              key={tarefa.id}
                              className="select-option"
                              onClick={() => handleTarefaSelect(tarefa)}
                            >
                              {tarefa.titulo}
                            </div>
                          ))
                        ) : (
                          <div className="select-option-empty">
                            Nenhuma tarefa encontrada
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="content">Feedback</label>
                <textarea
                  id="content"
                  placeholder="Escreva seu feedback aqui..."
                  value={newFeedback.conteudo}
                  onChange={(e) => setNewFeedback({ ...newFeedback, conteudo: e.target.value })}
                  required
                />
              </div>

              <div className="dialog-footer">
                <button type="submit" className="submit-btn">
                  Enviar Feedback
                </button>
                <button type="button" className="cancel-btn" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackComponent