"""
OpenAI API client for RoleColorAI
"""
import json
import asyncio
from typing import Dict, List, Any, Optional
import structlog
from openai import AsyncOpenAI

logger = structlog.get_logger()

class OpenAIClient:
    """Async OpenAI API client for resume processing"""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4"):
        """
        Initialize OpenAI client
        
        Args:
            api_key: OpenAI API key (if None, will use environment variable)
            model: OpenAI model to use
        """
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model
        self.default_temperature = 0.7
        self.default_max_tokens = 3000
    
    async def complete_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None
    ) -> str:
        """
        Complete a chat conversation using OpenAI API
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
            model: Model to use (overrides default)
            
        Returns:
            Generated response text
        """
        try:
            response = await self.client.chat.completions.create(
                model=model or self.model,
                messages=messages,
                temperature=temperature or self.default_temperature,
                max_tokens=max_tokens or self.default_max_tokens,
                response_format={"type": "json_object"} if self._is_json_request(messages) else None
            )
            
            content = response.choices[0].message.content
            
            logger.info("OpenAI API call successful",
                       model=model or self.model,
                       tokens_used=response.usage.total_tokens if response.usage else None)
            
            return content
            
        except Exception as e:
            logger.error("OpenAI API call failed", error=str(e), exc_info=True)
            raise
    
    def _is_json_request(self, messages: List[Dict[str, str]]) -> bool:
        """Check if the request expects JSON response"""
        for message in messages:
            content = message.get('content', '').lower()
            if 'json' in content or 'structured' in content:
                return True
        return False
    
    def parse_json_response(self, response: str) -> Dict[str, Any]:
        """
        Parse JSON response from OpenAI
        
        Args:
            response: Raw response string from OpenAI
            
        Returns:
            Parsed JSON data
        """
        try:
            # Try to parse as JSON directly
            return json.loads(response)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            if '```json' in response:
                start = response.find('```json') + 7
                end = response.find('```', start)
                json_str = response[start:end].strip()
                return json.loads(json_str)
            elif '```' in response:
                start = response.find('```') + 3
                end = response.find('```', start)
                json_str = response[start:end].strip()
                return json.loads(json_str)
            else:
                # Try to find JSON-like content
                start = response.find('{')
                end = response.rfind('}') + 1
                if start != -1 and end != 0:
                    json_str = response[start:end]
                    return json.loads(json_str)
                else:
                    raise ValueError(f"Could not extract JSON from response: {response}")
    
    async def generate_embedding(self, text: str, model: str = "text-embedding-ada-002") -> List[float]:
        """
        Generate embedding for text using OpenAI
        
        Args:
            text: Text to embed
            model: Embedding model to use
            
        Returns:
            Embedding vector
        """
        try:
            response = await self.client.embeddings.create(
                model=model,
                input=text
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            logger.error("OpenAI embedding generation failed", error=str(e), exc_info=True)
            raise
    
    async def count_tokens(self, text: str, model: Optional[str] = None) -> int:
        """
        Count tokens in text for the specified model
        
        Args:
            text: Text to count tokens for
            model: Model to count tokens for
            
        Returns:
            Number of tokens
        """
        try:
            import tiktoken
            
            encoding = tiktoken.encoding_for_model(model or self.model)
            return len(encoding.encode(text))
            
        except Exception as e:
            logger.warning("Token counting failed, using estimate", error=str(e))
            # Rough estimate: 1 token ≈ 4 characters
            return len(text) // 4
