import { useState, useEffect } from "react";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { RegisterForm } from "../../components/LoginForm/RegisterForm";
import { RecoverPasswordForm } from "../../components/LoginForm/RecoverPasswordForm";
import { Book } from "lucide-react";
import "./LoginPage.css";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderForm = () => {
    if (isRegistering) {
      return <RegisterForm onBack={() => setIsRegistering(false)} />;
    }
    if (isRecovering) {
      return <RecoverPasswordForm onBack={() => setIsRecovering(false)} />;
    }
    return <LoginForm onForgotPassword={() => setIsRecovering(true)} />;
  };

  const renderHeader = () => {
    if (isRegistering) {
      return (
        <>
          <h2>Crie sua conta</h2>
          <p>
            Já tem uma conta?{" "}
            <a href="#" onClick={() => setIsRegistering(false)}>
              Faça login
            </a>
          </p>
        </>
      );
    }
    return (
      <>
        <h2>Entre na sua conta</h2>
        <p>
          Ou{" "}
          <a href="#" onClick={() => setIsRegistering(true)}>
            crie uma nova conta
          </a>
        </p>
      </>
    );
  };

  return (
    <div className="login-page">
      {isMobile && (
        <div className="background-image">
          <div className="icon-container">
            <Book size={100} color="#844794" />
          </div>
        </div>
          

      )}
  
      <div className="left-column">
        <div className="form-container">
          {renderHeader()}
          {renderForm()}
        </div>
      </div>
  
      {!isMobile && (
        <div className="background-image">
          <div className="icon-container">
            <Book size={100} color="#ffffff" />
          </div>
          <div className="text-container">
            <h1 className="brand-name">ClassHub</h1>
            <div className="typing-container">
              <div className="typing-text">
                <div className="typing-animation">
                  Sua plataforma para uma educação mais simples, conectada e eficiente.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
