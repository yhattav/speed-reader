import { SpeedReaderManager } from './SpeedReaderManager';
import { speedReaderState } from './SpeedReaderManager';
import { jest } from '@jest/globals';

// Mock the chrome API
// global.chrome = {
//   storage: {
//     sync: {
//       get: jest.fn(),
//     },
//   },
// } as unknown as typeof chrome;

describe('SpeedReaderManager', () => {
  let manager: SpeedReaderManager;

  beforeEach(() => {
    manager = new SpeedReaderManager();
    jest.clearAllMocks();
    // (chrome.storage.sync.get as jest.Mock).mockImplementation((keys, callback) => {
    //   callback({
    //     wordsPerMinute: 400,
    //     minWords: 10,
    //     textSize: 24,
    //   });
    // });
  });

  it('constructor initializes with default settings', () => {
    expect((manager as any).settings).toEqual({
      WORDS_PER_MINUTE: 400,
      MIN_WORDS: 10,
      TEXT_SIZE: 24,
    });
  });

  test('handleMouseMove updates lastMousePosition', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200,
    });
    manager.handleMouseMove(mockEvent);
    expect(manager['lastMousePosition']).toEqual({ x: 100, y: 200 });
  });

  test('updateSettings updates settings correctly', () => {
    const changes = {
      WORDS_PER_MINUTE: { newValue: 500 },
      MIN_WORDS: { newValue: 15 },
    };
    manager.updateSettings(changes);
    expect(manager['settings'].WORDS_PER_MINUTE).toBe(500);
    expect(manager['settings'].MIN_WORDS).toBe(15);
  });

  test('cleanup calls hidePopup', () => {
    const hidePopupSpy = jest.spyOn(manager as any, 'hidePopup');
    manager.cleanup();
    expect(hidePopupSpy).toHaveBeenCalled();
  });

  test('loadSettings calls chrome.storage.sync.get', () => {
    (manager as any).loadSettings();
    expect(chrome.storage.sync.get).toHaveBeenCalledWith(
      ['wordsPerMinute', 'minWords', 'textSize'],
      expect.any(Function)
    );
  });
});
