# Meditation Sound for Spiral Interrupt Protocol

## Required Audio File

Add a meditation/ambient sound file here for the 90-second spiral interrupt protocol.

### File Requirements

- **Name**: `meditation.mp3` (or update the path in `/app/spiral.tsx`)
- **Duration**: 2-5 minutes (will loop automatically)
- **Format**: MP3, M4A, or WAV
- **Quality**: 128-192 kbps is sufficient for mobile
- **Characteristics**:
  - Calming and non-distracting
  - No lyrics or jarring sounds
  - Suitable for anxiety relief

### Recommended Types

1. **Nature Sounds**
   - Ocean waves
   - Rain/thunderstorms
   - Forest ambience
   - Gentle streams

2. **Ambient Music**
   - Soft piano
   - Singing bowls
   - Binaural beats (alpha waves 8-12 Hz)
   - Wind chimes

3. **Meditative Tones**
   - 432 Hz frequency
   - Tibetan singing bowls
   - Soft synthesizer pads

### Free Resources

- **Freesound.org** - CC0 licensed ambient sounds
- **YouTube Audio Library** - Free meditation music
- **Pixabay** - Free sound effects and music
- **Incompetech** - Royalty-free ambient music

### Implementation

Once you add the file, update this line in `/app/spiral.tsx` (line 83-85):

```typescript
// Replace this:
const audioSource = {
  uri: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
};

// With this:
const audioSource = require('@/assets/sounds/meditation.mp3');
```

**Note**: The app currently uses a placeholder meditation sound from Pixabay. Replace it with your own local file for better performance and to avoid network dependency.

### Testing

1. Add your meditation sound file to this directory
2. Update the require() path in spiral.tsx
3. Test the protocol:
   - Sound should start when "Start Protocol" is pressed
   - Sound should pause/resume with the protocol
   - Sound should loop seamlessly
   - Sound should stop when protocol completes or is skipped

### File Size Recommendations

Keep files under 5MB for optimal mobile performance:

- 2-minute MP3 @ 128kbps ≈ 1.9 MB
- 3-minute MP3 @ 192kbps ≈ 4.4 MB
