import { useState, useEffect } from "react"
import { Users, GraduationCap, Pencil, Trash2 } from "lucide-react"
import "./AdminDashboard.css"

interface Professor {
  id: number
  nome: string
  email: string
  materia: string
  turmas: string[]
  dias_aula: string[]
}

interface Aluno {
  id: number
  nome: string
  email: string
  turma: string
}

interface AuthData {
  user: {
    id: string
  }
  token: string
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"professores" | "alunos">("professores")
  const [professores, setProfessores] = useState<Professor[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [personToDelete, setPersonToDelete] = useState<Professor | Aluno | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dataLoaded, setDataLoaded] = useState({
    professores: false,
    alunos: false
  })

  const turmasDisponiveis = [
    "6º Ano - Manhã",
    "6º Ano - Tarde",
    "7º Ano - Manhã",
    "7º Ano - Tarde",
    "8º Ano - Manhã",
    "8º Ano - Tarde",
    "9º Ano - Manhã",
    "9º Ano - Tarde"
  ];

  const handleTurmasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    if (editingProfessor) {
      setEditingProfessor({
        ...editingProfessor,
        turmas: selectedOptions
      });
    }
  };

  const ensureArrayFormat = (value: string | string[]): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    return value ? value.split(',').map(item => item.trim()) : [];
  };

  const getAuthData = (): { admin_id: string; headers: HeadersInit } => {
    const authData = localStorage.getItem('auth')
    if (!authData) {
      throw new Error('Dados de autenticação não encontrados')
    }

    const { user, token } = JSON.parse(authData) as AuthData

    return {
      admin_id: user.id,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  }

  const fetchData = async (type: "professores" | "alunos") => {
    if (dataLoaded[type]) return

    setIsLoading(true)
    setError(null)
    try {
      const { admin_id, headers } = getAuthData()
      const response = await fetch(
        `http://localhost:3000/api/admins/${admin_id}/${type}`,
        { headers }
      )
      if (!response.ok) throw new Error(`Erro ao carregar ${type}`)
      const data = await response.json()
      if (type === "professores") {
        setProfessores(data)
      } else {
        setAlunos(data)
      }
      setDataLoaded(prev => ({ ...prev, [type]: true }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData("professores")
    fetchData("alunos")
  }, [])

  const handleEdit = (person: Professor | Aluno) => {
    if ("materia" in person) {
      setEditingProfessor({
        ...person,
        turmas: ensureArrayFormat(person.turmas),
        dias_aula: ensureArrayFormat(person.dias_aula)
      });
    } else {
      setEditingAluno(person as Aluno)
    }
    setIsEditDialogOpen(true)
  }

  const handleDelete = (person: Professor | Aluno) => {
    setPersonToDelete(person)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!personToDelete) return

    setIsLoading(true)
    setError(null)

    try {
      const { admin_id, headers } = getAuthData()
      const isProfessor = "materia" in personToDelete
      const endpoint = `http://localhost:3000/api/admins/${admin_id}/${
        isProfessor ? "professores" : "alunos"
      }/${personToDelete.id}`

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers
      })

      if (!response.ok) throw new Error("Erro ao deletar")

      if (isProfessor) {
        setProfessores(professores.filter(p => p.id !== personToDelete.id))
      } else {
        setAlunos(alunos.filter(a => a.id !== personToDelete.id))
      }

      setIsDeleteDialogOpen(false)
      setPersonToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { admin_id, headers } = getAuthData()

      if (editingProfessor) {
        const response = await fetch(
          `http://localhost:3000/api/admins/${admin_id}/professores/${editingProfessor.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({
              professor: {
                nome: editingProfessor.nome,
                materia: editingProfessor.materia,
                email: editingProfessor.email,
                turmas: ensureArrayFormat(editingProfessor.turmas),
                dias_aula: ensureArrayFormat(editingProfessor.dias_aula)
              }
            })
          }
        )

        if (!response.ok) throw new Error("Erro ao atualizar professor")
        
        setProfessores(professores.map(p => 
          p.id === editingProfessor.id ? editingProfessor : p
        ))
      } else if (editingAluno) {
        const response = await fetch(
          `http://localhost:3000/api/admins/${admin_id}/alunos/${editingAluno.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({
              aluno: {
                nome: editingAluno.nome,
                turma: editingAluno.turma,
                email: editingAluno.email
              }
            })
          }
        )

        if (!response.ok) throw new Error("Erro ao atualizar aluno")
        
        setAlunos(alunos.map(a => 
          a.id === editingAluno.id ? editingAluno : a
        ))
      }

      setIsEditDialogOpen(false)
      setEditingProfessor(null)
      setEditingAluno(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = () => {
    const searchLower = searchTerm.toLowerCase()
    if (activeTab === "professores") {
      return professores.filter(professor => 
        professor.nome.toLowerCase().includes(searchLower) ||
        professor.email.toLowerCase().includes(searchLower) ||
        professor.materia.toLowerCase().includes(searchLower)
      )
    } else {
      return alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchLower) ||
        aluno.email.toLowerCase().includes(searchLower) ||
        aluno.turma.toLowerCase().includes(searchLower)
      )
    }
  }

  return (
    <div className="adm-dashboard">
      <div className="adm-dashboard__container">
        <header className="adm-dashboard__header">
          <h1 className="adm-dashboard__title">
            <GraduationCap className="adm-dashboard__icon" />
            Painel do Administrador
          </h1>
          <div className="adm-dashboard__search">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="adm-dashboard__search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {error && <div className="adm-dashboard__error">{error}</div>}

        <div className="adm-dashboard__tabs">
          <button
            className={`adm-dashboard__tab ${activeTab === "professores" ? "adm-dashboard__tab--active" : ""}`}
            onClick={() => setActiveTab("professores")}
          >
            <Users className="adm-dashboard__tab-icon" />
            Professores
          </button>
          <button
            className={`adm-dashboard__tab ${activeTab === "alunos" ? "adm-dashboard__tab--active" : ""}`}
            onClick={() => setActiveTab("alunos")}
          >
            <GraduationCap className="adm-dashboard__tab-icon" />
            Alunos
          </button>
        </div>

        {isLoading ? (
          <div className="adm-dashboard__loading">Carregando...</div>
        ) : (
          <div className="adm-dashboard__table-container">
            <table className="adm-dashboard__table">
              <thead>
                <tr>
                  <th className="adm-dashboard__table-header">Nome</th>
                  <th className="adm-dashboard__table-header">{activeTab === "professores" ? "Matéria" : "Turma"}</th>
                  <th className="adm-dashboard__table-header">Email</th>
                  <th className="adm-dashboard__table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData().map((person, index) => (
                  <tr key={person.id} className={`adm-dashboard__row--${index % 2 === 0 ? "even" : "odd"}`}>
                    <td className="adm-dashboard__table-cell">{person.nome}</td>
                    <td className="adm-dashboard__table-cell">{"materia" in person ? person.materia : person.turma}</td>
                    <td className="adm-dashboard__table-cell">{person.email}</td>
                    <td className="adm-dashboard__table-cell">
                      <button 
                        onClick={() => handleEdit(person)} 
                        className="adm-dashboard__action-btn adm-dashboard__action-btn--edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(person)} 
                        className="adm-dashboard__action-btn adm-dashboard__action-btn--delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isEditDialogOpen && (
        <div className="adm-dashboard__dialog-overlay">
          <div className="adm-dashboard__dialog">
            <h2 className="adm-dashboard__dialog-title">
              Editar {editingProfessor ? "Professor" : "Aluno"}
            </h2>
            <form onSubmit={handleSave}>
              <div className="adm-dashboard__form-group">
                <label className="adm-dashboard__form-label" htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  className="adm-dashboard__form-input"
                  value={editingProfessor?.nome || editingAluno?.nome}
                  onChange={(e) => {
                    if (editingProfessor) {
                      setEditingProfessor({ ...editingProfessor, nome: e.target.value })
                    } else if (editingAluno) {
                      setEditingAluno({ ...editingAluno, nome: e.target.value })
                    }
                  }}
                />
              </div>
              
              {editingProfessor ? (
                <>
                <div className="adm-dashboard__form-group">
                  <label className="adm-dashboard__form-label" htmlFor="materia">Matéria</label>
                  <input
                    id="materia"
                    className="adm-dashboard__form-input"
                    value={editingProfessor.materia}
                    onChange={(e) => setEditingProfessor({ 
                      ...editingProfessor, 
                      materia: e.target.value 
                    })}
                  />
                </div>
                <div className="adm-dashboard__form-group">
                  <label className="adm-dashboard__form-label" htmlFor="turmas">
                    Turmas (pressione Ctrl ou Cmd para selecionar múltiplas)
                  </label>
                  <select
                    id="turmas"
                    multiple
                    className="adm-dashboard__form-select"
                    value={ensureArrayFormat(editingProfessor.turmas)}
                    onChange={handleTurmasChange}
                    size={5}
                  >
                    {turmasDisponiveis.map((turma) => (
                      <option key={turma} value={turma}>
                        {turma}
                      </option>
                    ))}
                  </select>
                </div>
                  <div className="adm-dashboard__form-group">
                    <label className="adm-dashboard__form-label" htmlFor="dias_aula">Dias de Aula (separados por vírgula)</label>
                    <input
                      id="dias_aula"
                      className="adm-dashboard__form-input"
                      value={ensureArrayFormat(editingProfessor.dias_aula).join(", ")}
                      onChange={(e) => setEditingProfessor({
                        ...editingProfessor,
                        dias_aula: ensureArrayFormat(e.target.value)
                      })}
                    />
                  </div>
                </>
              ) : (
                <div className="adm-dashboard__form-group">
                  <label className="adm-dashboard__form-label" htmlFor="turma">Turma</label>
                  <input
                    id="turma"
                    className="adm-dashboard__form-input"
                    value={editingAluno?.turma}
                    onChange={(e) => editingAluno && setEditingAluno({
                      ...editingAluno,
                      turma: e.target.value
                    })}
                  />
                </div>
              )}

              <div className="adm-dashboard__form-group">
                <label className="adm-dashboard__form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="adm-dashboard__form-input"
                  value={editingProfessor?.email || editingAluno?.email}
                  onChange={(e) => {
                    if (editingProfessor) {
                      setEditingProfessor({ ...editingProfessor, email: e.target.value })
                    } else if (editingAluno) {
                      setEditingAluno({ ...editingAluno, email: e.target.value })
                    }
                  }}
                />
              </div>

              <div className="adm-dashboard__dialog-actions">
                <button type="submit" className="adm-dashboard__btn adm-dashboard__btn--save">
                  Salvar alterações
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditDialogOpen(false)} 
                  className="adm-dashboard__btn adm-dashboard__btn--cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div className="adm-dashboard__dialog-overlay">
          <div className="adm-dashboard__dialog">
            <h2 className="adm-dashboard__dialog-title">Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir {personToDelete?.nome}?</p>
            <div className="adm-dashboard__dialog-actions">
              <button 
                onClick={() => setIsDeleteDialogOpen(false)} 
                className="adm-dashboard__btn adm-dashboard__btn--cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="adm-dashboard__btn adm-dashboard__btn--delete"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard