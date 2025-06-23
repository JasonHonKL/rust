import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, AlertCircle, Copy, Check, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { API_CONFIG } from "@/config/api";

interface ReportGeneratorProps {
  apiConfig: {
    provider: string;
    apiKey: string;
    model: string;
    agents: string[];
  };
}

export const ReportGenerator = ({ apiConfig }: ReportGeneratorProps) => {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query to generate a report.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");
    setReport("");

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.REPORT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: query.trim(),
          messages: "[]",
          api: "report"
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setReport(data.report || 'No report generated');
      toast({
        title: "Report Generated",
        description: "Intelligence report has been generated successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate report";
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Report copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy report to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spy-search-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Report downloaded as markdown file.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Query Input */}
      <div className="space-y-3">
        <Label htmlFor="query" className="text-foreground font-medium text-lg">
          Intelligence Query
        </Label>
        <Textarea
          id="query"
          placeholder="Enter your intelligence gathering prompt... (e.g., 'Generate a comprehensive analysis on cybersecurity trends in 2024')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[140px] resize-none apple-input text-lg"
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateReport}
        disabled={isLoading || !query.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Generating Intelligence Report...
          </>
        ) : (
          <>
            <Search className="mr-3 h-5 w-5" />
            Generate Report
          </>
        )}
      </Button>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-medium text-foreground">
              Generating Intelligence Report...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 rounded-xl p-6 border border-border/30 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Display */}
      {report && !isLoading && (
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-medium text-foreground">
              Intelligence Report
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="apple-button rounded-lg"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsMarkdown}
                className="apple-button rounded-lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Download MD
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 rounded-xl p-6 border border-border/30 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-mono">
                {report}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Info */}
      {apiConfig.provider && (
        <div className="text-sm text-muted-foreground text-center font-light">
          Using {apiConfig.provider} ({apiConfig.model}) • Agents: {apiConfig.agents.join(', ')} • Backend: localhost:8000
        </div>
      )}
    </div>
  );
};
