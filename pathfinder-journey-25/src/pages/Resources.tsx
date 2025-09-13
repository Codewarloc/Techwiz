import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, Loader2, FileText, ListChecks, Image } from "lucide-react";
import api from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface Resource {
  resource_id: number;
  title: string;
  description: string;
  category: "PDF" | "Checklist" | "Infographic";
  file_url: string;
  tags: string[];
  target_audience: string;
  download_count: number;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const handleDownload = async () => {
    try {
      // Increment download count on the backend
      await api.post(`/resources/${resource.resource_id}/increment_download_count/`);
      // Open the file URL in a new tab to trigger download/viewing
      window.open(resource.file_url, "_blank");
      toast({ title: "Success", description: `Downloading "${resource.title}"` });
    } catch (error) {
      console.error("Failed to track download:", error);
      // Still open the file even if tracking fails
      window.open(resource.file_url, "_blank");
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <Badge variant="outline">For: {resource.target_audience}</Badge>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Preview</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80vw] h-[90vh]">
              <DialogHeader>
                <DialogTitle>{resource.title}</DialogTitle>
              </DialogHeader>
              <div className="w-full h-full">
                <iframe src={resource.file_url} width="100%" height="100%" title={resource.title} />
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get<Resource[]>("/resources/");
        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        toast({ title: "Error", description: "Could not load resources.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const groupedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      const category = resource.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [resources]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Resources...</p>
      </div>
    );
  }

  const categoryIcons = {
    PDF: <FileText className="w-6 h-6 mr-3 text-primary" />,
    Checklist: <ListChecks className="w-6 h-6 mr-3 text-primary" />,
    Infographic: <Image className="w-6 h-6 mr-3 text-primary" />,
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Resource Library</h1>
        <p className="mt-4 text-lg text-muted-foreground">Downloadable guides, checklists, and tools to help your career journey.</p>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedResources).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold flex items-center mb-6">
              {categoryIcons[category as keyof typeof categoryIcons]}
              {category}s
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((resource) => (
                <ResourceCard key={resource.resource_id} resource={resource} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default Resources;