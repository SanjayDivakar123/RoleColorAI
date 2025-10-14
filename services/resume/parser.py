"""
Resume parsing service using OpenAI API
"""
import asyncio
from typing import Dict, Any, Optional
import structlog
from pathlib import Path

from services.ai.openai_client import OpenAIClient
from services.ai.prompts import RESUME_PARSING_PROMPT

logger = structlog.get_logger()

class ResumeParser:
    """Service for parsing resumes into structured JSON using OpenAI"""
    
    def __init__(self):
        self.openai_client = OpenAIClient()
    
    async def parse_resume_text(self, text: str, filename: Optional[str] = None) -> Dict[str, Any]:
        """
        Parse resume text into structured JSON format
        
        Args:
            text: Raw resume text
            filename: Original filename for context
            
        Returns:
            Structured resume data as dictionary
        """
        try:
            logger.info("Starting resume parsing", filename=filename, text_length=len(text))
            
            # Prepare the prompt with the resume text
            prompt = RESUME_PARSING_PROMPT.format(resume_text=text)
            
            # Call OpenAI API
            response = await self.openai_client.complete_chat(
                messages=[
                    {"role": "system", "content": "You are an expert resume parser. Extract structured information from resumes accurately."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,  # Low temperature for consistent parsing
                max_tokens=3000
            )
            
            # Parse the JSON response
            parsed_data = self.openai_client.parse_json_response(response)
            
            # Validate the parsed data structure
            validated_data = self._validate_parsed_data(parsed_data)
            
            logger.info("Resume parsing completed successfully", 
                       filename=filename, 
                       sections_found=list(validated_data.keys()))
            
            return validated_data
            
        except Exception as e:
            logger.error("Resume parsing failed", 
                        filename=filename, 
                        error=str(e), 
                        exc_info=True)
            raise
    
    def _validate_parsed_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and clean the parsed resume data
        
        Args:
            data: Raw parsed data from OpenAI
            
        Returns:
            Validated and cleaned data
        """
        # Define required structure
        required_structure = {
            "personal_info": {
                "name": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "website": ""
            },
            "summary": "",
            "experience": [],
            "education": [],
            "skills": [],
            "certifications": [],
            "projects": []
        }
        
        # Merge with defaults to ensure all fields exist
        validated_data = self._deep_merge(required_structure, data)
        
        # Clean and validate specific fields
        validated_data = self._clean_data(validated_data)
        
        return validated_data
    
    def _deep_merge(self, default: Dict, data: Dict) -> Dict:
        """Deep merge two dictionaries, with data taking precedence"""
        result = default.copy()
        
        for key, value in data.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value
        
        return result
    
    def _clean_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Clean and normalize the parsed data"""
        
        # Clean personal info
        if "personal_info" in data:
            personal_info = data["personal_info"]
            
            # Normalize email
            if personal_info.get("email"):
                personal_info["email"] = personal_info["email"].lower().strip()
            
            # Clean phone number
            if personal_info.get("phone"):
                phone = personal_info["phone"]
                # Remove common formatting characters
                phone = ''.join(c for c in phone if c.isdigit() or c in ['+', '-', '(', ')', ' '])
                personal_info["phone"] = phone.strip()
        
        # Ensure experience is a list
        if not isinstance(data.get("experience", []), list):
            data["experience"] = []
        
        # Ensure education is a list
        if not isinstance(data.get("education", []), list):
            data["education"] = []
        
        # Ensure skills is a list
        if not isinstance(data.get("skills", []), list):
            data["skills"] = []
        
        # Clean skills list
        if data.get("skills"):
            data["skills"] = [skill.strip() for skill in data["skills"] if skill.strip()]
        
        return data

class ResumeTextExtractor:
    """Service for extracting text from various resume file formats"""
    
    @staticmethod
    async def extract_from_pdf(file_path: Path) -> str:
        """Extract text from PDF file"""
        try:
            import PyPDF2
            
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                
                return text.strip()
                
        except Exception as e:
            logger.error("PDF text extraction failed", file_path=str(file_path), error=str(e))
            raise
    
    @staticmethod
    async def extract_from_docx(file_path: Path) -> str:
        """Extract text from DOCX file"""
        try:
            from docx import Document
            
            doc = Document(file_path)
            text = ""
            
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text.strip()
            
        except Exception as e:
            logger.error("DOCX text extraction failed", file_path=str(file_path), error=str(e))
            raise
    
    @staticmethod
    async def extract_from_txt(file_path: Path) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read().strip()
                
        except Exception as e:
            logger.error("TXT text extraction failed", file_path=str(file_path), error=str(e))
            raise
    
    async def extract_text(self, file_path: Path) -> str:
        """
        Extract text from resume file based on extension
        
        Args:
            file_path: Path to the resume file
            
        Returns:
            Extracted text content
        """
        file_extension = file_path.suffix.lower()
        
        if file_extension == '.pdf':
            return await self.extract_from_pdf(file_path)
        elif file_extension == '.docx':
            return await self.extract_from_docx(file_path)
        elif file_extension == '.txt':
            return await self.extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
