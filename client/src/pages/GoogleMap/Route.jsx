import React, { useState, useEffect } from 'react';
import '../../css/LoaderPage.css';

function LoaderPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-container">
      {isLoading ? (
        <div className="loader"></div> 
      ) : (
        //TODO: Zawartość strony po załadowaniu
        <h1>Strona załadowana!</h1>
      )}
    </div>
  );
}

export default LoaderPage;
