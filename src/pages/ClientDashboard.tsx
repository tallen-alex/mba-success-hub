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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Calendar,
  LogOut,
  Plus,
  Edit,
  Save,
  Loader2,
  BookOpen,
  Target,
  Clock,
  GraduationCap,
  X,
  Check,
  ExternalLink,
  AlertTriangle,
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

interface Document {
  id: string;
  document_type: string;
  title: string;
  content: string | null;
  status: string | null;
  feedback: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

interface ClientProfile {
  id: string;
  phone: string | null;
  target_schools: string[] | null;
  application_round: string | null;
  status: string | null;
}

interface SchoolDeadline {
  id: string;
  school_name: string;
  round_name: string;
  deadline_date: string;
}

const AVAILABLE_SCHOOLS = [
  'Harvard Business School',
  'Stanford GSB',
  'Wharton',
  'MIT Sloan',
  'Kellogg',
  'Columbia Business School',
  'Booth',
  'INSEAD',
  'Yale SOM',
  'Duke Fuqua',
  'NYU Stern',
  'Berkeley Haas',
  'LBS',
  'ISB',
  'IIM Ahmedabad',
  'IIM Bangalore',
  'IIM Calcutta',
];

const ROUNDS = ['Round 1', 'Round 2', 'Round 3', 'Early Decision', 'Merit Fellowship'];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deadlines, setDeadlines] = useState<SchoolDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<string>('');
  const [newDocSchool, setNewDocSchool] = useState<string>('');
  const [savingDocument, setSavingDocument] = useState(false);
  const [isEditingSchools, setIsEditingSchools] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>('');

  useEffect(() => {
    if (!authLoading && (!user || role !== 'client')) {
      navigate('/auth');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === 'client') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch client profile
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (clientData) {
      setClientProfile(clientData);
      setSelectedSchools(clientData.target_schools || []);
      setSelectedRound(clientData.application_round || '');

      // Fetch documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .order('updated_at', { ascending: false });

      if (docsData) {
        setDocuments(docsData);
      }
    }

    // Fetch school deadlines
    const { data: deadlinesData } = await supabase
      .from('school_deadlines')
      .select('*')
      .order('deadline_date', { ascending: true });

    if (deadlinesData) {
      setDeadlines(deadlinesData);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveSchools = async () => {
    if (!clientProfile) return;

    const { error } = await supabase
      .from('clients')
      .update({
        target_schools: selectedSchools,
        application_round: selectedRound,
      })
      .eq('id', clientProfile.id);

    if (error) {
      toast.error('Failed to save schools');
    } else {
      toast.success('Target schools updated');
      setClientProfile({
        ...clientProfile,
        target_schools: selectedSchools,
        application_round: selectedRound,
      });
      setIsEditingSchools(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!clientProfile || !newDocTitle || !newDocType) {
      toast.error('Please fill in all fields');
      return;
    }

    setSavingDocument(true);

    const title = newDocSchool ? `${newDocSchool} - ${newDocTitle}` : newDocTitle;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        client_id: clientProfile.id,
        title: title,
        document_type: newDocType,
        content: '',
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create document');
    } else {
      toast.success('Document created successfully');
      setDocuments([data, ...documents]);
      setIsCreatingDocument(false);
      setNewDocTitle('');
      setNewDocType('');
      setNewDocSchool('');
    }

    setSavingDocument(false);
  };

  const handleSaveDocument = async () => {
    if (!selectedDocument) return;

    setSavingDocument(true);

    const { error } = await supabase
      .from('documents')
      .update({
        content: editingContent,
        status: 'draft',
        version: selectedDocument.version + 1,
      })
      .eq('id', selectedDocument.id);

    if (error) {
      toast.error('Failed to save document');
    } else {
      toast.success('Document saved successfully');
      fetchData();
    }

    setSavingDocument(false);
  };

  const handleSubmitForReview = async () => {
    if (!selectedDocument) return;

    const { error } = await supabase
      .from('documents')
      .update({
        content: editingContent,
        status: 'review',
      })
      .eq('id', selectedDocument.id);

    if (error) {
      toast.error('Failed to submit for review');
    } else {
      toast.success('Document submitted for review');
      fetchData();
      setSelectedDocument(null);
    }
  };

  const getDaysUntilDeadline = (deadlineDate: string) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRelevantDeadlines = () => {
    if (!clientProfile?.target_schools || !clientProfile.application_round) return [];

    return deadlines.filter(
      (d) =>
        clientProfile.target_schools?.includes(d.school_name) &&
        d.round_name.toLowerCase().includes(clientProfile.application_round?.toLowerCase().replace('round ', '') || '')
    );
  };

  const documentTypeLabels: Record<string, string> = {
    resume: 'Resume',
    lor: 'Letter of Recommendation',
    essay: 'Essay',
    story: 'Story/Experience',
    other: 'Other',
  };

  const getDocumentsByType = (type: string) =>
    documents.filter((doc) => doc.document_type === type);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const relevantDeadlines = getRelevantDeadlines();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Client Portal</h1>
              <p className="text-primary-foreground/70 text-sm">
                Manage your MBA application documents
              </p>
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
        {/* Deadlines Alert */}
        {relevantDeadlines.length > 0 && (
          <div className="mb-8">
            <Card className="border-gold/30 bg-gold/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relevantDeadlines.slice(0, 6).map((deadline) => {
                    const daysLeft = getDaysUntilDeadline(deadline.deadline_date);
                    const isPast = daysLeft < 0;
                    const isUrgent = daysLeft >= 0 && daysLeft <= 14;

                    return (
                      <div
                        key={deadline.id}
                        className={`p-4 rounded-lg border ${
                          isPast
                            ? 'bg-muted/50 border-muted'
                            : isUrgent
                            ? 'bg-destructive/10 border-destructive/30'
                            : 'bg-background border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{deadline.school_name}</p>
                            <p className="text-xs text-muted-foreground">{deadline.round_name}</p>
                          </div>
                          {isUrgent && !isPast && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="mt-2">
                          {isPast ? (
                            <span className="text-xs text-muted-foreground">Deadline passed</span>
                          ) : (
                            <span
                              className={`text-lg font-bold ${
                                isUrgent ? 'text-destructive' : 'text-foreground'
                              }`}
                            >
                              {daysLeft} days left
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(deadline.deadline_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Target Schools Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  Target Schools
                </CardTitle>
                <CardDescription>Manage your target business schools and application round</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditingSchools(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {clientProfile?.target_schools && clientProfile.target_schools.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {clientProfile.target_schools.map((school, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gold/10 text-gold border-gold/30 py-1.5">
                      {school}
                    </Badge>
                  ))}
                </div>
                {clientProfile.application_round && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>Targeting: {clientProfile.application_round}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No target schools set yet</p>
                <Button variant="gold" size="sm" className="mt-4" onClick={() => setIsEditingSchools(true)}>
                  Add Target Schools
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <Edit className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {documents.filter((d) => d.status === 'draft').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {documents.filter((d) => d.status === 'review').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {documents.filter((d) => d.feedback).length}
                  </p>
                  <p className="text-sm text-muted-foreground">With Feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="documents">My Documents</TabsTrigger>
            <TabsTrigger value="stories">Stories Master File</TabsTrigger>
            <TabsTrigger value="consultations">Book a Call</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Application Documents</CardTitle>
                    <CardDescription>
                      Create and manage your resume, essays, and LORs
                    </CardDescription>
                  </div>
                  <Dialog open={isCreatingDocument} onOpenChange={setIsCreatingDocument}>
                    <DialogTrigger asChild>
                      <Button variant="gold">
                        <Plus className="h-4 w-4 mr-2" />
                        New Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Document</DialogTitle>
                        <DialogDescription>
                          Add a new document to your application portfolio
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Document Type</Label>
                          <Select value={newDocType} onValueChange={setNewDocType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="resume">Resume</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                              <SelectItem value="lor">Letter of Recommendation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newDocType === 'essay' && clientProfile?.target_schools && (
                          <div>
                            <Label>School (Optional)</Label>
                            <Select value={newDocSchool} onValueChange={setNewDocSchool}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select school" />
                              </SelectTrigger>
                              <SelectContent>
                                {clientProfile.target_schools.map((school) => (
                                  <SelectItem key={school} value={school}>
                                    {school}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div>
                          <Label>Title</Label>
                          <Input
                            placeholder="e.g., Essay 1 - Leadership Experience"
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                          />
                        </div>
                        <Button
                          variant="gold"
                          className="w-full"
                          onClick={handleCreateDocument}
                          disabled={savingDocument}
                        >
                          {savingDocument ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Plus className="h-4 w-4 mr-2" />
                          )}
                          Create Document
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents yet. Create your first document to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {['resume', 'essay', 'lor', 'other'].map((type) => {
                      const typeDocs = getDocumentsByType(type);
                      if (typeDocs.length === 0) return null;

                      return (
                        <div key={type}>
                          <h3 className="font-semibold text-lg mb-3 text-gold">
                            {documentTypeLabels[type]}
                          </h3>
                          <div className="space-y-2">
                            {typeDocs.map((doc) => (
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
                                      Version {doc.version} • Updated{' '}
                                      {new Date(doc.updated_at).toLocaleDateString()}
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
                                  {doc.feedback && (
                                    <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
                                      Has Feedback
                                    </Badge>
                                  )}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedDocument(doc);
                                          setEditingContent(doc.content || '');
                                        }}
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>{doc.title}</DialogTitle>
                                        <DialogDescription>
                                          Edit your document content
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 mt-4">
                                        {doc.feedback && (
                                          <div className="p-4 bg-gold/10 rounded-lg border border-gold/30">
                                            <h4 className="font-medium text-gold mb-2">
                                              Consultant Feedback
                                            </h4>
                                            <p className="text-sm whitespace-pre-wrap">
                                              {doc.feedback}
                                            </p>
                                          </div>
                                        )}
                                        <div>
                                          <Label>Document Content</Label>
                                          <Textarea
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            placeholder="Write your content here..."
                                            rows={15}
                                            className="font-mono text-sm"
                                          />
                                        </div>
                                        <div className="flex gap-4">
                                          <Button
                                            variant="outline"
                                            onClick={handleSaveDocument}
                                            disabled={savingDocument}
                                          >
                                            {savingDocument ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                              <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Save Draft
                                          </Button>
                                          <Button
                                            variant="gold"
                                            onClick={handleSubmitForReview}
                                          >
                                            Submit for Review
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stories Master File</CardTitle>
                    <CardDescription>
                      Document your experiences and stories for essay inspiration
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="gold">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Story
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Story</DialogTitle>
                        <DialogDescription>
                          Document an experience or achievement
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Story Title</Label>
                          <Input
                            placeholder="e.g., Leading cross-functional team"
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                          />
                        </div>
                        <Button
                          variant="gold"
                          className="w-full"
                          onClick={() => {
                            setNewDocType('story');
                            handleCreateDocument();
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Story
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {getDocumentsByType('story').length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No stories documented yet.</p>
                    <p className="text-sm">Start capturing your experiences and achievements.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getDocumentsByType('story').map((doc) => (
                      <Card key={doc.id} className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {doc.content || 'No content yet. Click edit to add your story.'}
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-4"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setEditingContent(doc.content || '');
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Story
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{doc.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <Textarea
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  placeholder="Describe the situation, your actions, and the results..."
                                  rows={12}
                                />
                                <Button variant="gold" onClick={handleSaveDocument}>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Story
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
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
                <CardTitle>Book a Consultation</CardTitle>
                <CardDescription>Schedule a session with Ameya to discuss your application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-6 text-gold" />
                  <h3 className="text-xl font-semibold mb-2">Ready to discuss your application?</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Book a one-on-one consultation with Ameya to review your essays, 
                    discuss strategy, or get feedback on your application materials.
                  </p>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={() => {
                      // Placeholder for Calendly integration
                      toast.info('Calendly integration coming soon! Contact Ameya directly to schedule.');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Schedule a Call
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Calendly integration will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Schools Dialog */}
      <Dialog open={isEditingSchools} onOpenChange={setIsEditingSchools}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Target Schools</DialogTitle>
            <DialogDescription>Select your target business schools and application round</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <Label className="mb-3 block">Target Round</Label>
              <Select value={selectedRound} onValueChange={setSelectedRound}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target round" />
                </SelectTrigger>
                <SelectContent>
                  {ROUNDS.map((round) => (
                    <SelectItem key={round} value={round}>
                      {round}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block">Select Schools</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                {AVAILABLE_SCHOOLS.map((school) => (
                  <button
                    key={school}
                    onClick={() => {
                      if (selectedSchools.includes(school)) {
                        setSelectedSchools(selectedSchools.filter((s) => s !== school));
                      } else {
                        setSelectedSchools([...selectedSchools, school]);
                      }
                    }}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-colors ${
                      selectedSchools.includes(school)
                        ? 'bg-gold/10 border-gold/50 text-gold'
                        : 'bg-muted/50 border-border hover:bg-muted'
                    }`}
                  >
                    {selectedSchools.includes(school) ? (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0" />
                    )}
                    {school}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditingSchools(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSaveSchools}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}