"""
Prompt templates for OpenAI API calls
"""

# Resume parsing prompt
RESUME_PARSING_PROMPT = """
Please parse the following resume text into a structured JSON format. Extract all relevant information accurately and organize it according to the schema below.

Resume Text:
{resume_text}

Please return a JSON object with the following structure:
{{
  "personal_info": {{
    "name": "Full name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "city, state/country",
    "linkedin": "LinkedIn URL",
    "website": "personal website URL"
  }},
  "summary": "Professional summary or objective statement",
  "experience": [
    {{
      "title": "Job title",
      "company": "Company name",
      "location": "City, State",
      "start_date": "MM/YYYY or Month YYYY",
      "end_date": "MM/YYYY or Month YYYY or Present",
      "description": ["bullet point 1", "bullet point 2", "bullet point 3"]
    }}
  ],
  "education": [
    {{
      "degree": "Degree type and major",
      "institution": "School name",
      "location": "City, State",
      "graduation_date": "MM/YYYY or Month YYYY",
      "gpa": "GPA if mentioned"
    }}
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": [
    {{
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "MM/YYYY or Month YYYY"
    }}
  ],
  "projects": [
    {{
      "name": "Project name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"],
      "url": "project URL if available"
    }}
  ]
}}

Important guidelines:
- Extract information exactly as written, don't make assumptions
- If information is missing, use empty strings or empty arrays
- For dates, preserve the original format when possible
- For experience descriptions, break into individual bullet points
- Include all skills mentioned, even if they seem minor
- Only include sections that have actual content in the resume
"""

# Resume rewriting prompt template
RESUME_REWRITING_PROMPT = """
You are an expert resume writer specializing in RoleColor-based resume optimization. Your task is to rewrite a resume to emphasize the candidate's RoleColor profile while maintaining ATS compatibility and professional standards.

RoleColor Profile:
{rolecolor_profile}

Primary RoleColor: {primary_rolecolor}

Original Resume Data:
{resume_data}

RoleColor Definitions:
- **Builders**: Innovation, leadership, strategy, vision-driven professionals who create and transform
- **Enablers**: Collaboration, execution, bridge-building experts who make things happen  
- **Thrivers**: Adaptability, resilience, results under pressure define these dynamic performers
- **Supportees**: Reliability, consistency, dependability form the backbone of stable teams

Please rewrite this resume to emphasize the candidate's {primary_rolecolor} traits while maintaining all factual information. Focus on:

1. **Summary/Objective**: Rewrite to highlight {primary_rolecolor} characteristics
2. **Experience Descriptions**: Emphasize achievements and responsibilities that showcase {primary_rolecolor} traits
3. **Skills**: Organize and prioritize skills that align with {primary_rolecolor} strengths
4. **Language**: Use action verbs and descriptors that resonate with {primary_rolecolor} identity

Return the rewritten resume in the same JSON structure as the input, but with enhanced content that emphasizes the RoleColor profile. Add a new field called "rolecolor_emphasis" that includes:

{{
  "rolecolor_emphasis": {{
    "primary_color": "{primary_rolecolor}",
    "highlighted_traits": ["trait1", "trait2", "trait3"],
    "rewritten_sections": ["summary", "experience", "skills"]
  }}
}}

Ensure the rewritten content is:
- ATS-friendly with relevant keywords
- Professional and compelling
- Factually accurate (don't add false information)
- Tailored to emphasize {primary_rolecolor} strengths
- Maintains the original structure and format
"""

# RoleColor analysis prompt
ROLECOLOR_ANALYSIS_PROMPT = """
Analyze the following resume content and determine which RoleColor profile best matches this candidate based on their experience, skills, and achievements.

Resume Content:
{resume_content}

RoleColor Definitions:
- **Builders (Innovation-focused)**: Leadership roles, strategic thinking, innovation, entrepreneurship, vision-setting, transformation initiatives, creating new processes/products
- **Enablers (Collaboration-focused)**: Team coordination, project management, cross-functional work, mentoring, process improvement, facilitating others' success
- **Thrivers (Adaptability-focused)**: Crisis management, rapid learning, diverse experiences, problem-solving under pressure, flexibility, results in challenging environments  
- **Supportees (Reliability-focused)**: Consistent performance, attention to detail, quality assurance, maintenance of systems, dependable execution, operational excellence

Please analyze the resume and return a JSON response with:
{{
  "analysis": {{
    "primary_rolecolor": "builder|enabler|thriver|supportee",
    "confidence_score": 0.85,
    "evidence": [
      "specific examples from resume that support this classification"
    ],
    "traits_identified": [
      "specific traits that align with the primary rolecolor"
    ],
    "secondary_rolecolor": "builder|enabler|thriver|supportee",
    "rolecolor_distribution": {{
      "builder": 0.25,
      "enabler": 0.15, 
      "thriver": 0.35,
      "supportee": 0.25
    }}
  }}
}}

Base your analysis on concrete evidence from the resume content, not assumptions.
"""

# Job matching prompt
JOB_MATCHING_PROMPT = """
Analyze how well this candidate's RoleColor profile and resume content matches the given job description.

Candidate RoleColor Profile:
{rolecolor_profile}

Candidate Resume:
{resume_data}

Job Description:
{job_description}

Please provide a comprehensive matching analysis in JSON format:
{{
  "match_analysis": {{
    "overall_fit_score": 0.85,
    "rolecolor_alignment": {{
      "job_requires": "primary rolecolor needed for this job",
      "candidate_offers": "candidate's primary rolecolor", 
      "alignment_score": 0.90,
      "explanation": "why this is a good/poor rolecolor match"
    }},
    "skills_match": {{
      "matching_skills": ["skill1", "skill2"],
      "missing_skills": ["skill3", "skill4"],
      "transferable_skills": ["skill5", "skill6"],
      "skills_score": 0.75
    }},
    "experience_relevance": {{
      "relevant_experience": ["experience item 1", "experience item 2"],
      "experience_gaps": ["gap 1", "gap 2"],
      "experience_score": 0.80
    }},
    "recommendations": [
      "specific suggestions for improving match",
      "areas to emphasize in application",
      "potential concerns to address"
    ]
  }}
}}
"""
