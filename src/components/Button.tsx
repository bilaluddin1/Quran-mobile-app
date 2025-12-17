/**
 * Reusable Button Component
 * Customizable button with different variants and styles
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.6 : 1,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      default:
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 20;
    }

    return { ...baseStyle, ...style };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default:
        baseStyle.fontSize = 16;
    }

    switch (variant) {
      case 'primary':
        baseStyle.color = '#fff';
        break;
      case 'secondary':
        baseStyle.color = '#2E7D32';
        break;
      case 'danger':
        baseStyle.color = '#fff';
        break;
      case 'success':
        baseStyle.color = '#fff';
        break;
    }

    return { ...baseStyle, ...textStyle };
  };

  const getGradientColors = (): string[] => {
    switch (variant) {
      case 'primary':
        return ['#2E7D32', '#4CAF50'];
      case 'secondary':
        return ['#E8F5E8', '#F1F8E9'];
      case 'danger':
        return ['#F44336', '#EF5350'];
      case 'success':
        return ['#4CAF50', '#66BB6A'];
      default:
        return ['#2E7D32', '#4CAF50'];
    }
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? '#2E7D32' : '#fff'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </>
  );

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), { backgroundColor: '#E8F5E8' }]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
