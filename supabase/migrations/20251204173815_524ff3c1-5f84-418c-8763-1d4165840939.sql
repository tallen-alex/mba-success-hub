-- Add target_school_deadlines table for school-specific deadlines
CREATE TABLE IF NOT EXISTS public.school_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  round_name TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_deadlines ENABLE ROW LEVEL SECURITY;

-- Everyone can read school deadlines (public reference data)
CREATE POLICY "Anyone can view school deadlines"
ON public.school_deadlines
FOR SELECT
USING (true);

-- Only admins can manage school deadlines
CREATE POLICY "Admins can manage school deadlines"
ON public.school_deadlines
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert common MBA school deadlines for 2024-2025 cycle
INSERT INTO public.school_deadlines (school_name, round_name, deadline_date) VALUES
('Harvard Business School', 'Round 1', '2024-09-04'),
('Harvard Business School', 'Round 2', '2025-01-06'),
('Stanford GSB', 'Round 1', '2024-09-10'),
('Stanford GSB', 'Round 2', '2025-01-07'),
('Wharton', 'Round 1', '2024-09-04'),
('Wharton', 'Round 2', '2025-01-08'),
('MIT Sloan', 'Round 1', '2024-09-25'),
('MIT Sloan', 'Round 2', '2025-01-15'),
('Kellogg', 'Round 1', '2024-09-11'),
('Kellogg', 'Round 2', '2025-01-08'),
('Columbia Business School', 'Early Decision', '2024-09-06'),
('Columbia Business School', 'Merit Fellowship', '2025-01-03'),
('Booth', 'Round 1', '2024-09-19'),
('Booth', 'Round 2', '2025-01-07'),
('INSEAD', 'Round 1', '2024-09-24'),
('INSEAD', 'Round 2', '2024-11-19'),
('INSEAD', 'Round 3', '2025-01-14'),
('Yale SOM', 'Round 1', '2024-09-10'),
('Yale SOM', 'Round 2', '2025-01-07'),
('Duke Fuqua', 'Round 1', '2024-09-11'),
('Duke Fuqua', 'Round 2', '2025-01-09'),
('NYU Stern', 'Round 1', '2024-09-15'),
('NYU Stern', 'Round 2', '2025-01-15'),
('Berkeley Haas', 'Round 1', '2024-09-12'),
('Berkeley Haas', 'Round 2', '2025-01-09'),
('LBS', 'Round 1', '2024-09-06'),
('LBS', 'Round 2', '2024-10-25'),
('LBS', 'Round 3', '2025-01-03'),
('ISB', 'Round 1', '2024-09-15'),
('ISB', 'Round 2', '2024-11-15'),
('ISB', 'Round 3', '2025-01-15'),
('IIM Ahmedabad', 'Round 1', '2024-10-31'),
('IIM Bangalore', 'Round 1', '2024-11-30'),
('IIM Calcutta', 'Round 1', '2024-11-30');