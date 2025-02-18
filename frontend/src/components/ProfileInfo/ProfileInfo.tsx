import React, { useState } from "react";
import "./ProfileInfo.css";
import { Mail, Calendar, School, Users, CreditCard, Edit, Check } from "lucide-react";
import { toast } from 'react-hot-toast';

interface ProfileInfoProps {
  nome: string;
  turma?: string;
  email: string;
  cpf?: string;
  dataNascimento?: string;
  escola: string;
  materia?: string;
  turmas?: string[] | string;
  dias_aula?: string[];
}

const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  nome: initialNome,
  turma,
  email: initialEmail,
  cpf,
  dataNascimento: initialDataNascimento,
  escola,
  materia,
  turmas = [],
  dias_aula,
}) => {
  const authDataString = localStorage.getItem('auth');
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const userType = authData?.user?.tipo;
  const userId = authData?.user?.id;
  const turmasArray = typeof turmas === 'string' ? JSON.parse(turmas) : turmas;

  const [nome, setNome] = useState(userType === 'admin' ? 'Admin' : initialNome);
  const [email, setEmail] = useState(initialEmail);
  const [dataNascimento, setDataNascimento] = useState(initialDataNascimento || "");
  const [editingNome, setEditingNome] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingDataNascimento, setEditingDataNascimento] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (field: "nome" | "email" | "dataNascimento") => {
    try {
      setIsUpdating(true);

      if (!authData || !userId) {
        throw new Error('Usuário não autenticado');
      }

      const token = authData.token;

      let updateData: Record<string, string> = {};
      switch (field) {
        case "nome":
          updateData = { nome };
          authData.user.nome = nome;
          break;
        case "email":
          updateData = { email };
          authData.user.email = email;
          break;
        case "dataNascimento":
          updateData = { data_nascimento: dataNascimento };
          authData.user.data_nascimento = dataNascimento;
          break;
      }

      let endpoint = '';
      switch (userType) {
        case 'aluno':
          endpoint = `http://localhost:3000/api/alunos/${userId}`;
          break;
        case 'professor':
          endpoint = `http://localhost:3000/api/professores/${userId}`;
          break;
        case 'admin':
          endpoint = `http://localhost:3000/api/admins/${userId}`;
          break;
        default:
          throw new Error('Tipo de usuário inválido');
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [userType]: updateData }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      localStorage.setItem('auth', JSON.stringify(authData));
      toast.success('Perfil atualizado com sucesso!');

      switch (field) {
        case "nome":
          setEditingNome(false);
          break;
        case "email":
          setEditingEmail(false);
          break;
        case "dataNascimento":
          setEditingDataNascimento(false);
          break;
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');

      switch (field) {
        case "nome":
          setNome(initialNome);
          break;
        case "email":
          setEmail(initialEmail);
          break;
        case "dataNascimento":
          setDataNascimento(initialDataNascimento || "");
          break;
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirm = (field: "nome" | "email" | "dataNascimento") => {
    updateProfile(field);
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-header-decoration top-right"></div>
        <div className="profile-header-decoration bottom-left"></div>
        <h1 className="profile-name">
          {editingNome ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="edit-input"
              disabled={isUpdating}
            />
          ) : (
            nome
          )}
          {userType !== 'admin' && (
            editingNome ? (
              <Check
                className={`edit-icon-name ${isUpdating ? 'opacity-50' : ''}`}
                onClick={() => !isUpdating && handleConfirm("nome")}
              />
            ) : (
              <Edit
                className={`edit-icon-name ${isUpdating ? 'opacity-50' : ''}`}
                onClick={() => !isUpdating && setEditingNome(true)}
              />
            )
          )}
        </h1>
        <p className="profile-subtitle">
          {userType === 'aluno' ? 'Estudante' : userType === 'professor' ? 'Professor' : 'Administrador'}
        </p>
      </div>
      <div className="profile-content">
        <div className="profile-grid">
          <InfoItem
            icon={<Mail />}
            label="Email"
            value={email}
            isEditing={editingEmail}
            onEdit={userType !== 'admin' ? () => !isUpdating && setEditingEmail(true) : undefined}
            onChange={(e) => setEmail(e.target.value)}
            onConfirm={() => handleConfirm("email")}
            type="email"
            disabled={isUpdating}
          />
          {cpf && (
            <InfoItem
              icon={<CreditCard />}
              label="CPF"
              value={formatCPF(cpf)}
            />
          )}
          {dataNascimento && (
            <InfoItem
              icon={<Calendar />}
              label="Data de Nascimento"
              value={dataNascimento}
              isEditing={editingDataNascimento}
              onEdit={userType !== 'admin' ? () => !isUpdating && setEditingDataNascimento(true) : undefined}
              onChange={(e) => setDataNascimento(e.target.value)}
              onConfirm={() => handleConfirm("dataNascimento")}
              type="date"
              disabled={isUpdating}
            />
          )}
          <InfoItem icon={<School />} label="Escola" value={escola} />
          {turma && <InfoItem icon={<Users />} label="Turma" value={turma} />}
          {materia && <InfoItem icon={<School />} label="Matéria" value={materia} />}
          {userType === 'professor' && turmasArray.length > 0 && (
            <InfoItem icon={<Users />} label="Turmas" value={turmasArray.join(', ')} />
          )}
          {dias_aula && (
            <InfoItem icon={<Calendar />} label="Dias de Aula" value={dias_aula.join(', ')} />
          )}
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing?: boolean;
  onEdit?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm?: () => void;
  type?: string;
  disabled?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  isEditing,
  onEdit,
  onChange,
  onConfirm,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="info-item">
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <span className="info-label">{label}</span>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="edit-input"
            disabled={disabled}
          />
        ) : (
          <span className="info-value">{value}</span>
        )}
      </div>
      {onEdit && (
        isEditing ? (
          <Check
            className={`edit-icon ${disabled ? 'opacity-50' : ''}`}
            onClick={() => !disabled && onConfirm?.()}
          />
        ) : (
          <Edit
            className={`edit-icon ${disabled ? 'opacity-50' : ''}`}
            onClick={() => !disabled && onEdit()}
          />
        )
      )}
    </div>
  );
};

export default ProfileInfo;