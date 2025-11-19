/**
 * Supabase Database Types Extension for Mood Entries
 * This extends the main Database type with mood-specific tables
 */

import { Database } from './supabase';

// Extend the existing Database type
export interface MoodDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood_type: 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed' | null;
          mood_emoji: string | null;
          mood_selected_at: string | null;
          intensity_rating: number | null;
          intensity_selected_at: string | null;
          journal_text_encrypted: ArrayBuffer | null;
          journal_text_nonce: string | null;
          journal_word_count: number;
          voice_audio_path: string | null;
          voice_duration_seconds: number | null;
          voice_transcription_encrypted: ArrayBuffer | null;
          voice_transcription_nonce: string | null;
          transcription_status: 'pending' | 'processing' | 'completed' | 'failed';
          last_autosave_at: string | null;
          autosave_version: number;
          suggestion_shown: string | null;
          suggestion_type: string | null;
          suggestion_accepted: boolean | null;
          suggestion_details: Record<string, any> | null;
          suggestion_shown_at: string | null;
          suggestion_responded_at: string | null;
          status: 'draft' | 'completed' | 'abandoned';
          completed_at: string | null;
          time_spent_seconds: number | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
          device_type: string | null;
          app_version: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood_type?: 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed' | null;
          mood_emoji?: string | null;
          mood_selected_at?: string | null;
          intensity_rating?: number | null;
          intensity_selected_at?: string | null;
          journal_text_encrypted?: ArrayBuffer | null;
          journal_text_nonce?: string | null;
          journal_word_count?: number;
          voice_audio_path?: string | null;
          voice_duration_seconds?: number | null;
          voice_transcription_encrypted?: ArrayBuffer | null;
          voice_transcription_nonce?: string | null;
          transcription_status?: 'pending' | 'processing' | 'completed' | 'failed';
          last_autosave_at?: string | null;
          autosave_version?: number;
          suggestion_shown?: string | null;
          suggestion_type?: string | null;
          suggestion_accepted?: boolean | null;
          suggestion_details?: Record<string, any> | null;
          suggestion_shown_at?: string | null;
          suggestion_responded_at?: string | null;
          status?: 'draft' | 'completed' | 'abandoned';
          completed_at?: string | null;
          time_spent_seconds?: number | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          device_type?: string | null;
          app_version?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood_type?: 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed' | null;
          mood_emoji?: string | null;
          mood_selected_at?: string | null;
          intensity_rating?: number | null;
          intensity_selected_at?: string | null;
          journal_text_encrypted?: ArrayBuffer | null;
          journal_text_nonce?: string | null;
          journal_word_count?: number;
          voice_audio_path?: string | null;
          voice_duration_seconds?: number | null;
          voice_transcription_encrypted?: ArrayBuffer | null;
          voice_transcription_nonce?: string | null;
          transcription_status?: 'pending' | 'processing' | 'completed' | 'failed';
          last_autosave_at?: string | null;
          autosave_version?: number;
          suggestion_shown?: string | null;
          suggestion_type?: string | null;
          suggestion_accepted?: boolean | null;
          suggestion_details?: Record<string, any> | null;
          suggestion_shown_at?: string | null;
          suggestion_responded_at?: string | null;
          status?: 'draft' | 'completed' | 'abandoned';
          completed_at?: string | null;
          time_spent_seconds?: number | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          device_type?: string | null;
          app_version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'mood_entries_user_fk';
            columns: ['user_id'];
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      user_encryption_keys: {
        Row: {
          user_id: string;
          encrypted_master_key: ArrayBuffer;
          key_derivation_salt: string;
          algorithm: string;
          key_version: number;
          previous_key: ArrayBuffer | null;
          rotated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          encrypted_master_key: ArrayBuffer;
          key_derivation_salt: string;
          algorithm?: string;
          key_version?: number;
          previous_key?: ArrayBuffer | null;
          rotated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          encrypted_master_key?: ArrayBuffer;
          key_derivation_salt?: string;
          algorithm?: string;
          key_version?: number;
          previous_key?: ArrayBuffer | null;
          rotated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_encryption_keys_user_fk';
            columns: ['user_id'];
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
    };
    Enums: Database['public']['Enums'] & {
      mood_type: 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed';
      mood_entry_status: 'draft' | 'completed' | 'abandoned';
      transcription_status: 'pending' | 'processing' | 'completed' | 'failed';
    };
    Functions: {
      get_user_mood_history: {
        Args: {
          p_user_id: string;
          p_limit?: number;
          p_offset?: number;
          p_include_drafts?: boolean;
        };
        Returns: {
          id: string;
          mood_type: 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed' | null;
          mood_emoji: string | null;
          intensity_rating: number | null;
          journal_word_count: number;
          status: 'draft' | 'completed' | 'abandoned';
          completed_at: string | null;
          created_at: string;
          time_spent_seconds: number | null;
        }[];
      };
      get_mood_patterns: {
        Args: {
          p_user_id: string;
          p_days?: number;
        };
        Returns: {
          total_entries: number;
          most_common_mood: 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed';
          avg_intensity: number;
          entries_by_mood: Record<string, number>;
          completion_rate: number;
        }[];
      };
      cleanup_old_mood_drafts: {
        Args: Record<string, never>;
        Returns: number;
      };
      hard_delete_old_mood_entries: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
  };
}

// Type helper to extract table row types
export type MoodEntry = MoodDatabase['public']['Tables']['mood_entries']['Row'];
export type MoodEntryInsert = MoodDatabase['public']['Tables']['mood_entries']['Insert'];
export type MoodEntryUpdate = MoodDatabase['public']['Tables']['mood_entries']['Update'];

export type UserEncryptionKey = MoodDatabase['public']['Tables']['user_encryption_keys']['Row'];
export type UserEncryptionKeyInsert =
  MoodDatabase['public']['Tables']['user_encryption_keys']['Insert'];
export type UserEncryptionKeyUpdate =
  MoodDatabase['public']['Tables']['user_encryption_keys']['Update'];

// Type helper for enums
export type MoodTypeEnum = MoodDatabase['public']['Enums']['mood_type'];
export type MoodEntryStatusEnum = MoodDatabase['public']['Enums']['mood_entry_status'];
export type TranscriptionStatusEnum = MoodDatabase['public']['Enums']['transcription_status'];
