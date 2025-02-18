import { useState } from "react";
import axios, { AxiosError } from "axios";
import "./LoginForm.css";

type UserType = 'aluno' | 'professor' | 'admin';

interface RegisterFormProps {
    onBack: () => void;
}

interface ApiValidationErrors {
    errors?: Record<string, string[]>;
    error?: string;
}

export function RegisterForm({ onBack }: RegisterFormProps) {
    const [userType, setUserType] = useState<UserType>('aluno');
    const [step, setStep] = useState(1);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [codigo, setCodigo] = useState("");
    const [turma, setTurma] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [materia, setMateria] = useState("");
    const [diaAula, setDiaAula] = useState("");

    const turmas = [
        "1º Ano - Manhã", "1º Ano - Tarde",
        "2º Ano - Manhã", "2º Ano - Tarde",
        "3º Ano - Manhã", "3º Ano - Tarde",
        "4º Ano - Manhã", "4º Ano - Tarde",
        "5º Ano - Manhã", "5º Ano - Tarde",
        "6º Ano - Manhã", "6º Ano - Tarde",
        "7º Ano - Manhã", "7º Ano - Tarde",
        "8º Ano - Manhã", "8º Ano - Tarde",
        "9º Ano - Manhã", "9º Ano - Tarde"
    ];

    const materias = [
        "Matemática",
        "Português",
        "História",
        "Geografia",
        "Ciências",
        "Literatura",
        "Inglês",
        "Artes"
    ];

    const diasAula = [
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira"
    ];

    const validatePassword = (password: string) => {
        if (!/[A-Z]/.test(password)) {
            setError("A senha deve conter pelo menos uma letra maiúscula");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setError("A senha deve conter pelo menos um número");
            return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError("A senha deve conter pelo menos um caractere especial");
            return false;
        }
        return true;
    };

    const validateBirthDate = (date: string, type: 'aluno' | 'professor') => {
        const birthDate = new Date(date);
        const today = new Date();
        
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const realAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
            ? age - 1 
            : age;
        
        if (birthDate > today) {
            setError("A data de nascimento não pode ser futura");
            return false;
        }
        
        if (type === 'aluno') {
            if (realAge < 4) {
                setError("O aluno deve ter pelo menos 4 anos");
                return false;
            }
            
            if (realAge > 22) {
                setError("Data de nascimento inválida para aluno");
                return false;
            }
        } else if (type === 'professor') {
            if (realAge < 18) {
                setError("O professor deve ter pelo menos 18 anos");
                return false;
            }
            
            if (realAge > 70) {
                setError("Data de nascimento inválida para professor");
                return false;
            }
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step !== getMaxSteps()) {
            setStep(step + 1);
            return;
        }
    
        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem");
            return;
        }

        if (!validatePassword(senha)) {
            return;
        }

        if (userType !== 'admin') {
            if (!validateBirthDate(dataNascimento, userType)) {
                return;
            }
        }
    
        try {
            let requestData;
            const cpfSemFormatacao = cpf.replace(/\D/g, '');
            
            if (userType === 'aluno') {
                requestData = {
                    aluno: {
                        nome,
                        data_nascimento: dataNascimento,
                        cpf: cpfSemFormatacao,
                        email,
                        turma,
                        password: senha,
                        codigo_escola: codigo
                    },
                };
            } else if (userType === 'professor') {
                requestData = {
                    professor: {
                        nome,
                        data_nascimento: dataNascimento,
                        cpf: cpfSemFormatacao,
                        email,
                        password: senha,
                        codigo_escola: codigo,
                        materia,
                        turmas: `["${turma}"]`,
                        dias_aula: [diaAula]
                    },
                };
            } else {
                requestData = {
                    admin: {
                        email,
                        password: senha,
                        codigo_escola: codigo
                    }
                };
            }

            if(userType === 'professor'){
                const response = await axios.post(`http://localhost:3000/api/${userType}es`, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(response){
                    onBack();
                }
            } else {
                const response = await axios.post(`http://localhost:3000/api/${userType}s`, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response) {
                    onBack();
                }
            }

        } catch (err) {
            const axiosError = err as AxiosError<ApiValidationErrors>;
            if (axiosError.response?.data?.errors) {
                const errorMessages = Object.values(axiosError.response.data.errors).flat();
                setError(errorMessages.join(', '));
            } else if (axiosError.response?.data?.error) {
                setError(axiosError.response.data.error);
            } else {
                setError("Erro ao fazer registro");
            }
        
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    };

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const getMaxSteps = () => {
        if (userType === 'admin') return 2;
        return 3;
    };

    const handleBack = () => {
        if (step === 1) {
            onBack();
        } else {
            setStep(step - 1);
        }
    };

    const renderStepIndicator = () => {
        const maxSteps = getMaxSteps();
        return (
            <div className="step-indicator">
                {Array.from({ length: maxSteps }, (_, index) => (
                    <div
                        key={index}
                        className={`step-dot ${index + 1 === step ? 'active' : ''} 
                                  ${index + 1 < step ? 'completed' : ''}`}
                    />
                ))}
            </div>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
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
                );

            case 2:
                if (userType === 'admin') {
                    return (
                        <>
                            <div className="login-form">
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="login-form">
                                <input
                                    type="text"
                                    value={codigo}
                                    placeholder="Código"
                                    onChange={(e) => setCodigo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="login-form">
                                <input
                                    type="password"
                                    value={senha}
                                    placeholder="Senha"
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="login-form">
                                <input
                                    type="password"
                                    value={confirmarSenha}
                                    placeholder="Confirmar Senha"
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    );
                }
                return (
                    <>
                        <div className="login-form">
                            <input
                                type="text"
                                value={nome}
                                placeholder="Nome completo"
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form">
                            <input
                                type="text"
                                value={cpf}
                                placeholder="CPF"
                                onChange={(e) => setCpf(formatCPF(e.target.value))}
                                maxLength={14}
                                required
                            />
                        </div>
                        <div className="login-form">
                            <input
                                type="date"
                                value={dataNascimento}
                                placeholder="Data de Nascimento"
                                onChange={(e) => setDataNascimento(e.target.value)}
                                required
                            />
                        </div>
                        {userType === 'aluno' && (
                            <div className="login-form">
                                <select
                                    value={turma}
                                    onChange={(e) => setTurma(e.target.value)}
                                    required
                                    className="turma-select"
                                >
                                    <option value="" disabled>Selecione a turma</option>
                                    {turmas.map((turmaOption, index) => (
                                        <option key={index} value={turmaOption}>
                                            {turmaOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {userType === 'professor' && (
                            <>
                                <div className="login-form">
                                    <select
                                        value={materia}
                                        onChange={(e) => setMateria(e.target.value)}
                                        required
                                        className="turma-select"
                                    >
                                        <option value="" disabled>Selecione a matéria</option>
                                        {materias.map((materiaOption, index) => (
                                            <option key={index} value={materiaOption}>
                                                {materiaOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="login-form">
                                    <select
                                        value={turma}
                                        onChange={(e) => setTurma(e.target.value)}
                                        required
                                        className="turma-select"
                                    >
                                        <option value="" disabled>Selecione a turma</option>
                                        {turmas.map((turmaOption, index) => (
                                            <option key={index} value={turmaOption}>
                                                {turmaOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="login-form">
                                    <select
                                        value={diaAula}
                                        onChange={(e) => setDiaAula(e.target.value)}
                                        required
                                        className="turma-select"
                                    >
                                        <option value="" disabled>Selecione o dia de aula</option>
                                        {diasAula.map((diaAulaOption, index) => (
                                            <option key={index} value={diaAulaOption}>
                                                {diaAulaOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </>
                );

            case 3:
                return (
                    <>
                        <div className="login-form">
                            <input
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form">
                            <input
                                type="text"
                                value={codigo}
                                placeholder="Código"
                                onChange={(e) => setCodigo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form">
                            <input
                                type="password"
                                value={senha}
                                placeholder="Senha"
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form">
                            <input
                                type="password"
                                value={confirmarSenha}
                                placeholder="Confirmar Senha"
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                            />
                        </div>
                    </>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {renderStepIndicator()}
            {renderStepContent()}
            
            {error && <div className="error-message">{error}</div>}

            <div className="form-buttons">
                <button type="button" onClick={handleBack} className="back-button">
                    Voltar
                </button>
                <button type="submit" className="submit-button">
                    {step === getMaxSteps() ? 'Cadastrar' : 'Próximo'}
                </button>
            </div>
        </form>
    );
}