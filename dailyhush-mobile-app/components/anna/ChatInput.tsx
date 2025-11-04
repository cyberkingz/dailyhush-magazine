import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Share what\'s on your mind...',
}) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(44);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const MAX_HEIGHT = 100;
  const MIN_HEIGHT = 44;
  const CHARACTER_LIMIT = 500;

  const canSend = message.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (canSend) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(MIN_HEIGHT);
      Keyboard.dismiss();
    }
  };

  const handleContentSizeChange = (event: any) => {
    const height = event.nativeEvent.contentSize.height;
    const newHeight = Math.min(Math.max(height, MIN_HEIGHT), MAX_HEIGHT);
    setInputHeight(newHeight);
  };

  const handleChangeText = (text: string) => {
    if (text.length <= CHARACTER_LIMIT) {
      setMessage(text);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={[
          styles.container,
          {
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                height: inputHeight,
              },
            ]}
            value={message}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#6B8F7F"
            multiline
            maxLength={CHARACTER_LIMIT}
            editable={!disabled}
            onContentSizeChange={handleContentSizeChange}
            textAlignVertical="center"
            returnKeyType="default"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color={canSend ? '#FFFFFF' : '#A0AEC0'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10, 22, 18, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(82, 183, 136, 0.2)',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(15, 31, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(82, 183, 136, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#E8F4F0',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 12,
    maxHeight: 100,
    letterSpacing: 0.2,
    fontFamily: 'Poppins_400Regular',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: '#40916C',
    shadowColor: '#52B788',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.4)',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(64, 145, 108, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
  },
});
