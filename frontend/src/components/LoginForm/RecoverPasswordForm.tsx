import { useState } from "react";
import axios, { AxiosError } from "axios";
import InputMask from "react-input-mask";
import "./LoginForm.css";

export function RecoverPasswordForm({ onBack }: { onBack: () => void }) {
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [error, setError] = useState<string | null>(null);

    const validarSenha = (senha: string) => {
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return senhaRegex.test(senha);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validarSenha(novaSenha)) {
            setError(
                "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
            );
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        const [dia, mes, ano] = dataNascimento.split("/");
        const dataNascimentoISO = `${ano}-${mes}-${dia}`;

        try {
            await axios.post("http://api.localhost/api/usuarios/recuperar", {
                cpf,
                dataNascimento: dataNascimentoISO,
                novaSenha,
            });

            alert("Senha alterada com sucesso!");
            onBack();

        } catch (err) {
            const axiosError = err as AxiosError<{ erro: string }>;
            setError(axiosError.response?.data.erro || "Erro ao recuperar senha");
            console.error("Erro ao recuperar senha:", axiosError);

            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            
            <div>
                <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                />
            </div>

            <div>
                <InputMask
                    id="dataNascimento"
                    mask="99/99/9999"
                    className="react-input-mask"
                    placeholder="Data de Nascimento"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    required
                />
            </div>

            <div>
                <input
                    id="novaSenha"
                    name="novaSenha"
                    type="password"
                    placeholder="Nova Senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                />
            </div>

            <div>
                <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Confirmar Nova Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Recuperar Senha</button>
        </form>
    );
}