/**
 * Reusable Card Component
 * Container component with consistent styling and shadows
 */

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  elevation?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  margin = 0,
  elevation = 3,
  borderRadius = 12,
  backgroundColor = '#fff',
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    padding,
    margin,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    elevation,
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

export default Card;
