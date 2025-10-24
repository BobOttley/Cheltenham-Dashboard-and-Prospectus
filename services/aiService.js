const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

class AIService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  /**
   * Load knowledge base files for context
   */
  async loadKnowledgeBase() {
    try {
      const knowledgeBase = {};

      // Load chunks.jsonl
      const chunksPath = path.join(__dirname, '../chunks.jsonl');
      try {
        const chunksData = await fs.readFile(chunksPath, 'utf-8');
        knowledgeBase.chunks = chunksData.split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));
      } catch (err) {
        console.log('chunks.jsonl not found, skipping');
        knowledgeBase.chunks = [];
      }

      // Load static_qa_config.py
      const qaConfigPath = path.join(__dirname, '../static_qa_config.py');
      try {
        knowledgeBase.qaConfig = await fs.readFile(qaConfigPath, 'utf-8');
      } catch (err) {
        console.log('static_qa_config.py not found, skipping');
        knowledgeBase.qaConfig = '';
      }

      // Load url_mappings.py
      const urlMappingsPath = path.join(__dirname, '../url_mappings.py');
      try {
        knowledgeBase.urlMappings = await fs.readFile(urlMappingsPath, 'utf-8');
      } catch (err) {
        console.log('url_mappings.py not found, skipping');
        knowledgeBase.urlMappings = '';
      }

      // Load PDF.txt
      const pdfPath = path.join(__dirname, '../PDF.txt');
      try {
        knowledgeBase.pdfContent = await fs.readFile(pdfPath, 'utf-8');
      } catch (err) {
        console.log('PDF.txt not found, skipping');
        knowledgeBase.pdfContent = '';
      }

      return knowledgeBase;
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      return {
        chunks: [],
        qaConfig: '',
        urlMappings: '',
        pdfContent: ''
      };
    }
  }

  /**
   * Get enquiry data from database
   */
  async getEnquiryData(enquiryId, db) {
    try {
      const enquiry = await db.collection('enquiries').findOne({ enquiryId });
      
      if (!enquiry) {
        return null;
      }

      return {
        familyInformation: enquiry.familyInformation || {},
        admissionDetails: enquiry.admissionDetails || {},
        interestsActivities: enquiry.interestsActivities || {},
        status: enquiry.status || {},
        adminNotes: enquiry.adminNotes || [],
        activityLog: enquiry.activityLog || [],
        sessionHistory: enquiry.sessionHistory || [],
        moduleDetails: enquiry.moduleDetails || {}
      };
    } catch (error) {
      console.error('Error fetching enquiry data:', error);
      return null;
    }
  }

  /**
   * Generate email response using Claude
   */
  async generateEmailResponse(params) {
    const {
      originalEmail,
      enquiryData,
      knowledgeBase,
      userContext,
      instructions
    } = params;

    try {
      // Build context for Claude
      const contextParts = [
        '# Email Context',
        `Original Email From: ${originalEmail.from}`,
        `Subject: ${originalEmail.subject}`,
        `Date: ${originalEmail.date}`,
        '',
        '# Original Email Content',
        originalEmail.text || originalEmail.html,
        ''
      ];

      if (enquiryData) {
        contextParts.push('# Enquiry Information');
        contextParts.push('');
        contextParts.push('## Family Information');
        contextParts.push(JSON.stringify(enquiryData.familyInformation, null, 2));
        contextParts.push('');
        contextParts.push('## Admission Details');
        contextParts.push(JSON.stringify(enquiryData.admissionDetails, null, 2));
        contextParts.push('');
        contextParts.push('## Interests and Activities');
        contextParts.push(JSON.stringify(enquiryData.interestsActivities, null, 2));
        contextParts.push('');
        contextParts.push('## Status');
        contextParts.push(JSON.stringify(enquiryData.status, null, 2));
        contextParts.push('');
        contextParts.push('## Admin Notes');
        contextParts.push(JSON.stringify(enquiryData.adminNotes, null, 2));
        contextParts.push('');
        contextParts.push('## Activity Log');
        contextParts.push(JSON.stringify(enquiryData.activityLog, null, 2));
        contextParts.push('');
        contextParts.push('## Session History');
        contextParts.push(JSON.stringify(enquiryData.sessionHistory, null, 2));
        contextParts.push('');
      }

      // Add knowledge base context (truncated to avoid token limits)
      if (knowledgeBase.qaConfig) {
        contextParts.push('# School Q&A Knowledge Base');
        contextParts.push(knowledgeBase.qaConfig.substring(0, 5000)); // Limit size
        contextParts.push('');
      }

      if (knowledgeBase.pdfContent) {
        contextParts.push('# School Information');
        contextParts.push(knowledgeBase.pdfContent.substring(0, 5000)); // Limit size
        contextParts.push('');
      }

      const context = contextParts.join('\n');

      // Create the prompt for Claude
      const prompt = `You are a professional admissions officer responding to a parent's email enquiry. 

Your task is to generate a professional, warm, and helpful email response based on:
1. The original email content
2. The enquiry history and family information
3. School knowledge base information
${instructions ? '4. Specific instructions provided by the admissions officer' : ''}

Guidelines:
- ALWAYS start with a greeting addressing the sender by name (e.g., "Dear Mrs Smith," or "Dear Sarah,")
- Extract the sender's name from the email signature or "From" field
- If only an email address is provided with no name, use "Dear [First name from email]," 
- Be professional yet warm and welcoming
- Address specific questions from the parent's email
- Reference relevant information from the enquiry history when appropriate
- Use school knowledge to provide accurate information
- Keep the tone conversational but professional
- Be concise but thorough
- If you don't have specific information, suggest next steps or offer to find out
${instructions ? '- IMPORTANT: Follow these specific instructions: ' + instructions : ''}

IMPORTANT - Link Formatting:
- When including website links, use descriptive text instead of full URLs
- Format links as: [descriptive text](URL)
- Examples:
  * Instead of: "Visit https://www.cheltenhamcollege.org/admissions/visit-us/"
  * Use: "Visit our [open events page](https://www.cheltenhamcollege.org/admissions/visit-us/)"
  * Or: "You can find more details on our [sports facilities](https://www.cheltenhamcollege.org/college/sport/)"
- Make link text natural and descriptive (e.g., "admissions page", "visit us page", "sports facilities", "open events")

DO NOT include:
- Email signature (this will be added automatically)
- Your name or title at the end (signature will handle this)

Please generate ONLY the email body content, starting with a personalized greeting.

Context Information:
${context}

Generate a professional email response:`;

      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const response = message.content[0].text;

      return {
        success: true,
        response: response.trim(),
        usage: {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens
        }
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate response'
      };
    }
  }

  /**
   * Convert text response to HTML
   */
  textToHtml(text) {
    // First, convert markdown-style links [text](url) to HTML links
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let textWithLinks = text.replace(markdownLinkRegex, (match, linkText, url) => {
      return `<a href="${url}" style="color: #0066cc; text-decoration: underline;">${linkText}</a>`;
    });
    
    // Then convert any remaining plain URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    textWithLinks = textWithLinks.replace(urlRegex, (url) => {
      // Don't convert if it's already part of an HTML link
      return `<a href="${url}" style="color: #0066cc; text-decoration: underline;">${url}</a>`;
    });
    
    // Then convert paragraphs and line breaks
    return textWithLinks
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('\n');
  }

  /**
   * Generate complete email with signature
   */
  async generateCompleteEmail(params) {
    const aiResponse = await this.generateEmailResponse(params);

    if (!aiResponse.success) {
      return aiResponse;
    }

    const htmlBody = this.textToHtml(aiResponse.response);

    return {
      success: true,
      body: {
        text: aiResponse.response,
        html: htmlBody
      },
      usage: aiResponse.usage
    };
  }
}

module.exports = new AIService();