import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from '../../contexts/AuthContext';
import "./LoginForm.css";

type UserType = 'aluno' | 'professor' | 'admin';

interface LoginFormProps {
    onForgotPassword: () => void;
}

interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        tipo: string;
        nome: string;
    };
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
    const navigate = useNavigate();
    const [userType, setUserType] = useState<UserType>('aluno');
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post<LoginResponse>("http://localhost:3000/api/login", {
                email,
                password: senha,
                user_type: userType
            });

            login(response.data.token, response.data.user);
            
            setEmail("");
            setSenha("");

            switch (userType) {
                case 'professor':
                    navigate('/HomeProfessor');
                    break;
                case 'aluno':
                    navigate('/HomeAluno');
                    break;
                case 'admin':
                    navigate('/admin');
                    break;
                default:
                    navigate('/HomeAluno');
            }

        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setError(axiosError.response.data.message || "Erro ao fazer login");
            } else {
                setError("Erro ao fazer login");
            }
            console.error("Erro ao fazer login:", axiosError);

            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="user-type-selector">
                <div
                    onClick={() => setUserType('aluno')}
                    className={`user-type-option ${userType === 'aluno' ? 'active' : ''}`}
                >
                    Aluno
                </div>
                <div
                    onClick={() => setUserType('professor')}
                    className={`user-type-option ${userType === 'professor' ? 'active' : ''}`}
                >
                    Professor
                </div>
                <div
                    onClick={() => setUserType('admin')}
                    className={`user-type-option ${userType === 'admin' ? 'active' : ''}`}
                >
                    Admin
                </div>
            </div>

            <div className="login-form">
                <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="login-form">
                <input
                    type="password"
                    id="senha"
                    value={senha}
                    placeholder="Senha"
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
            </div>

            <div className="form-options">
                <div className="forgot-password" onClick={onForgotPassword}>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button">
                Entrar
            </button>
        </form>
    );
}