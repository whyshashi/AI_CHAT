import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useChatStore } from '../store/chatStore';
import { pluginManager } from '../plugins/pluginManager';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const scrollRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage(input, 'user');
    setInput('');

    const pluginMatch = pluginManager.parseMessage(input);
    
    if (pluginMatch) {
      setLoading(true);
      try {
        const response = await pluginManager.executePlugin(pluginMatch.plugin, pluginMatch.args);
        addMessage(response.content, 'assistant', 'plugin', {
          type: response.type,
          pluginName: pluginMatch.plugin.name,
        });
      } catch (error) {
        addMessage(`Error: ${error.message}`, 'assistant', 'text');
      } finally {
        setLoading(false);
      }
    } else {
      addMessage("I'm a plugin-based chat assistant. Try using commands like:\n/weather [city]\n/calc [expression]\n/define [word]", 'assistant');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'primary.main',
        color: 'white',
        flexShrink: 0
      }}>
        <Typography variant="h6">AI Chat Assistant</Typography>
        <Typography variant="caption">
          Available commands: {pluginManager.getAvailablePlugins().map(cmd => `/${cmd}`).join(', ')}
        </Typography>
      </Box>

      <Box sx={{ 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <ScrollToBottom 
          className="messages-container"
          followButtonClassName="scroll-to-bottom-follow-button"
          initialScrollBehavior="auto"
          scrollMode="bottom"
          style={{ 
            height: '100%',
            width: '100%'
          }}
        >
          <Box sx={{ 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minHeight: '100%'
          }}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        </ScrollToBottom>
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
          flexShrink: 0
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message or use a command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          size="small"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <IconButton 
          type="submit" 
          color="primary" 
          disabled={!input.trim() || isLoading}
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInterface; 