import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  FileText,
  Calendar,
  MessageSquare,
  LogOut,
  Search,
  Plus,
  Eye,
  Edit,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Client {
  id: string;
  user_id: string;
  phone: string | null;
  target_schools: string[] | null;
  application_round: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface Document {
  id: string;
  client_id: string;
  document_type: string;
  title: string;
  content: string | null;
  status: string | null;
  feedback: string | null;
  created_at: string;
  clients?: {
    profiles?: {
      full_name: string | null;
    };
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editingFeedback, setEditingFeedback] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      navigate('/auth');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch clients with profiles
    const { data: clientsData } = await supabase
      .from('clients')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (clientsData) {
      setClients(clientsData as Client[]);
    }

    // Fetch documents with client info
    const { data: docsData } = await supabase
      .from('documents')
      .select(`
        *,
        clients (
          profiles:user_id (
            full_name
          )
        )
      `)
      .order('updated_at', { ascending: false });

    if (docsData) {
      setDocuments(docsData as Document[]);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveFeedback = async () => {
    if (!selectedDocument) return;

    const { error } = await supabase
      .from('documents')
      .update({ feedback: editingFeedback })
      .eq('id', selectedDocument.id);

    if (error) {
      toast.error('Failed to save feedback');
    } else {
      toast.success('Feedback saved successfully');
      fetchData();
      setSelectedDocument(null);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/70 text-sm">Welcome back, Ameya</p>
            </div>
            <Button variant="heroOutline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clients.length}</p>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documents.length}</p>
                  <p className="text-sm text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>View and manage all your clients</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No clients found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                            <span className="font-bold text-gold">
                              {client.profiles?.full_name?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {client.profiles?.full_name || 'Unnamed Client'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.profiles?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status || 'active'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Review</CardTitle>
                <CardDescription>Review and provide feedback on client documents</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.document_type} • {doc.clients?.profiles?.full_name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              doc.status === 'draft'
                                ? 'secondary'
                                : doc.status === 'review'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {doc.status}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setEditingFeedback(doc.feedback || '');
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{doc.title}</DialogTitle>
                                <DialogDescription>
                                  Review and provide feedback for this document
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div>
                                  <h4 className="font-medium mb-2">Document Content</h4>
                                  <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                                    {doc.content || 'No content yet'}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Your Feedback</h4>
                                  <Textarea
                                    value={editingFeedback}
                                    onChange={(e) => setEditingFeedback(e.target.value)}
                                    placeholder="Provide detailed feedback for the client..."
                                    rows={6}
                                  />
                                </div>
                                <Button variant="gold" onClick={handleSaveFeedback}>
                                  Save Feedback
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle>Consultations</CardTitle>
                <CardDescription>Manage your consultation schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Consultation scheduling coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
