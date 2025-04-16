import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { type GenerationCallbacks, type GenerationOptions, type GenerationResult, LLMEvaluator, type MLXOptions } from './LLMEvaluator';

/**
 * Hook for easily using MLX in React components
 *
 * @example
 * ```tsx
 * const llm = useLLMEvaluator({
 *   model: "llama-3.2",
 *   context: "...",
 *   systemPrompt: ""
 * })
 *
 * await llm.generate(prompt)
 * console.log(llm.response)
 * ```
 */
export function useLLMEvaluator(options: MLXOptions) {
  const [instance] = useState(() => new LLMEvaluator());
  const [, setIsLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        await instance.load(options);
      } catch (error) {
        console.error('Error loading MLX model:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    // Set up listeners for state changes
    const stateListener = instance.addEventListener('onStateChange', () => {
      // State is already updated in the instance
    });

    return () => {
      instance.removeEventListener(stateListener);
    };
  }, [options.model]);

  return instance;
}

/**
 * Hook for streaming model generation with React state
 *
 * @example
 * ```tsx
 * const { text, isGenerating, generate, error } = useMLXGeneration({
 *   model: "llama-3.2"
 * });
 *
 * // Text will update in real-time as tokens are generated
 * <button onClick={() => generate("Tell me about React")}>Generate</button>
 * <div>{text}</div>
 * ```
 */
