// React hook for managing AI chat functionality

import { useState, useCallback, useEffect } from 'react';
import { claudeService } from '../services/claudeService';
import type { ChatMessage, ChatContext } from '../types/chat';

const INITIAL_MESSAGE: ChatMessage = {
  id: '0',
  role: 'assistant',
