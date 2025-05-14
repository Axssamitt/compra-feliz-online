
import React from 'react';

interface DownloadButtonProps {
  exportUrl: string | null;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ exportUrl }) => {
  const downloadHtml = () => {
    if (!exportUrl) return;
    
    const a = document.createElement('a');
    a.href = exportUrl;
    a.download = 'loja.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!exportUrl) return null;

  return (
    <button 
      onClick={downloadHtml}
      className="px-4 py-2 border border-gold-500 text-gold-500 rounded-lg hover:bg-dark-600"
    >
      Baixar HTML
    </button>
  );
};

export default DownloadButton;
