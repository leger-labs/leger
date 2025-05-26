import { FormRenderer } from '@/app/form/FormRenderer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

export default function App() {
  const { toast } = useToast();
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadInitialConfiguration();
  }, []);
  
  async function loadInitialConfiguration() {
    try {
      setInitialValues({
        ENABLE_SIGNUP: true,
        PORT: 8080,
        WEBUI_NAME: 'My OpenWebUI',
        DEFAULT_MODELS: ['gpt-3.5-turbo', 'gpt-4'],
      });
    } catch (error) {
      console.error('Failed to load initial configuration:', error);
      toast({
        title: "Failed to load configuration",
        description: "Using default values",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleSave = async (category: string, data: any) => {
    try {
      console.log(`Saving category: ${category}`, data);
      
      const response = await fetch(`/api/configuration/${category}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  };
  
  const handleError = (error: Error) => {
    console.error('Form error:', error);
    toast({
      title: "An error occurred",
      description: error.message,
      variant: "destructive",
    });
  };
  
  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="leger-ui-theme">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🌍</div>
            <p className="text-muted-foreground">Loading configuration...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="leger-ui-theme">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span className="hidden font-bold sm:inline-block">
                Leger
              </span>
              <span className="text-muted-foreground hidden md:inline-block">
                | OpenWebUI Configuration Management
              </span>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <nav className="flex items-center space-x-2">
                <a 
                  href="https://docs.openwebui.com/getting-started/env-configuration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  OpenWebUI Docs
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main>
          <FormRenderer
            initialValues={initialValues}
            onSave={handleSave}
            onError={handleError}
          />
        </main>
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
