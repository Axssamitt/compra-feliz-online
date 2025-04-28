
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-teal-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700">
        <Link to="/">Voltar para Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
