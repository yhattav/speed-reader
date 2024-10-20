/// <reference types="svelte" />
declare global {
    // namespace jest {
    // //   interface MockInstance<T, Y extends any[]> {
    // //     mockImplementation(fn: (...args: Y) => T): this;
    // //   }
    // }
  
    var chrome: {
      storage: {
        sync: {
          get: jest.MockInstance<void, [string[] | null, (items: { [key: string]: any }) => void]>;
          set: jest.MockInstance<void, [{ [key: string]: any }, (() => void) | undefined]>;
        };
      };
    };
  }
  
  export {};