import { Box, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const isPlugin = message.type === 'plugin';

  const getPluginIcon = (type) => {
    switch (type) {
      case 'weather':
        return '🌡️';
      case 'calc':
        return '🔢';
      case 'define':
        return '📚';
      default:
        return '🤖';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '80%',
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            [isUser ? 'right' : 'left']: -8,
            transform: 'translateY(-50%)',
            borderStyle: 'solid',
            borderWidth: '8px 0 8px 8px',
            borderColor: isUser 
              ? 'transparent transparent transparent primary.main'
              : 'transparent transparent transparent background.paper',
            [isUser ? 'borderRight' : 'borderLeft']: 'none',
          },
        }}
      >
        {isPlugin && (
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {getPluginIcon(message.pluginData?.type)} {message.pluginData?.pluginName}
            </Typography>
          </Box>
        )}
        
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            opacity: 0.7,
            textAlign: 'right',
          }}
        >
          {format(new Date(message.timestamp), 'HH:mm')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble; 