export function useMLXGeneration(options: MLXOptions) {
  const [instance] = useState(() => new LLMEvaluator());
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<{ tokensPerSecond?: number }>({});

  // Load model when hook is initialized
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await instance.load(options);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    // Set up state listener
    const stateListener = instance.addEventListener('onStateChange', (state) => {
      setIsGenerating(state.isGenerating);
    });

    return () => {
      instance.removeEventListener(stateListener);
    };
  }, [options.model]);

  // Generate function with streaming updates
  const generate = useCallback(async (prompt: string) => {
    setText('');
    setError(null);

    try {
      const callbacks: GenerationCallbacks = {
        onToken: (_, fullText) => {
          setText(fullText);
        },
        onComplete: (result) => {
          setStats({ tokensPerSecond: result.tokensPerSecond });
        },
        onError: (err) => {
          setError(err);
        }
      };

      await instance.generateWithCallbacks(prompt, callbacks);
      return instance.response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, [instance]);

  return {
    text,
    generate,
    isLoading,
    isGenerating,
    error,
    stats,
    model: instance,
    abort: instance.abort.bind(instance)
  };
}

// MLX Context Provider

interface MLXModels {
  [key: string]: MLXOptions;
}

interface MLXContextValue {
  getModel: (modelKey: string) => LLMEvaluator | undefined;
  isModelLoaded: (modelKey: string) => boolean;
  generateWithModel: (modelKey: string, prompt: string, options?: GenerationOptions) => Promise<GenerationResult>;
}

const MLXContext = createContext<MLXContextValue | null>(null);

export interface MLXProviderProps {
  children: ReactNode;
  models: MLXModels;
  defaultOptions?: Partial<MLXOptions>;
}

/**
 * Provider component to manage MLX models throughout your app
 *
 * @example
 * ```tsx
 * <MLXProvider
 *   models={{
 *     chat: { model: "llama-3.2" },
 *     completion: { model: "phi-3" }
 *   }}
 *   defaultOptions={{ temperature: 0.7 }}
 * >
 *   <App />
 * </MLXProvider>
 * ```
 */
export function MLXProvider({ children, models, defaultOptions = {} }: MLXProviderProps) {
  // Track all initialized models
  const [modelInstances, setModelInstances] = useState<Record<string, LLMEvaluator>>({});
  const [loadedModels, setLoadedModels] = useState<Record<string, boolean>>({});

  // Initialize models on mount
  useEffect(() => {
    const instances: Record<string, LLMEvaluator> = {};

    // Create instances for each model
    Object.entries(models).forEach(([key, options]) => {
      const mergedOptions = { ...defaultOptions, ...options };
      const instance = new LLMEvaluator();
      instances[key] = instance;

      // Load the model
      instance.load(mergedOptions).then(() => {
        setLoadedModels(prev => ({ ...prev, [key]: true }));
      }).catch(err => {
        console.error(`Error loading model ${key}:`, err);
        setLoadedModels(prev => ({ ...prev, [key]: false }));
      });

      // Set up state listener to track loading state
      instance.addEventListener('onStateChange', (state) => {
        if (state.isLoaded) {
          setLoadedModels(prev => ({ ...prev, [key]: true }));
        }
      });
    });

    setModelInstances(instances);

    // Cleanup function
    return () => {
      // No explicit cleanup needed for model instances
    };
  }, []);

  // Create context value with helper methods
  const contextValue = useMemo<MLXContextValue>(() => ({
    getModel: (modelKey: string) => modelInstances[modelKey],
    isModelLoaded: (modelKey: string) => !!loadedModels[modelKey],
    generateWithModel: async (modelKey: string, prompt: string, options?: GenerationOptions) => {
      const model = modelInstances[modelKey];
      if (!model) {
        throw new Error(`Model with key "${modelKey}" not found`);
      }

      // Create a promise to track result
      return new Promise((resolve, reject) => {
        const callbacks: GenerationCallbacks = {
          onComplete: (result) => {
            resolve(result);
          },
          onError: (error) => {
            reject(error);
          }
        };

        model.generateWithCallbacks(prompt, callbacks, options).catch(reject);
      });
    }
  }), [modelInstances, loadedModels]);

  return (
    <MLXContext.Provider value={contextValue}>
      {children}
    </MLXContext.Provider>
  );
}

/**
 * Hook to access MLX models from the context
 *
 * @example
 * ```tsx
 * const { generateWithModel, isModelLoaded } = useMLX();
 *
 * async function handleSubmit() {
 *   if (isModelLoaded('chat')) {
 *     const result = await generateWithModel('chat', 'Hello');
 *     console.log(result.text);
 *   }
 * }
 * ```
 */
export function useMLX() {
  const context = useContext(MLXContext);
  if (!context) {
    throw new Error('useMLX must be used within a MLXProvider');
  }
  return context;
}

/**
 * Hook to access a specific MLX model from the context with streaming capabilities
 *
 * @example
 * ```tsx
 * const { text, generate, isGenerating } = useMLXModel('chat');
 *
 * // Text updates in real-time as tokens are generated
 * <button onClick={() => generate('Tell me about React')}>Generate</button>
 * <div>{text}</div>
 * ```
 */
export function useMLXModel(modelKey: string) {
  const context = useContext(MLXContext);
  if (!context) {
    throw new Error('useMLXModel must be used within a MLXProvider');
  }

  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const model = context.getModel(modelKey);
  const isLoaded = context.isModelLoaded(modelKey);

  useEffect(() => {
    if (!model) return;

    // Set up listeners for token generation and state changes
    const tokenListener = model.addEventListener('onTokenGeneration', () => {
      setText(model.response);
    });

    const stateListener = model.addEventListener('onStateChange', (state) => {
      setIsGenerating(state.isGenerating);
    });

    return () => {
      model.removeEventListener(tokenListener);
      model.removeEventListener(stateListener);
    };
  }, [model]);

  const generate = useCallback(async (prompt: string, options?: GenerationOptions) => {
    if (!model) {
      throw new Error(`Model with key "${modelKey}" not found`);
    }

    setText('');
    setError(null);

    try {
      return await model.generateWithCallbacks(prompt, {
        onError: (err) => {
          setError(err);
        }
      }, options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [model, modelKey]);

  const abort = useCallback(() => {
    model?.abort();
  }, [model]);

  return {
    text,
    generate,
    isGenerating,
    isLoaded,
    error,
    abort,
    model
  };
}
