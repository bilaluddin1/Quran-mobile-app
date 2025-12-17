/**
 * Status Indicator Component
 * Visual indicator for different states and statuses
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'warning' | 'error' | 'success';
  label?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'medium',
  showLabel = true,
  style,
  textStyle,
}) => {
  const getStatusColor = (): string => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#9E9E9E';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      case 'success':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (): string => {
    if (label) return label;
    
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      default:
        return 'Unknown';
    }
  };

  const getDotSize = (): number => {
    switch (size) {
      case 'small':
        return 8;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 18;
      default:
        return 14;
    }
  };

  const dotSize = getDotSize();
  const textSize = getTextSize();
  const statusColor = getStatusColor();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: statusColor,
          },
        ]}
      />
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              fontSize: textSize,
              color: statusColor,
            },
            textStyle,
          ]}
        >
          {getStatusText()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginRight: 8,
  },
  label: {
    fontWeight: '500',
  },
});

export default StatusIndicator;
