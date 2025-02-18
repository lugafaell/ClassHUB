import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from '@emailjs/browser';
import "./SchoolForm.css";

interface EscolaResponse {
    id: string;
    nomeEscola: string;
    codeAluno: string;
    codeProfessor: string;
    codeAdmin: string;
}

export function SchoolForm() {
    const [escolaSelecionada, setEscolaSelecionada] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const escolas = [
        { id: "1", nome: "Colégio 7 de Setembro" },
        { id: "2", nome: "Colégio Ari de Sá Cavalcante" },
        { id: "3", nome: "Colégio Christus" },
        { id: "4", nome: "Colégio Farias Brito" },
        { id: "5", nome: "Colégio Santo Inácio" },
        { id: "6", nome: "Escola Municipal Ademar Nunes Batista" },
        { id: "7", nome: "Escola Municipal Professor José Rebouças Macambira" },
        { id: "8", nome: "EEMTI Jenny Gomes" },
        { id: "9", nome: "EEEP Paulo VI" },
        { id: "10", nome: "Colégio Militar do Corpo de Bombeiros" }
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post<EscolaResponse>(
                "http://localhost:3000/api/escolas", 
                {
                    escola: {
                        nomeEscola: escolaSelecionada,
                    },
                }
            );

            const { nomeEscola: nomeEscolaResponse, codeAluno, codeProfessor, codeAdmin } = response.data;

            const templateParams = {
                to_email: email,
                nomeEscola: nomeEscolaResponse, 
                codeAluno: codeAluno,           
                codeProfessor: codeProfessor,   
                codeAdmin: codeAdmin,           
            };

            await emailjs.send(
                'service_mtkayy7',
                'template_d1qhsgf',
                templateParams,
                '1ufQ0MJe18PJuLc24'
            );

            alert("Escola registrada com sucesso e e-mail enviado!");
        } catch (error) {
            console.error("Erro ao registrar escola:", error);
            
            if (axios.isAxiosError(error) && error.response) {
                console.error("Detalhes do erro:", error.response.data);
                if (typeof error.response.data === 'object') {
                    const errorMessages = Object.entries(error.response.data)
                        .map(([field, errors]) => `${field}: ${errors}`)
                        .join('\n');
                    alert(`Erro(s) de validação:\n${errorMessages}`);
                } else {
                    alert(`Erro: ${error.response.data}`);
                }
            } else {
                alert("Ocorreu um erro ao registrar a escola.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="navigation-buttons">
                <button onClick={() => navigate("/login")}>Fazer Login</button>
            </div>
            <div className="form-group">
                <select
                    className="turma-select"
                    value={escolaSelecionada}
                    onChange={(e) => setEscolaSelecionada(e.target.value)}
                    required
                    disabled={isLoading}
                >
                    <option value="">Selecione a Escola</option>
                    {escolas.map((escola) => (
                        <option key={escola.id} value={escola.nome}>
                            {escola.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar Escola"}
            </button>
        </form>
    );
}

export default SchoolForm;
