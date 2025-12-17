/**
 * Quran Database Service - Mobile implementation
 * Handles Quran text, verses, and recitation validation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SurahInfo {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  totalVerses: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationOrder: number;
  description: string;
}

export interface VerseInfo {
  textArabic: string;
  textTransliteration: string;
  textEnglish: string;
  words: string[];
  wordCount: number;
}

export interface ValidationResult {
  isValid: boolean;
  accuracy: number;
  mistakes: MistakeInfo[];
  missingWords: string[];
  extraWords: string[];
}

export interface MistakeInfo {
  type: 'pronunciation' | 'omission' | 'addition';
  expected?: string;
  recited?: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
}

class QuranDatabaseClass {
  private surahs: Map<number, SurahInfo> = new Map();
  private verses: Map<string, VerseInfo> = new Map();
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    try {
      // Load data from AsyncStorage or create default data
      await this.loadData();
      this.isInitialized = true;
      console.log('QuranDatabase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize QuranDatabase:', error);
      throw error;
    }
  }

  private async loadData(): Promise<void> {
    try {
      // Try to load from AsyncStorage first
      const storedSurahs = await AsyncStorage.getItem('quran_surahs');
      const storedVerses = await AsyncStorage.getItem('quran_verses');

      if (storedSurahs && storedVerses) {
        this.surahs = new Map(JSON.parse(storedSurahs));
        this.verses = new Map(JSON.parse(storedVerses));
        console.log('Loaded Quran data from storage');
      } else {
        // Create default data
        await this.createDefaultData();
        console.log('Created default Quran data');
      }
    } catch (error) {
      console.error('Error loading Quran data:', error);
      await this.createDefaultData();
    }
  }

  private async createDefaultData(): Promise<void> {
    // Sample surahs data
    const defaultSurahs: SurahInfo[] = [
      {
        number: 1,
        nameArabic: 'الفاتحة',
        nameEnglish: 'Al-Fatiha',
        nameTransliteration: 'Al-Fatiha',
        totalVerses: 7,
        revelationType: 'Meccan',
        revelationOrder: 5,
        description: 'The Opening - The first chapter of the Quran',
      },
      {
        number: 2,
        nameArabic: 'البقرة',
        nameEnglish: 'Al-Baqarah',
        nameTransliteration: 'Al-Baqarah',
        totalVerses: 286,
        revelationType: 'Medinan',
        revelationOrder: 87,
        description: 'The Cow - The longest chapter of the Quran',
      },
      {
        number: 36,
        nameArabic: 'يس',
        nameEnglish: 'Yaseen',
        nameTransliteration: 'Yaseen',
        totalVerses: 83,
        revelationType: 'Meccan',
        revelationOrder: 41,
        description: 'Yaseen - Often called the heart of the Quran',
      },
    ];

    // Sample verses data (Al-Fatiha)
    const defaultVerses: { [key: string]: VerseInfo } = {
      '1:1': {
        textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        textTransliteration: 'Bismillahi ar-Rahman ar-Raheem',
        textEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        words: ['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ'],
        wordCount: 4,
      },
      '1:2': {
        textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        textTransliteration: 'Al-hamdu lillahi rabbi al-alameen',
        textEnglish: 'All praise is due to Allah, Lord of the worlds.',
        words: ['الْحَمْدُ', 'لِلَّهِ', 'رَبِّ', 'الْعَالَمِينَ'],
        wordCount: 4,
      },
      '1:3': {
        textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        textTransliteration: 'Ar-Rahman ar-Raheem',
        textEnglish: 'The Entirely Merciful, the Especially Merciful.',
        words: ['الرَّحْمَٰنِ', 'الرَّحِيمِ'],
        wordCount: 2,
      },
      '1:4': {
        textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
        textTransliteration: 'Maliki yawmi ad-deen',
        textEnglish: 'Sovereign of the Day of Recompense.',
        words: ['مَالِكِ', 'يَوْمِ', 'الدِّينِ'],
        wordCount: 3,
      },
      '1:5': {
        textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        textTransliteration: 'Iyyaka na\'budu wa iyyaka nasta\'een',
        textEnglish: 'It is You we worship and You we ask for help.',
        words: ['إِيَّاكَ', 'نَعْبُدُ', 'وَإِيَّاكَ', 'نَسْتَعِينُ'],
        wordCount: 4,
      },
      '1:6': {
        textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        textTransliteration: 'Ihdina as-sirata al-mustaqeem',
        textEnglish: 'Guide us to the straight path.',
        words: ['اهْدِنَا', 'الصِّرَاطَ', 'الْمُسْتَقِيمَ'],
        wordCount: 3,
      },
      '1:7': {
        textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        textTransliteration: 'Sirata alladhina an\'amta \'alayhim ghayri al-maghdubi \'alayhim wa la ad-dalleen',
        textEnglish: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
        words: ['صِرَاطَ', 'الَّذِينَ', 'أَنْعَمْتَ', 'عَلَيْهِمْ', 'غَيْرِ', 'الْمَغْضُوبِ', 'عَلَيْهِمْ', 'وَلَا', 'الضَّالِّينَ'],
        wordCount: 9,
      },
    };

    // Store in memory
    defaultSurahs.forEach(surah => {
      this.surahs.set(surah.number, surah);
    });

    Object.entries(defaultVerses).forEach(([key, verse]) => {
      this.verses.set(key, verse);
    });

    // Save to AsyncStorage
    await this.saveData();
  }

  private async saveData(): Promise<void> {
    try {
      await AsyncStorage.setItem('quran_surahs', JSON.stringify([...this.surahs]));
      await AsyncStorage.setItem('quran_verses', JSON.stringify([...this.verses]));
    } catch (error) {
      console.error('Error saving Quran data:', error);
    }
  }

  getSurahInfo(surahNumber: number): SurahInfo | null {
    return this.surahs.get(surahNumber) || null;
  }

  getVerse(surahNumber: number, verseNumber: number): VerseInfo | null {
    const key = `${surahNumber}:${verseNumber}`;
    return this.verses.get(key) || null;
  }

  getVerseText(surahNumber: number, verseNumber: number, textType: 'arabic' | 'transliteration' | 'english' = 'arabic'): string | null {
    const verse = this.getVerse(surahNumber, verseNumber);
    if (!verse) return null;

    switch (textType) {
      case 'arabic':
        return verse.textArabic;
      case 'transliteration':
        return verse.textTransliteration;
      case 'english':
        return verse.textEnglish;
      default:
        return verse.textArabic;
    }
  }

  getVerseWords(surahNumber: number, verseNumber: number): string[] {
    const verse = this.getVerse(surahNumber, verseNumber);
    return verse ? verse.words : [];
  }

  getNextVerse(surahNumber: number, verseNumber: number): { surah: number; verse: number } | null {
    const surahInfo = this.getSurahInfo(surahNumber);
    if (!surahInfo) return null;

    if (verseNumber < surahInfo.totalVerses) {
      return { surah: surahNumber, verse: verseNumber + 1 };
    } else {
      // Move to next surah
      const nextSurah = surahNumber + 1;
      if (nextSurah <= 114) { // Total surahs in Quran
        return { surah: nextSurah, verse: 1 };
      }
    }

    return null;
  }

  getPreviousVerse(surahNumber: number, verseNumber: number): { surah: number; verse: number } | null {
    if (verseNumber > 1) {
      return { surah: surahNumber, verse: verseNumber - 1 };
    } else {
      // Move to previous surah
      const prevSurah = surahNumber - 1;
      if (prevSurah >= 1) {
        const prevSurahInfo = this.getSurahInfo(prevSurah);
        if (prevSurahInfo) {
          return { surah: prevSurah, verse: prevSurahInfo.totalVerses };
        }
      }
    }

    return null;
  }

  getAllSurahs(): SurahInfo[] {
    return Array.from(this.surahs.values()).sort((a, b) => a.number - b.number);
  }

  getSurahVerses(surahNumber: number): VerseInfo[] {
    const verses: VerseInfo[] = [];
    const surahInfo = this.getSurahInfo(surahNumber);
    
    if (surahInfo) {
      for (let i = 1; i <= surahInfo.totalVerses; i++) {
        const verse = this.getVerse(surahNumber, i);
        if (verse) {
          verses.push(verse);
        }
      }
    }

    return verses;
  }

  validateRecitation(surahNumber: number, verseNumber: number, recitedText: string): ValidationResult {
    const expectedVerse = this.getVerse(surahNumber, verseNumber);
    if (!expectedVerse) {
      return {
        isValid: false,
        accuracy: 0,
        mistakes: [],
        missingWords: [],
        extraWords: [],
      };
    }

    const expectedWords = expectedVerse.words;
    const recitedWords = recitedText.split(/\s+/).filter(word => word.length > 0);
    
    const mistakes: MistakeInfo[] = [];
    const missingWords: string[] = [];
    const extraWords: string[] = [];

    // Check for missing words
    expectedWords.forEach((expectedWord, index) => {
      if (index >= recitedWords.length) {
        missingWords.push(expectedWord);
        mistakes.push({
          type: 'omission',
          expected: expectedWord,
          position: index,
          severity: 'high',
        });
      } else {
        const recitedWord = recitedWords[index];
        const similarity = this.calculateSimilarity(expectedWord, recitedWord);
        
        if (similarity < 0.7) { // 70% similarity threshold
          mistakes.push({
            type: 'pronunciation',
            expected: expectedWord,
            recited: recitedWord,
            position: index,
            severity: similarity < 0.3 ? 'high' : 'medium',
          });
        }
      }
    });

    // Check for extra words
    if (recitedWords.length > expectedWords.length) {
      const extra = recitedWords.slice(expectedWords.length);
      extraWords.push(...extra);
      mistakes.push({
        type: 'addition',
        position: expectedWords.length,
        severity: 'medium',
      });
    }

    // Calculate accuracy
    const correctWords = expectedWords.length - missingWords.length - mistakes.filter(m => m.type === 'pronunciation').length;
    const accuracy = (correctWords / expectedWords.length) * 100;

    return {
      isValid: accuracy >= 70, // 70% accuracy threshold
      accuracy,
      mistakes,
      missingWords,
      extraWords,
    };
  }

  private calculateSimilarity(word1: string, word2: string): number {
    // Simple similarity calculation (in production, use more sophisticated methods)
    if (word1 === word2) return 1.0;

    // Remove diacritics for comparison
    const clean1 = this.removeDiacritics(word1);
    const clean2 = this.removeDiacritics(word2);

    if (clean1 === clean2) return 0.9;

    // Calculate character-level similarity
    const maxLen = Math.max(clean1.length, clean2.length);
    if (maxLen === 0) return 0.0;

    let matches = 0;
    const minLen = Math.min(clean1.length, clean2.length);
    
    for (let i = 0; i < minLen; i++) {
      if (clean1[i] === clean2[i]) {
        matches++;
      }
    }

    return matches / maxLen;
  }

  private removeDiacritics(text: string): string {
    const diacritics = ['َ', 'ُ', 'ِ', 'ً', 'ٌ', 'ٍ', 'ْ', 'ّ', 'ٰ', 'ٖ', 'ٗ', 'ٙ', 'ٚ', 'ٛ', 'ٜ', 'ٝ', 'ٞ', 'ٟ'];
    let result = text;
    diacritics.forEach(diacritic => {
      result = result.replace(new RegExp(diacritic, 'g'), '');
    });
    return result;
  }

  searchVerses(query: string, searchType: 'arabic' | 'transliteration' | 'english' = 'arabic'): Array<{ surah: number; verse: number; text: string; surahName: string }> {
    const results: Array<{ surah: number; verse: number; text: string; surahName: string }> = [];
    const queryLower = query.toLowerCase();

    this.verses.forEach((verse, key) => {
      const [surahNum, verseNum] = key.split(':').map(Number);
      const surahInfo = this.getSurahInfo(surahNum);
      
      if (surahInfo) {
        let text = '';
        switch (searchType) {
          case 'arabic':
            text = verse.textArabic;
            break;
          case 'transliteration':
            text = verse.textTransliteration;
            break;
          case 'english':
            text = verse.textEnglish;
            break;
        }

        if (text.toLowerCase().includes(queryLower)) {
          results.push({
            surah: surahNum,
            verse: verseNum,
            text,
            surahName: surahInfo.nameEnglish,
          });
        }
      }
    });

    return results;
  }

  getCommonMistakes(surahNumber: number, verseNumber: number): string[] {
    // This would contain common pronunciation mistakes for specific verses
    // For now, returning sample data
    const commonMistakes: { [key: string]: string[] } = {
      '1:1': ['Mispronouncing "Bismillah"', 'Incorrect elongation of "Rahman"'],
      '1:2': ['Skipping "Al-hamdu"', 'Incorrect pronunciation of "al-alameen"'],
    };

    const key = `${surahNumber}:${verseNumber}`;
    return commonMistakes[key] || [];
  }

  getRecitationTips(surahNumber: number, verseNumber: number): string[] {
    const tips = [
      'Take your time with each word',
      'Focus on proper pronunciation',
      'Maintain steady rhythm',
      'Breathe naturally between verses',
    ];

    const verse = this.getVerse(surahNumber, verseNumber);
    if (verse) {
      if (verse.wordCount > 6) {
        tips.push('This verse has many words - practice slowly');
      }
      if (verse.textArabic.includes('اللَّهِ')) {
        tips.push('Pay special attention to the pronunciation of "Allah"');
      }
    }

    return tips;
  }
}

export const QuranDatabase = new QuranDatabaseClass();
