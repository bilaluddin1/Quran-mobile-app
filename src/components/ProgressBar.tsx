/**
 * Reusable Progress Bar Component
 * Animated progress bar with customizable styling
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
  duration?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#E0E0E0',
  progressColor = '#4CAF50',
  showPercentage = true,
  animated = true,
  duration = 300,
  style,
  textStyle,
  label,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: Math.max(0, Math.min(100, progress)),
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(Math.max(0, Math.min(100, progress)));
    }
  }, [progress, animated, duration, animatedWidth]);

  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, textStyle]}>{label}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, textStyle]}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      )}
      
      <View style={[styles.progressContainer, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              height,
              backgroundColor: progressColor,
              width: progressWidth,
            },
          ]}
        />
      </View>
      
      {!label && showPercentage && (
        <Text style={[styles.percentageText, textStyle]}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  progressContainer: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ProgressBar;
