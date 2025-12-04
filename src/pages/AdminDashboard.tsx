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
import { Label } from '@/components/ui/label';
import {
  Users,
  FileText,
  Calendar,
  LogOut,
  Search,
  Eye,
  Edit,
  Loader2,
  X,
  Save,
  GraduationCap,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

interface Client {
  id: string;
  user_id: string;
  phone: string | null;
  target_schools: string[] | null;
  application_round: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  profile?: Profile;
}

interface Document {
  id: string;
  client_id: string;
  document_type: string;
  title: string;
  content: string | null;
  status: string | null;
  feedback: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDocuments, setClientDocuments] = useState<Document[]>([]);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingFeedback, setEditingFeedback] = useState('');
  const [savingDocument, setSavingDocument] = useState(false);

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

    // Fetch all profiles first
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*');

    const profilesMap: Record<string, Profile> = {};
    if (profilesData) {
      profilesData.forEach((p) => {
        profilesMap[p.id] = p;
      });
      setProfiles(profilesMap);
    }

    // Fetch clients
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (clientsData) {
      const clientsWithProfiles = clientsData.map((c) => ({
        ...c,
        profile: profilesMap[c.user_id],
      }));
      setClients(clientsWithProfiles);
    }

    setLoading(false);
  };

  const fetchClientDocuments = async (clientId: string) => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false });

    if (data) {
      setClientDocuments(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleViewClient = async (client: Client) => {
    setSelectedClient(client);
    await fetchClientDocuments(client.id);
  };

  const handleSaveDocument = async () => {
    if (!editingDocument) return;

    setSavingDocument(true);

    const { error } = await supabase
      .from('documents')
      .update({
        content: editingContent,
        feedback: editingFeedback,
      })
      .eq('id', editingDocument.id);

    if (error) {
      toast.error('Failed to save document');
    } else {
      toast.success('Document saved successfully');
      if (selectedClient) {
        await fetchClientDocuments(selectedClient.id);
      }
      setEditingDocument(null);
    }

    setSavingDocument(false);
  };

  const filteredClients = clients.filter((client) =>
    client.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const documentTypeLabels: Record<string, string> = {
    resume: 'Resume',
    lor: 'Letter of Recommendation',
    essay: 'Essay',
    story: 'Story/Experience',
    other: 'Other',
  };

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
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
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
                  <p className="text-2xl font-bold">
                    {clients.filter((c) => c.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
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
                  <p className="text-sm text-muted-foreground">Consultations Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {clients.reduce((acc, c) => acc + (c.target_schools?.length || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Target Schools</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>View and manage all your clients</CardDescription>
              </div>
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
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-gold">
                          {client.profile?.full_name?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {client.profile?.full_name || 'Unnamed Client'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.profile?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-medium">
                          {client.target_schools?.length || 0} Target Schools
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {client.application_round || 'Round not set'}
                        </p>
                      </div>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status || 'active'}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleViewClient(client)}>
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
      </main>

      {/* Client Detail Sheet */}
      <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">
              {selectedClient?.profile?.full_name || 'Client Details'}
            </SheetTitle>
            <SheetDescription>{selectedClient?.profile?.email}</SheetDescription>
          </SheetHeader>

          {selectedClient && (
            <div className="mt-6 space-y-6">
              {/* Client Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  Target Schools
                </h3>
                {selectedClient.target_schools && selectedClient.target_schools.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.target_schools.map((school, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gold/10 text-gold border-gold/30">
                        {school}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No target schools set</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.application_round || 'Round not set'}</span>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{selectedClient.notes}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  Application Materials
                </h3>

                {clientDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {clientDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {documentTypeLabels[doc.document_type] || doc.document_type} • v{doc.version}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              doc.status === 'draft' ? 'secondary' : doc.status === 'review' ? 'default' : 'outline'
                            }
                          >
                            {doc.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingDocument(doc);
                              setEditingContent(doc.content || '');
                              setEditingFeedback(doc.feedback || '');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Document Edit Dialog */}
      <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDocument?.title}</DialogTitle>
            <DialogDescription>
              Review and edit this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Document Content</Label>
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                placeholder="Document content..."
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label>Your Feedback</Label>
              <Textarea
                value={editingFeedback}
                onChange={(e) => setEditingFeedback(e.target.value)}
                placeholder="Provide feedback for the client..."
                rows={6}
              />
            </div>
            <Button variant="gold" onClick={handleSaveDocument} disabled={savingDocument}>
              {savingDocument ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}