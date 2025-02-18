import { useState, useEffect } from "react";
import { SchoolForm } from "../../components/SchoolForm/SchoolForm";
import { Book } from "lucide-react";
import "./SchoolPage.css";

export default function SchoolPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderForm = () => {
    return <SchoolForm />;
  };

  const renderHeader = () => {
    return (
      <>
        <h2>Registre sua Escola</h2>
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
