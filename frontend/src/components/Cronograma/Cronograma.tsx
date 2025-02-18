import { Dialog, DialogContent, DialogTitle, DialogOverlay } from "@radix-ui/react-dialog";
import { 
  Pi, 
  FlaskRoundIcon as Flask, 
  Book, 
  Globe, 
  Palette, 
  Dumbbell, 
  TestTubes, 
  Languages, 
  Music, 
  Binary, 
  Brain, 
  Microscope, 
  Dna, 
  Calculator, 
  AtomIcon as Atom, 
  Ruler, 
  Pencil, 
  BookOpenText, 
  BookText,
  LucideIcon 
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Cronograma.css";

interface CronogramaData {
  materia: string;
  professor: string;
  dias_aula: string[];
}

const materiaIcons: Record<string, LucideIcon> = {
  "Matemática": Pi,
  "Física": Flask,
  "Literatura": Book,
  "História": Globe,
  "Educação Física": Dumbbell,
  "Artes": Palette,
  "Química": TestTubes,
  "Inglês": Languages,
  "Música": Music,
  "Programação": Binary,
  "Filosofia": Brain,
  "Biologia": Microscope,
  "Genética": Dna,
  "Geometria": Calculator,
  "Ciências": Atom,
  "Geografia": Ruler,
  "Redação": Pencil,
  "Português": BookOpenText,
  "Sociologia": BookText
};

const getIcon = (materia: string): LucideIcon => {
  return materiaIcons[materia] || Book;
};

interface CronogramaProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MateriaInfo {
  name: string;
  icon: LucideIcon;
}

interface AuthData {
  user: {
    id: string;
  };
  token: string;
}

export default function Cronograma({ isOpen, onClose }: CronogramaProps) {
  const [cronogramaData, setCronogramaData] = useState<CronogramaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
  ];

  useEffect(() => {
    const fetchCronograma = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('auth') || '{}') as AuthData;
        const userId = authData.user?.id;
        const token = authData.token;
        
        if (!userId || !token) {
          throw new Error('Dados de autenticação não encontrados');
        }

        const response = await fetch(`http://localhost:3000/api/alunos/${userId}/cronograma`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Não autorizado. Por favor, faça login novamente.');
          }
          throw new Error('Erro ao carregar o cronograma');
        }

        const data = await response.json();
        setCronogramaData(data.cronograma);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCronograma();
    }
  }, [isOpen]);

  const getMateriasPorDia = (dia: string): MateriaInfo[] => {
    return cronogramaData.filter(item => 
      item.dias_aula.includes(dia)
    ).map(item => ({
      name: `${item.materia} - ${item.professor}`,
      icon: getIcon(item.materia)
    }));
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="dialog-overlay-cron" />
        <DialogContent className="dialog-content-cron">
          <DialogTitle className="dialog-title-cron">Erro</DialogTitle>
          <div className="error-message">{error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="dialog-overlay-cron" />
      <DialogContent className="dialog-content-cron">
        <DialogTitle className="dialog-title-cron">Cronograma Semanal</DialogTitle>
        <div className="schedule-container-cron">
          {isLoading ? (
            <div className="loading">Carregando...</div>
          ) : (
            diasSemana.map((dia, dayIndex) => {
              const materias = getMateriasPorDia(dia);
              return (
                <div
                  key={dia}
                  className="day-card-cron"
                  style={{
                    animationDelay: `${dayIndex * 0.1}s`
                  }}
                >
                  <div className="day-header-cron">
                    <h3 className="day-title-cron">{dia}</h3>
                    <span className="day-abbreviation-cron">
                      {dia.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <ul className="subjects-list-cron">
                    {materias.map((materia, materiaIndex) => (
                      <li
                        key={`${dia}-${materiaIndex}`}
                        className="subject-item-cron"
                        style={{
                          animationDelay: `${dayIndex * 0.1 + materiaIndex * 0.05}s`
                        }}
                      >
                        <materia.icon className="subject-icon-cron" />
                        <span className="subject-name-cron">{materia.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}