
import React from 'react';

interface HtmlPreviewProps {
  exportUrl: string | null;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ exportUrl }) => {
  if (!exportUrl) return null;
  
  return (
    <div className="p-4 bg-dark-800 rounded border border-gold-500 overflow-auto">
      <pre className="text-xs text-gray-300">
        &lt;!DOCTYPE html&gt;<br/>
        &lt;html&gt;<br/>
        &nbsp;&nbsp;&lt;head&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Loja - Exportação HTML&lt;/title&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
        &nbsp;&nbsp;&lt;/head&gt;<br/>
        &nbsp;&nbsp;&lt;body&gt;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
        &nbsp;&nbsp;&lt;/body&gt;<br/>
        &lt;/html&gt;
      </pre>
    </div>
  );
};

export default HtmlPreview;
