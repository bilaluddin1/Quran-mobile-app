/**
 * Progress Screen - View recitation statistics and session history
 * Shows user's progress, achievements, and performance metrics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useBikeMode, BikeModeSession } from '../context/BikeModeContext';

const { width } = Dimensions.get('window');

const ProgressScreen: React.FC = () => {
  const navigation = useNavigation();
  const { sessionHistory, currentSession } = useBikeMode();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const getFilteredSessions = () => {
    const now = new Date();
    const filtered = sessionHistory.filter(session => {
      if (selectedPeriod === 'all') return true;
      
      const sessionDate = session.startTime;
      const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (selectedPeriod === 'week') return daysDiff <= 7;
      if (selectedPeriod === 'month') return daysDiff <= 30;
      
      return true;
    });
    
    return filtered;
  };

  const getStats = () => {
    const sessions = getFilteredSessions();
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        totalVerses: 0,
        averageAccuracy: 0,
        totalMistakes: 0,
        totalPauses: 0,
        streakDays: 0,
      };
    }

    const totalTime = sessions.reduce((sum, session) => sum + session.totalDuration, 0);
    const totalVerses = sessions.reduce((sum, session) => sum + session.versesRecited, 0);
    const totalMistakes = sessions.reduce((sum, session) => sum + session.mistakesDetected, 0);
    const totalPauses = sessions.reduce((sum, session) => sum + session.pausesDetected, 0);
    const averageAccuracy = sessions.reduce((sum, session) => sum + session.averageAccuracy, 0) / sessions.length;

    // Calculate streak
    const sortedSessions = sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    let streakDays = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (sessionDate.getTime() === currentDate.getTime()) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (sessionDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return {
      totalSessions: sessions.length,
      totalTime,
      totalVerses,
      averageAccuracy: Math.round(averageAccuracy),
      totalMistakes,
      totalPauses,
      streakDays,
    };
  };

  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAchievements = () => {
    const stats = getStats();
    const achievements = [];

    if (stats.totalSessions >= 1) {
      achievements.push({ icon: 'star', title: 'First Session', description: 'Completed your first recitation session' });
    }
    if (stats.totalSessions >= 10) {
      achievements.push({ icon: 'star', title: 'Dedicated Learner', description: 'Completed 10 recitation sessions' });
    }
    if (stats.totalVerses >= 100) {
      achievements.push({ icon: 'star', title: 'Verse Master', description: 'Recited 100 verses' });
    }
    if (stats.streakDays >= 7) {
      achievements.push({ icon: 'star', title: 'Week Warrior', description: '7-day recitation streak' });
    }
    if (stats.averageAccuracy >= 90) {
      achievements.push({ icon: 'star', title: 'Accuracy Expert', description: '90%+ average accuracy' });
    }

    return achievements;
  };

  const stats = getStats();
  const achievements = getAchievements();
  const filteredSessions = getFilteredSessions();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.statGradient}
      >
        <Icon name={icon} size={32} color="#fff" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </View>
  );

  const SessionItem: React.FC<{ session: BikeModeSession }> = ({ session }) => (
    <View style={styles.sessionItem}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionDate}>{formatDate(session.startTime)}</Text>
        <Text style={styles.sessionDuration}>{formatDuration(session.totalDuration)}</Text>
      </View>
      <View style={styles.sessionStats}>
        <View style={styles.sessionStat}>
          <Icon name="book" size={16} color="#2E7D32" />
          <Text style={styles.sessionStatText}>{session.versesRecited} verses</Text>
        </View>
        <View style={styles.sessionStat}>
          <Icon name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.sessionStatText}>{session.averageAccuracy}% accuracy</Text>
        </View>
        <View style={styles.sessionStat}>
          <Icon name="error" size={16} color="#FF9800" />
          <Text style={styles.sessionStatText}>{session.mistakesDetected} mistakes</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'all'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Session */}
        {currentSession && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Session</Text>
            <View style={styles.currentSessionCard}>
              <View style={styles.currentSessionHeader}>
                <Icon name="play-circle-filled" size={24} color="#4CAF50" />
                <Text style={styles.currentSessionTitle}>Session in Progress</Text>
              </View>
              <View style={styles.currentSessionStats}>
                <Text style={styles.currentSessionStat}>
                  {currentSession.versesRecited} verses recited
                </Text>
                <Text style={styles.currentSessionStat}>
                  {formatDuration(Date.now() - currentSession.startTime.getTime())} elapsed
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Sessions"
              value={stats.totalSessions}
              icon="history"
              color="#4CAF50"
            />
            <StatCard
              title="Total Time"
              value={formatDuration(stats.totalTime)}
              icon="access-time"
              color="#2196F3"
            />
            <StatCard
              title="Verses"
              value={stats.totalVerses}
              icon="book"
              color="#FF9800"
            />
            <StatCard
              title="Accuracy"
              value={`${stats.averageAccuracy}%`}
              icon="check-circle"
              color="#9C27B0"
            />
            <StatCard
              title="Streak"
              value={`${stats.streakDays} days`}
              icon="local-fire-department"
              color="#F44336"
            />
            <StatCard
              title="Mistakes"
              value={stats.totalMistakes}
              icon="error"
              color="#607D8B"
            />
          </View>
        </View>

        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Icon name={achievement.icon} size={24} color="#FFD700" />
                  <View style={styles.achievementText}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Session History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {filteredSessions.length > 0 && (
              <TouchableOpacity
                onPress={() => Alert.alert('Export', 'Export functionality coming soon!')}
              >
                <Icon name="download" size={24} color="#2E7D32" />
              </TouchableOpacity>
            )}
          </View>
          
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="history" size={48} color="#E0E0E0" />
              <Text style={styles.emptyStateText}>No sessions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Start your first recitation session to see your progress here
              </Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {filteredSessions.slice(0, 10).map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#2E7D32',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  currentSessionCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 16,
  },
  currentSessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentSessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  currentSessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentSessionStat: {
    fontSize: 14,
    color: '#2E7D32',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
    opacity: 0.8,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  achievementText: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  sessionsList: {
    gap: 8,
  },
  sessionItem: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#757575',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionStatText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProgressScreen;
