
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyInfo {
  id: number;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
}

const CompanyInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    id: 1,
    name: '',
    address: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    facebook: ''
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .order('id')
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setCompanyInfo(data);
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações da empresa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_info')
        .update({
          name: companyInfo.name,
          address: companyInfo.address,
          email: companyInfo.email,
          phone: companyInfo.phone,
          whatsapp: companyInfo.whatsapp,
          instagram: companyInfo.instagram,
          facebook: companyInfo.facebook
        })
        .eq('id', companyInfo.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Dados salvos",
        description: "As informações da empresa foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Error updating company info:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar as informações da empresa.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold gold-text">Informações da Empresa</h2>
      </div>
      
      <Card className="bg-dark-700 border border-gold-500">
        <CardHeader>
          <CardTitle className="text-gold-500">Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  name="name"
                  value={companyInfo.name}
                  onChange={handleChange}
                  className="bg-dark-800 border-gold-500 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={companyInfo.address || ''}
                  onChange={handleChange}
                  className="bg-dark-800 border-gold-500 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={companyInfo.email || ''}
                    onChange={handleChange}
                    className="bg-dark-800 border-gold-500 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={companyInfo.phone || ''}
                    onChange={handleChange}
                    className="bg-dark-800 border-gold-500 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={companyInfo.whatsapp || ''}
                  onChange={handleChange}
                  className="bg-dark-800 border-gold-500 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={companyInfo.instagram || ''}
                    onChange={handleChange}
                    className="bg-dark-800 border-gold-500 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={companyInfo.facebook || ''}
                    onChange={handleChange}
                    className="bg-dark-800 border-gold-500 text-white"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="bg-gold-500 hover:bg-gold-600 text-dark-900 w-full"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyInfoPage;
